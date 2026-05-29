import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  fetchEmployees,
} from "../../services/employeeService";

import DashboardCards from "../../components/ui/DashboardCards";
import EmployeeChart from "../../components/ui/EmployeeChart";
import EmployeeTable from "../../components/ui/EmployeeTable";
import AttendanceChart from "../../components/ui/AttendanceChart";

import {
  EmployeeContext,
} from "../../context/EmployeeContext";

import "./DashboardPage.css";

function DashboardPage() {

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const {
    notifications,
    unreadCount,
    clearNotifications,
  } = useContext(EmployeeContext);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {

    try {

      setLoading(true);

      const data =
        await fetchEmployees();

      setEmployees(data);

      setError("");

    } catch (err) {

      console.log(err);

      setError(
        "Failed to fetch employee data"
      );

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
  Welcome back,{" "}
  {localStorage.getItem("role") === "admin"
    ? "Admin 👋"
    : "User 👋"}
</p>

        </div>

        <div className="dashboard-actions">

          {/* NOTIFICATION */}
          <div className="notification-wrapper">

            <button
              className="notification-btn"
              onClick={() => {

                setShowNotifications(
                  !showNotifications
                );

                clearNotifications();
              }}
            >
              🔔

              {unreadCount > 0 && (

                <span className="notification-count">
                  {unreadCount}
                </span>
              )}

            </button>

            {showNotifications && (

              <div className="notification-dropdown">

                <h4>
                  Notifications
                </h4>

                {notifications.length === 0 ? (

                  <p>
                    No Notifications
                  </p>

                ) : (

                  notifications.map(
                    (notification) => (

                      <div
                        key={notification.id}
                        className="notification-item"
                      >
                        {notification.text}
                      </div>
                    )
                  )
                )}

              </div>
            )}

          </div>

          <button className="date-btn">
            May 26, 2026
          </button>

        </div>

      </div>

      <DashboardCards employees={employees} />

      <div className="dashboard-grid">

        <EmployeeChart employees={employees} />

        <EmployeeTable employees={employees} />
        <AttendanceChart />

      </div>

    </div>
  );
}

export default DashboardPage;