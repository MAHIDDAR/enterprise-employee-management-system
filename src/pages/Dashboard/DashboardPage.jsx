import {
  useEffect,
  useState,
} from "react";

import {
  fetchEmployees,
} from "../../services/employeeService";

import {
  getDashboardAnalyticsApi,
  getEmployeesByDepartmentApi,
  getEmployeeStatusApi,
  getRoleCountApi,
} from "../../services/analyticsService";

import DashboardCards from "../../components/ui/DashboardCards";
import EmployeeChart from "../../components/ui/EmployeeChart";
import EmployeeTable from "../../components/ui/EmployeeTable";
import AttendanceChart from "../../components/ui/AttendanceChart";
import DepartmentDistributionChart from "../../components/ui/DepartmentDistributionChart";
import RoleCountChart from "../../components/ui/RoleCountChart";

import "./DashboardPage.css";

function DashboardPage() {

  const [employees, setEmployees] =
    useState([]);

  const [analyticsData, setAnalyticsData] =
    useState({
      totalEmployees: 0,
      activeEmployees: 0,
      totalDepartments: 0,
      pendingRequests: 0,
    });

  const [
    departmentData,
    setDepartmentData,
  ] = useState([]);

  const [
    statusData,
    setStatusData,
  ] = useState([]);

  const [
    roleData,
    setRoleData,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const currentDate =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
      }
    );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {

    try {

      setLoading(true);

      const employeeData =
        await fetchEmployees();

      const dashboardAnalytics =
        await getDashboardAnalyticsApi();

      const departmentAnalytics =
        await getEmployeesByDepartmentApi();

      const statusAnalytics =
        await getEmployeeStatusApi();

      const roleAnalytics =
        await getRoleCountApi();

      setEmployees(employeeData);

      setAnalyticsData(dashboardAnalytics);

      setDepartmentData(departmentAnalytics);

      setStatusData(statusAnalytics);

      setRoleData(roleAnalytics);

      setError("");

    } catch (err) {

      console.log(err);

      setError(
        "Failed to fetch dashboard data"
      );

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (
      <div className="dashboard-message">
        Loading dashboard data...
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

    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>

          <h1>Dashboard</h1>

          <p>
            Welcome back,{" "}
            {localStorage.getItem("role") === "admin"
              ? "Admin 👋"
              : "User 👋"}
          </p>

        </div>

        <div className="dashboard-actions">

          <button
            className="date-btn"
          >
            {currentDate}
          </button>

          <button
            className="date-btn"
            onClick={loadDashboardData}
          >
            Refresh
          </button>

        </div>

      </div>

      <DashboardCards
        employees={employees}
        analyticsData={analyticsData}
      />

      <div className="dashboard-grid">

        <EmployeeChart employees={employees} />

        <EmployeeTable employees={employees} />

        <AttendanceChart
          statusData={statusData}
        />

        <DepartmentDistributionChart
          departmentData={departmentData}
        />

        <RoleCountChart
          roleData={roleData}
        />

      </div>

    </div>
  );
}

export default DashboardPage;