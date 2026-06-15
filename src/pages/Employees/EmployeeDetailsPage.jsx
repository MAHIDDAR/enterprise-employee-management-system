import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  fetchEmployeeById,
} from "../../services/employeeService";

import "./EmployeesPage.css";

function EmployeeDetailsPage() {

  const navigate =
    useNavigate();

  const {
    employeeId,
  } = useParams();

  const [
    employee,
    setEmployee,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    loadEmployeeDetails();

  }, [employeeId]);

  const loadEmployeeDetails =
  async () => {

    const data =
      await fetchEmployeeById(
        employeeId
      );

    setEmployee(data);

    setLoading(false);

  };

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
        Loading employee details...
      </div>
    );

  }

  if (!employee || employee.message) {

    return (
      <div className="dashboard-message error">
        Employee not found
      </div>
    );

  }

  return (

    <div className="employee-details-page">

      <button
        className="back-btn"
        onClick={() => navigate("/employees")}
      >
        ← Back to Employees
      </button>

      <div className="details-card">

        <div className="details-top">

          <div className="details-avatar">
            {getInitials(employee.name)}
          </div>

          <div>

            <h1>
              {employee.name}
            </h1>

            <p>
              {employee.role || "Employee"}
            </p>

            <select
              className={`status-select ${
                (employee.status || "Active") === "Active"
                  ? "active"
                  : (employee.status || "Active") === "Inactive"
                  ? "inactive"
                  : "leave"
              }`}
              value={employee.status || "Active"}
              disabled
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

        <div className="details-grid">

          <div className="detail-box">
            <span>Email</span>
            <strong>{employee.email}</strong>
          </div>

          <div className="detail-box">
            <span>Phone Number</span>
            <strong>{employee.phone || "-"}</strong>
          </div>

          <div className="detail-box">
            <span>Department</span>
            <strong>{employee.department || "-"}</strong>
          </div>

          <div className="detail-box">
            <span>Company</span>
            <strong>{employee.company || "-"}</strong>
          </div>

          <div className="detail-box">
            <span>City</span>
            <strong>{employee.city || "-"}</strong>
          </div>

          <div className="detail-box">
            <span>Joined Date</span>
            <strong>{employee.joinedDate || "-"}</strong>
          </div>

          <div className="detail-box">
            <span>Reporting Manager</span>
            <strong>{employee.reportingManagerName || "None"}</strong>
          </div>

          <div className="detail-box">
            <span>Employee ID</span>
            <strong>EMP-{employee.id}</strong>
          </div>

        </div>

        <div className="summary-grid">

          <div className="summary-box">

            <h3>
              Attendance Summary
            </h3>

            <p>
              Present Days: 18
            </p>

            <p>
              Late Check-ins: 2
            </p>

            <p>
              Attendance Rate: 92%
            </p>

          </div>

          <div className="summary-box">

            <h3>
              Leave Summary
            </h3>

            <p>
              Leaves Taken: 3
            </p>

            <p>
              Pending Requests: 1
            </p>

            <p>
              Available Leaves: 9
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EmployeeDetailsPage;