import {
  useContext,
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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
  fetchReportingManagersApi,
} from "../../services/employeeService";

import "./EmployeesPage.css";

function EmployeesPage() {

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem("role");

  const company =
    localStorage.getItem("company") ||
    "Stackly";

  const currentPlan =
    localStorage.getItem("plan") ||
    "Free";

  const planLimits = {
    Free: 5,
    Professional: 25,
    Enterprise: 200,
  };

  const employeeLimit =
    planLimits[currentPlan] || 5;

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
    popupMessage,
    setPopupMessage,
  ] = useState("");

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

  const [
    reportingManagers,
    setReportingManagers,
  ] = useState([]);

  const employeesPerPage = 5;

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: "",
      department: "",
      city: "",
      phone: "",
      company: company,
      status: "Active",
      joinedDate: "",
      reportingManagerId: "",
    });

  const isEmployeeLimitReached =
    employees.length >= employeeLimit;

  const canAddEmployee =
    isAdmin && !isEmployeeLimitReached;

  useEffect(() => {
    loadEmployees();
    loadReportingManagers();
  }, []);

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

  const loadReportingManagers = async () => {

    try {

      const data =
        await fetchReportingManagersApi();

      setReportingManagers(data);

    } catch (error) {

      console.log(error);

      setReportingManagers([]);

    }

  };

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    if (name === "phone") {

      const onlyNumbers =
        value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const isPhoneValid =
    formData.phone.trim() === "" ||
    formData.phone.trim().length === 10;

  const isEmployeeFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.role.trim() !== "" &&
    formData.department.trim() !== "" &&
    isPhoneValid;

  const resetForm = () => {

    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      city: "",
      phone: "",
      company: company,
      status: "Active",
      joinedDate: "",
      reportingManagerId: "",
    });

    setEditEmployeeId(null);

  };

  const openAddModal = () => {

    if (!isAdmin) return;

    if (isEmployeeLimitReached) {

      setPopupMessage(
        "Upgrade your plan to add employees"
      );

      setTimeout(() => {
        setPopupMessage("");
      }, 3000);

      return;

    }

    resetForm();

    loadReportingManagers();

    setShowModal(true);

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!isEmployeeFormValid) {

      if (!isPhoneValid) {

        setPopupMessage(
          "Phone number must be 10 digits"
        );

        setTimeout(() => {
          setPopupMessage("");
        }, 3000);

      }

      return;
    }

    if (!editEmployeeId && isEmployeeLimitReached) {

      setPopupMessage(
        "Upgrade your plan to add employees"
      );

      setTimeout(() => {
        setPopupMessage("");
      }, 3000);

      return;

    }

    const employeeData = {
      ...formData,
      company: company,
      status: formData.status || "Active",
    };

    try {

      if (editEmployeeId) {

        await updateEmployeeApi(
          editEmployeeId,
          employeeData
        );

        addNotification(
          `${formData.name} updated`
        );

        setSuccessMessage(
          "Employee Updated Successfully"
        );

      } else {

        const response =
          await addEmployeeApi(
            employeeData
          );

        if (
          response.data.message ===
          "Employee Already Exists"
        ) {

          setPopupMessage(
            "Employee Already Exists"
          );

          setTimeout(() => {
            setPopupMessage("");
          }, 3000);

          return;

        }

        addNotification(
          `${formData.name} added`
        );

        setSuccessMessage(
          "Employee Added Successfully"
        );

      }

      await loadEmployees();

      await loadReportingManagers();

      resetForm();

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

  const handleEdit = (employee) => {

    if (!isAdmin) return;

    const phoneNumber =
      (employee.phone || "")
        .replace(/\D/g, "")
        .slice(0, 10);

    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role || "",
      department: employee.department || "",
      city: employee.city || "",
      phone: phoneNumber,
      company: employee.company || company,
      status: employee.status || "Active",
      joinedDate: employee.joinedDate || "",
      reportingManagerId:
        employee.reportingManagerId || "",
    });

    setEditEmployeeId(
      employee.id
    );

    loadReportingManagers();

    setShowModal(true);

  };

  const getStatusNotificationMessage = (
    employeeName,
    status
  ) => {

    if (status === "Active") {

      return `${employeeName} is now Active`;

    }

    if (status === "Inactive") {

      return `${employeeName} is now Inactive`;

    }

    if (status === "On Leave") {

      return `${employeeName} is on Leave`;

    }

    return `${employeeName} status changed to ${status}`;

  };

  const handleStatusChange = async (
    employee,
    newStatus
  ) => {

    if (!isAdmin) return;

    try {

      const updatedEmployee = {
        ...employee,
        status: newStatus,
        company: company,
      };

      await updateEmployeeApi(
        employee.id,
        updatedEmployee
      );

      const notificationMessage =
        getStatusNotificationMessage(
          employee.name,
          newStatus
        );

      addNotification(
        notificationMessage
      );

      setSuccessMessage(
        notificationMessage
      );

      await loadEmployees();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {

      console.log(error);

      setError(
        "Status Update Failed"
      );

    }

  };

  const handleDelete = async () => {

    try {

      await deleteEmployeeApi(
        selectedEmployee.id
      );

      addNotification(
        `${selectedEmployee.name} deleted`
      );

      await loadEmployees();

      await loadReportingManagers();

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

  const openEmployeeDetails = (employee) => {

    navigate(
      `/employees/${employee.id}`
    );

  };

  const filteredEmployees =
    employees.filter((employee) => {

      const searchText =
        (searchValue || "")
          .toLowerCase();

      const matchesSearch =
        (employee.name || "")
          .toLowerCase()
          .includes(searchText)
        ||
        (employee.email || "")
          .toLowerCase()
          .includes(searchText)
        ||
        (employee.department || "")
          .toLowerCase()
          .includes(searchText)
        ||
        (employee.role || "")
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        departmentFilter === "" ||
        employee.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );

    });

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

  const lastIndex =
    currentPage * employeesPerPage;

  const firstIndex =
    lastIndex - employeesPerPage;

  const currentEmployees =
    sortedEmployees.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      sortedEmployees.length /
        employeesPerPage
    ) || 1;

  const getInitials = (name) => {

    if (!name) return "NA";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  };

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

      {
        popupMessage && (

          <div className="popup-message error-popup">
            {popupMessage}
          </div>

        )
      }

      <div className="employees-header">

        <div>

          <h1>
            Employees
          </h1>

          <p>
            Manage employee records, roles, reporting managers and status.
          </p>

          <p>
            Company: {company} | Plan: {currentPlan} | Employees: {employees.length} / {employeeLimit}
          </p>

        </div>

        <button
          className="add-btn"
          disabled={!canAddEmployee}
          title={
            !isAdmin
              ? "Only Admin Can Perform This Action"
              : isEmployeeLimitReached
              ? "Upgrade your plan to add employees"
              : ""
          }
          onClick={openAddModal}
        >
          + Add Employee
        </button>

      </div>

      {
        isAdmin &&
        isEmployeeLimitReached && (

          <div className="error-message">
            Upgrade your plan to add employees. Your {currentPlan} plan allows only {employeeLimit} employees.
          </div>

        )
      }

      {!isAdmin && (

        <div className="error-message">
          You are logged in as Normal User.
          Add, Edit and Delete actions are disabled.
        </div>

      )}

      {successMessage && (

        <div className="success-message">
          {successMessage}
        </div>

      )}

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
              employees
                .map(
                  (employee) =>
                    employee.department
                )
                .filter(Boolean)
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

      {showModal && (

        <div className="modal-overlay">

          <div className="employee-modal employee-modal-large">

            <div className="modal-title-row">

              <h2>
                {editEmployeeId
                  ? "Edit Employee"
                  : "Add Employee"}
              </h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={(event) => {

                event.preventDefault();

                const confirmAction =
                  window.confirm(
                    editEmployeeId
                      ? "Are you sure you want to update this employee?"
                      : "Are you sure you want to add this employee?"
                  );

                if (!confirmAction) return;

                handleSubmit(event);

              }}
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Employee Name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Role *
                  </label>

                  <input
                    type="text"
                    name="role"
                    placeholder="Example: Financial Analyst"
                    value={formData.role}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Department *
                  </label>

                  <input
                    type="text"
                    name="department"
                    placeholder="Enter Department"
                    value={formData.department}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10 digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    inputMode="numeric"
                  />

                  {
                    formData.phone &&
                    formData.phone.length < 10 && (

                      <small className="input-error-text">
                        Phone number must be 10 digits
                      </small>

                    )
                  }

                </div>

                <div className="form-group">

                  <label>
                    Reporting Manager
                  </label>

                  <select
                    name="reportingManagerId"
                    value={formData.reportingManagerId}
                    onChange={handleChange}
                  >

                    {
                      reportingManagers.map(
                        (manager) => (

                          <option
                            key={manager.id || "none"}
                            value={manager.id}
                          >
                            {manager.label}
                          </option>

                        )
                      )
                    }

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Joined Date
                  </label>

                  <input
                    type="date"
                    name="joinedDate"
                    value={formData.joinedDate}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                    <option value="On Leave">
                      On Leave
                    </option>

                  </select>

                </div>

              </div>

              <div className="modal-buttons">

                {
                  isEmployeeFormValid && (

                    <button
                      type="submit"
                    >
                      {editEmployeeId
                        ? "Update Employee"
                        : "Add Employee"}
                    </button>

                  )
                }

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <div className="employees-table-card">

        <table className="employees-table">

          <thead>

            <tr>

              <th>
                Employee
              </th>

              <th>
                Role
              </th>

              <th>
                Department
              </th>

              <th>
                Status
              </th>

              <th>
                Joined
              </th>

              <th>
                Reporting Manager
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {
              currentEmployees.length === 0
              ? (

                <tr>
                  <td colSpan="7">
                    No employees found
                  </td>
                </tr>

              )
              : (

                currentEmployees.map(
                  (employee, index) => (

                    <tr
                      key={
                        employee.id ||
                        index
                      }
                      onClick={() =>
                        openEmployeeDetails(employee)
                      }
                      className="employee-table-row"
                    >

                      <td>

                        <div className="employee-cell">

                          <div className="employee-avatar">
                            {getInitials(employee.name)}
                          </div>

                          <div>

                            <h4>
                              {employee.name}
                            </h4>

                            <p>
                              {employee.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td>
                        {employee.role || "Employee"}
                      </td>

                      <td>
                        {employee.department}
                      </td>

                      <td
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <select
                          className={`status-select ${
                            (employee.status || "Active") === "Active"
                              ? "active"
                              : (employee.status || "Active") === "Inactive"
                              ? "inactive"
                              : "leave"
                          }`}
                          value={employee.status || "Active"}
                          disabled={!isAdmin}
                          onChange={(event) =>
                            handleStatusChange(
                              employee,
                              event.target.value
                            )
                          }
                        >

                          <option value="Active">
                            Active
                          </option>

                          <option value="Inactive">
                            Inactive
                          </option>

                          <option value="On Leave">
                            On Leave
                          </option>

                        </select>

                      </td>

                      <td>
                        {employee.joinedDate || "-"}
                      </td>

                      <td>
                        {employee.reportingManagerName || "None"}
                      </td>

                      <td
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

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

                      </td>

                    </tr>

                  )
                )

              )
            }

          </tbody>

        </table>

      </div>

      {deleteModal && (

        <div className="modal-overlay">

          <div className="employee-modal">

            <h2>
              Delete Employee
            </h2>

            <p>
              Are you sure you want to delete this employee?
            </p>

            <div className="modal-buttons">

              <button
                className="delete-btn"
                onClick={handleDelete}
              >
                Yes Delete
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setDeleteModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

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