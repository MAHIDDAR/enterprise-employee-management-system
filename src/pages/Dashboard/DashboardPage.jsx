import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem("role");

  const plan =
    localStorage.getItem("plan") || "Free";

  const userName =
    localStorage.getItem("email") || "User";

  const company =
    localStorage.getItem("company") || "Company";

  /*
    Plan restriction is only for admins.
    Normal users dashboard remains same.
  */
  const hasAnalyticsAccess =
    role !== "admin" ||
    plan === "Professional" ||
    plan === "Enterprise";

  const [employees, setEmployees] =
    useState([]);

  const [analyticsData, setAnalyticsData] =
    useState({
      totalEmployees: 0,
      activeEmployees: 0,
      totalDepartments: 0,
      pendingRequests: 0,
      pendingRoleRequests: 0,
      pendingReactivationRequests: 0,
      pendingAttendanceAccessRequests: 0,
      pendingLeaveRequests: 0,
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

      setEmployees(employeeData);

      if (hasAnalyticsAccess) {

        const dashboardAnalytics =
          await getDashboardAnalyticsApi();

        const departmentAnalytics =
          await getEmployeesByDepartmentApi();

        const statusAnalytics =
          await getEmployeeStatusApi();

        const roleAnalytics =
          await getRoleCountApi();

        setAnalyticsData(dashboardAnalytics);

        setDepartmentData(departmentAnalytics);

        setStatusData(statusAnalytics);

        setRoleData(roleAnalytics);

      }

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

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back,{" "}
            {
              role === "admin"
              ?
              "Admin 👋"
              :
              "User 👋"
            }
          </p>

          <p>
            Company: {company}
            {
              role === "admin" &&
              <> | Plan: {plan}</>
            }
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

      {
        role === "admin" && !hasAnalyticsAccess
        ?

   <div className="analytics-plan-card">

  <h2>
    Analytics not available on your plan
  </h2>

  <p>
    Upgrade to Professional or Enterprise in{" "}
    <button
      className="settings-inline-btn"
      onClick={() => navigate("/settings")}
    >
      Settings
    </button>
    {" "}to unlock dashboard analytics, charts, and KPIs.
  </p>

</div>

        :

        <>

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

        </>

      }

    </div>
  );
}

export default DashboardPage;