import {
  useContext,
  useState,
  useEffect,
} from "react";

import {
  EmployeeContext,
} from "../../context/EmployeeContext";

import {
  SearchContext,
} from "../../context/SearchContext";

import {
  fetchEmployees,
  addEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "../../services/employeeService";

import "./EmployeesPage.css";

function EmployeesPage() {

  const role =
    localStorage.getItem("role");

  const isAdmin =
    role === "admin";

  const {
    employees,
    setEmployees,
    addNotification,
  } = useContext(EmployeeContext);

  const { searchValue } =
    useContext(SearchContext);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState(null);

  const [
    editEmployeeId,
    setEditEmployeeId,
  ] = useState(null);

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("");

  const [sortOrder, setSortOrder] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const employeesPerPage = 5;

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      department: "",
      city: "",
      phone: "",
    });

  useEffect(() => {
    loadEmployees();
  }, []);

  // LOAD EMPLOYEES
  const loadEmployees = async () => {

    try {

      setLoading(true);

      const data =
        await fetchEmployees();

      setEmployees(data);

      setError("");

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load employees"
      );

    } finally {

      setLoading(false);
    }
  };

  // INPUT CHANGE
  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  // ADD + UPDATE
  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    try {

      if (editEmployeeId) {

        await updateEmployeeApi(
          editEmployeeId,
          formData
        );

        addNotification(
          `${formData.name} updated`
        );

        setSuccessMessage(
          "Employee Updated Successfully"
        );

      } else {

        await addEmployeeApi(
          formData
        );

        addNotification(
          `${formData.name} added`
        );

        setSuccessMessage(
          "Employee Added Successfully"
        );
      }

      await loadEmployees();

      setFormData({
        name: "",
        email: "",
        department: "",
        city: "",
        phone: "",
      });

      setEditEmployeeId(null);

      setShowModal(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {

      console.log(error);

      setError(
        "Something went wrong"
      );
    }
  };

  // EDIT
  const handleEdit = (
    employee
  ) => {

    if (!isAdmin) return;

    setFormData({
      name: employee.name,
      email: employee.email,
      department:
        employee.department,
      city: employee.city,
      phone: employee.phone,
    });

    setEditEmployeeId(
      employee.id
    );

    setShowModal(true);
  };

  // DELETE
  const handleDelete = async () => {

    try {

      await deleteEmployeeApi(
        selectedEmployee.id
      );

      addNotification(
        `${selectedEmployee.name} deleted`
      );

      await loadEmployees();

      setDeleteModal(false);

      setSuccessMessage(
        "Employee Deleted Successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {

      console.log(error);

      setError(
        "Delete Failed"
      );
    }
  };

  // FILTER
  const filteredEmployees =
    employees.filter((employee) => {

      const matchesSearch =
        (employee.name || "")
          .toLowerCase()
          .includes(
            (searchValue || "")
              .toLowerCase()
          );

      const matchesDepartment =
        departmentFilter === "" ||
        employee.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });

  // SORT
  const sortedEmployees = [
    ...filteredEmployees,
  ].sort((a, b) => {

    if (sortOrder === "asc") {

      return a.name.localeCompare(
        b.name
      );
    }

    if (sortOrder === "desc") {

      return b.name.localeCompare(
        a.name
      );
    }

    return 0;
  });

  // PAGINATION
  const lastIndex =
    currentPage * employeesPerPage;

  const firstIndex =
    lastIndex - employeesPerPage;

  const currentEmployees =
    sortedEmployees.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    sortedEmployees.length /
      employeesPerPage
  );

  if (loading) {

    return (
      <div className="dashboard-message">
        Loading employees...
      </div>
    );
  }

  if (error) {

    return (
      <div className="dashboard-message error">
        {error}
      </div>
    );
  }

  return (

    <div className="employees-page">

      {/* HEADER */}
      <div className="employees-header">

        <div>

          <h1>Employees</h1>

          <p>
            Manage employee details
            easily.
          </p>

        </div>

        <button
          className="add-btn"
          disabled={!isAdmin}
          title={
            role !== "admin"
              ? "Only Admin Can Perform This Action"
              : ""
          }
          onClick={() => {

            if (!isAdmin) return;

            setShowModal(true);

            setEditEmployeeId(null);

            setFormData({
              name: "",
              email: "",
              department: "",
              city: "",
              phone: "",
            });
          }}
        >
          + Add Employee
        </button>

      </div>

      {/* NORMAL USER MESSAGE */}
      {!isAdmin && (

        <div className="error-message">
          You are logged in as Normal User.
          Add, Edit and Delete actions
          are disabled.
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {successMessage && (

        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* FILTERS */}
      <div className="employee-controls">

        <select
          value={departmentFilter}
          onChange={(event) =>
            setDepartmentFilter(
              event.target.value
            )
          }
        >

          <option value="">
            All Departments
          </option>

          {[
            ...new Set(
              employees.map(
                (employee) =>
                  employee.department
              )
            ),
          ].map(
            (
              department,
              index
            ) => (

              <option
                key={index}
                value={department}
              >
                {department}
              </option>
            )
          )}

        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(
              event.target.value
            )
          }
        >

          <option value="">
            Sort By
          </option>

          <option value="asc">
            A-Z
          </option>

          <option value="desc">
            Z-A
          </option>

        </select>

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div className="modal-overlay">

          <div className="employee-modal">

            <h2>
              {editEmployeeId
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <form
              onSubmit={(event) => {

                event.preventDefault();

                const confirmAction =
                  window.confirm(

                    editEmployeeId
                      ? "Are you sure you want to update this employee?"
                      : "Are you sure you want to add this employee?"
                  );

                if (
                  !confirmAction
                )
                  return;

                handleSubmit(event);
              }}
            >

              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                required
                value={formData.name}
                onChange={
                  handleChange
                }
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={
                  handleChange
                }
              />

              <select
                name="department"
                required
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select Department
                </option>

                <option>
                  HR
                </option>

                <option>
                  Development
                </option>

                <option>
                  Marketing
                </option>

                <option>
                  Finance
                </option>

              </select>

              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={formData.city}
                onChange={
                  handleChange
                }
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                required
                value={formData.phone}
                onChange={
                  handleChange
                }
              />

              <div className="modal-buttons">

                <button type="submit">

                  {editEmployeeId
                    ? "Update Employee"
                    : "Add Employee"}

                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* EMPLOYEE LIST */}
      <div className="employee-list">

        {currentEmployees.map(
          (
            employee,
            index
          ) => (

            <div
              key={
                employee.id ||
                index
              }
              className="employee-card"
              id={`employee-${employee.id}`}
            >

              <div className="employee-top">

                <div>

                  <h3>
                    {employee.name}
                  </h3>

                  <p>
                    {employee.email}
                  </p>

                </div>

                <span
                  className={
                    employee.id % 2 ===
                    0
                      ? "status active"
                      : "status inactive"
                  }
                >
                  {employee.id % 2 ===
                  0
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              <div className="employee-info">

                <p>
                  <strong>
                    Department:
                  </strong>{" "}
                  {
                    employee.department
                  }
                </p>

                <p>
                  <strong>
                    City:
                  </strong>{" "}
                  {employee.city}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {employee.phone}
                </p>

              </div>

              {/* ACTION BUTTONS */}
              <div className="employee-actions">

                <button
                  className="edit-btn"
                  disabled={!isAdmin}
                  title={
                    role !== "admin"
                      ? "Only Admin Can Perform This Action"
                      : ""
                  }
                  onClick={() =>
                    handleEdit(
                      employee
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  disabled={!isAdmin}
                  title={
                    role !== "admin"
                      ? "Only Admin Can Perform This Action"
                      : ""
                  }
                  onClick={() => {

                    if (!isAdmin)
                      return;

                    setSelectedEmployee(
                      employee
                    );

                    setDeleteModal(
                      true
                    );
                  }}
                >
                  Delete
                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* DELETE MODAL */}
      {deleteModal && (

        <div className="modal-overlay">

          <div className="employee-modal">

            <h2>
              Delete Employee
            </h2>

            <p>
              Are you sure you want
              to delete this employee?
            </p>

            <div className="modal-buttons">

              <button
                className="delete-btn"
                onClick={
                  handleDelete
                }
              >
                Yes Delete
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setDeleteModal(
                    false
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">

        <button
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          ←
        </button>

        {[...Array(totalPages)].map(
          (_, index) => (

            <button
              key={index}
              className={
                currentPage ===
                index + 1
                  ? "active-page"
                  : ""
              }
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
            >
              {index + 1}
            </button>
          )
        )}

        <button
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          →
        </button>

      </div>

    </div>
  );
}

export default EmployeesPage;