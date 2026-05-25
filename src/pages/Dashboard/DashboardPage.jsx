import { useEffect, useState } from "react";
import { fetchEmployees } from "../../services/employeeService";

import DashboardCards from "../../components/ui/DashboardCards";
import EmployeeChart from "../../components/ui/EmployeeChart";
import EmployeeTable from "../../components/ui/EmployeeTable";

import "./DashboardPage.css";

function DashboardPage() {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const data = await fetchEmployees();

      setEmployees(data);

      setError("");
    } catch (err) {
      console.log(err);

      setError("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading employee data...
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

  if (employees.length === 0) {
    return (
      <div className="dashboard-message">
        No employees found
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, Admin User 👋
          </p>
        </div>

        <button className="date-btn">
          May 21, 2026
        </button>
      </div>

      <DashboardCards employees={employees} />

      <div className="dashboard-grid">
        <EmployeeChart employees={employees} />

        <EmployeeTable employees={employees} />
      </div>
    </div>
  );
}

export default DashboardPage;