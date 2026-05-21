import { useEffect, useState } from "react";
import { fetchEmployees } from "../../services/employeeService";

import DashboardCards from "../../components/ui/DashboardCards";
import EmployeeChart from "../../components/ui/EmployeeChart";
import EmployeeTable from "../../components/ui/EmployeeTable";

import "./DashboardPage.css";

function DashboardPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin User 👋</p>
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