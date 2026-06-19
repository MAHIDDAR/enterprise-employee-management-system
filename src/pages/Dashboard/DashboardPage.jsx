import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

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

  const company =
    localStorage.getItem("company") || "Stackly";

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

  const [
    securityData,
    setSecurityData,
  ] = useState({
    cards: {
      securityAlertsToday: 0,
      openAlerts: 0,
      resolvedAlerts: 0,
      criticalAlerts: 0,
    },
    topRiskUsers: [],
    topRiskCompanies: [],
    recentEvents: [],
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const currentDate =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadSecuritySummary = async () => {

    try {

      const response =
        await axios.get(
          `http://127.0.0.1:8000/auth/security-summary?company=${company}`
        );

      setSecurityData(
        response.data
      );

    } catch (error) {

      console.log(error);

      setSecurityData({
        cards: {
          securityAlertsToday: 0,
          openAlerts: 0,
          resolvedAlerts: 0,
          criticalAlerts: 0,
        },
        topRiskUsers: [],
        topRiskCompanies: [],
        recentEvents: [],
      });

    }

  };

  const loadDashboardData = async () => {

    try {

      setLoading(true);

      const employeeData =
        await fetchEmployees();

      setEmployees(employeeData);

      if (role === "admin") {

        await loadSecuritySummary();

      }

      if (hasAnalyticsAccess) {

        const dashboardAnalytics =
          await getDashboardAnalyticsApi();

        const departmentAnalytics =
          await getEmployeesByDepartmentApi();

        const statusAnalytics =
          await getEmployeeStatusApi();

        const roleAnalytics =
          await getRoleCountApi();

        setAnalyticsData(
          dashboardAnalytics
        );

        setDepartmentData(
          departmentAnalytics
        );

        setStatusData(
          statusAnalytics
        );

        setRoleData(
          roleAnalytics
        );

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

  const getRiskClass = (riskLevel) => {

    if (riskLevel === "Critical Risk") {
      return "critical-risk";
    }

    if (riskLevel === "High Risk") {
      return "high-risk";
    }

    if (riskLevel === "Medium Risk") {
      return "medium-risk";
    }

    return "low-risk";

  };

  const getSeverityRiskClass = (severity) => {

    if (severity === "Critical") {
      return "critical-risk";
    }

    if (severity === "High") {
      return "high-risk";
    }

    if (severity === "Medium") {
      return "medium-risk";
    }

    return "low-risk";

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
        role === "admin" && !hasAnalyticsAccess && (

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

        )
      }

      {
        hasAnalyticsAccess && (

          <>

            <DashboardCards
              employees={employees}
              analyticsData={analyticsData}
            />

            <div className="dashboard-grid">

              <EmployeeChart
                employees={employees}
              />

              <EmployeeTable
                employees={employees}
              />

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

        )
      }

      {
        role === "admin" && (

          <div className="security-monitoring-section">

            <div className="security-header">

              <h2>
                🛡️ Security Monitoring
              </h2>

              <p>
                Track alerts, risk scores, and recent security events for your organization.
              </p>

            </div>

            <div className="security-card-grid">

              <div className="security-summary-card">

                <p>
                  Security Alerts Today
                </p>

                <h3>
                  {securityData.cards.securityAlertsToday}
                </h3>

                <span>
                  Generated today
                </span>

              </div>

              <div className="security-summary-card">

                <p>
                  Open Alerts
                </p>

                <h3 className="red-text">
                  {securityData.cards.openAlerts}
                </h3>

                <span>
                  Needs attention
                </span>

              </div>

              <div className="security-summary-card">

                <p>
                  Resolved Alerts
                </p>

                <h3>
                  {securityData.cards.resolvedAlerts}
                </h3>

                <span>
                  Closed incidents
                </span>

              </div>

              <div className="security-summary-card">

                <p>
                  Critical Alerts
                </p>

                <h3 className="red-text">
                  {securityData.cards.criticalAlerts}
                </h3>

                <span>
                  Open critical issues
                </span>

              </div>

            </div>

            <div className="risk-engine-grid">

              <div className="risk-card">

                <h3>
                  Top Risk Users
                </h3>

                {
                  securityData.topRiskUsers.length === 0
                  ?
                  <p className="empty-risk-text">
                    No risk users found
                  </p>
                  :
                  securityData.topRiskUsers.map(
                    (user, index) => (

                      <div
                        key={index}
                        className="risk-row"
                      >

                        <div className="risk-user-left">

                          <div className="risk-avatar">
                            {
                              user.name
                              ?
                              user.name.slice(0, 2).toUpperCase()
                              :
                              "NA"
                            }
                          </div>

                          <div>

                            <h4>
                              {user.name}
                            </h4>

                            <p>
                              {user.email}
                            </p>

                          </div>

                        </div>

                        <div className="risk-score-box">

                          <strong>
                            {user.riskScore}
                          </strong>

                          <span
                            className={getRiskClass(
                              user.riskLevel
                            )}
                          >
                            {user.riskLevel}
                          </span>

                        </div>

                      </div>

                    )
                  )
                }

              </div>

              <div className="risk-card">

                <h3>
                  Top Risk Companies
                </h3>

                {
                  securityData.topRiskCompanies.length === 0
                  ?
                  <p className="empty-risk-text">
                    No company risk found
                  </p>
                  :
                  securityData.topRiskCompanies.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="risk-row"
                      >

                        <div className="risk-user-left">

                          <div className="risk-avatar company-risk-avatar">
                            🏢
                          </div>

                          <div>

                            <h4>
                              {item.company}
                            </h4>

                            <p>
                              {item.usersTracked} users tracked
                            </p>

                          </div>

                        </div>

                        <div className="risk-score-box">

                          <strong>
                            {item.riskScore}
                          </strong>

                          <span
                            className={getRiskClass(
                              item.riskLevel
                            )}
                          >
                            {item.riskLevel}
                          </span>

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            </div>

            <div className="security-events-card">

              <h3>
                Recent Security Events
              </h3>

              {
                securityData.recentEvents.length === 0
                ?
                <p className="empty-risk-text">
                  No recent security events
                </p>
                :
                securityData.recentEvents.map(
                  (event) => (

                    <div
                      key={event.id}
                      className="security-event-row"
                    >

                      <div>

                        <h4>
                          {event.eventType}
                        </h4>

                        <p>
                          {event.details}
                        </p>

                      </div>

                      <div className="security-event-right">

                        <p>
                          {event.userName}
                        </p>

                        <span>
                          {event.createdAt}
                        </span>

                        <strong
                          className={getSeverityRiskClass(
                            event.severity
                          )}
                        >
                          {event.severity}
                        </strong>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          </div>

        )
      }

    </div>

  );

}

export default DashboardPage;