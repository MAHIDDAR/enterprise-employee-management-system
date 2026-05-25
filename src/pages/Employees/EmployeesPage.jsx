import {
  useContext,
  useState,
  useEffect,
} from "react";

import { EmployeeContext } from "../../context/EmployeeContext";

import { SearchContext } from "../../context/SearchContext";

import { fetchEmployees } from "../../services/employeeService";

import "./EmployeesPage.css";

function EmployeesPage() {
  const { employees, addEmployee } =
    useContext(EmployeeContext);

  const { searchValue } =
    useContext(SearchContext);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const employeesPerPage = 4;

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

  const loadEmployees = async () => {
    try {
      setLoading(true);

      await fetchEmployees();

      setError("");
    } catch (error) {
      console.log(error);

      setError("Failed to load employees");
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

  // ADD EMPLOYEE
  const handleSubmit = (event) => {
    event.preventDefault();

    addEmployee(formData);

    setFormData({
      name: "",
      email: "",
      department: "",
      city: "",
      phone: "",
    });

    setShowModal(false);
  };

  // FILTER
  const filteredEmployees =
    employees.filter((employee) => {
      const matchesSearch =
        employee.name
          ?.toLowerCase()
          .includes(
            searchValue.toLowerCase()
          );

      const matchesDepartment =
        departmentFilter === "" ||
        (employee.company?.name ||
          employee.department) ===
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
        <h1>Employees</h1>

        <button
          className="add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          Add Employee
        </button>
      </div>

      {/* FILTERS */}
      <div className="employee-controls">
        {/* DEPARTMENT FILTER */}
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
                  employee.company?.name ||
                  employee.department
              )
            ),
          ].map((department, index) => (
            <option
              key={index}
              value={department}
            >
              {department}
            </option>
          ))}
        </select>

        {/* SORT */}
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

      {/* ADD EMPLOYEE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <h2>
              Add New Employee
            </h2>

            <form
              onSubmit={handleSubmit}
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
                  Add Employee
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
          (employee, index) => (
            <div
              key={employee.id || index}
              id={`employee-${employee.id}`}
              className="employee-card"
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
                  {employee.company?.name ||
                    employee.department ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    City:
                  </strong>{" "}
                  {employee.address?.city ||
                    employee.city ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {employee.phone}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Prev
        </button>

        <span>
          Page {currentPage} of{" "}
          {totalPages}
        </span>

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeesPage;