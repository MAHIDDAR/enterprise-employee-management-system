import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";

import {
  ThemeContext,
} from "../../context/ThemeContext";

import {
  EmployeeContext,
} from "../../context/EmployeeContext";

import {
  getCurrentUserApi,
} from "../../services/authService";

import {
  getAttendanceAccessRequestsApi,
  approveAttendanceAccessApi,
  rejectAttendanceAccessApi,
  getLeaveRequestsApi,
  approveLeaveRequestApi,
  rejectLeaveRequestApi,
} from "../../services/attendanceService";

import "./Navbar.css";

function Navbar({ toggleSidebar }) {

  const navigate =
    useNavigate();

  const {
    darkMode,
    toggleTheme,
  } = useContext(
    ThemeContext
  );

  const {
    notifications,
    unreadCount,
    markNotificationsAsRead,
    clearNotifications,
  } = useContext(
    EmployeeContext
  );

  const [
    currentRole,
    setCurrentRole,
  ] = useState(
    localStorage.getItem("role")
  );

  const [
    currentCompany,
    setCurrentCompany,
  ] = useState(
    localStorage.getItem("company") || "Company"
  );

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  const [
    attendanceAccessRequests,
    setAttendanceAccessRequests,
  ] = useState([]);

  const [
    leaveRequests,
    setLeaveRequests,
  ] = useState([]);

  const loadAdminNotifications =
  async () => {

    try {

      const accessData =
      await getAttendanceAccessRequestsApi();

      const pendingAccess =
      accessData.filter(
        (request) =>
          request.status === "pending"
      );

      setAttendanceAccessRequests(
        pendingAccess
      );

      const leaveData =
      await getLeaveRequestsApi();

      const pendingLeaves =
      leaveData.filter(
        (request) =>
          request.status === "pending"
      );

      setLeaveRequests(
        pendingLeaves
      );

    }
    catch (error) {

      console.log(error);

    }

  };

  const syncCurrentUserRole =
  async () => {

    try {

      const data =
      await getCurrentUserApi();

      if (data.role) {

        localStorage.setItem(
          "role",
          data.role
        );

        localStorage.setItem(
          "company",
          data.company
        );

        localStorage.setItem(
          "plan",
          data.plan || "Free"
        );

        setCurrentRole(
          data.role
        );

        setCurrentCompany(
          data.company
        );

        if (data.role === "admin") {

          loadAdminNotifications();

        }
        else {

          setAttendanceAccessRequests([]);

          setLeaveRequests([]);

        }

      }

    }
    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    syncCurrentUserRole();

    const interval =
    setInterval(() => {

      syncCurrentUserRole();

    }, 2000);

    return () =>
      clearInterval(interval);

  }, []);

  const handleApproveAttendance =
  async (event, id) => {

    event.stopPropagation();

    setAttendanceAccessRequests(
      attendanceAccessRequests.filter(
        (request) =>
          request.id !== id
      )
    );

    await approveAttendanceAccessApi(id);

    await loadAdminNotifications();

  };

  const handleRejectAttendance =
  async (event, id) => {

    event.stopPropagation();

    setAttendanceAccessRequests(
      attendanceAccessRequests.filter(
        (request) =>
          request.id !== id
      )
    );

    await rejectAttendanceAccessApi(id);

    await loadAdminNotifications();

  };

  const handleApproveLeave =
  async (event, id) => {

    event.stopPropagation();

    setLeaveRequests(
      leaveRequests.filter(
        (request) =>
          request.id !== id
      )
    );

    await approveLeaveRequestApi(id);

    await loadAdminNotifications();

  };

  const handleRejectLeave =
  async (event, id) => {

    event.stopPropagation();

    setLeaveRequests(
      leaveRequests.filter(
        (request) =>
          request.id !== id
      )
    );

    await rejectLeaveRequestApi(id);

    await loadAdminNotifications();

  };

  const handleNotificationClick = () => {

    const nextState =
      !showNotifications;

    if (nextState) {

      setShowNotifications(true);

      markNotificationsAsRead();

      syncCurrentUserRole();

      if (currentRole === "admin") {

        loadAdminNotifications();

      }

    }
    else {

      setShowNotifications(false);

      clearNotifications();

    }

  };

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  const adminRequestCount =
    attendanceAccessRequests.length
    +
    leaveRequests.length;

  const totalNotificationCount =
    unreadCount
    +
    adminRequestCount;

  return (

    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        <div className="company-badge">
          {currentCompany}
        </div>

      </div>

      <div className="navbar-right">

        <button
          className="theme-btn"
          onClick={toggleTheme}
        >

          {darkMode ? (
            <FaSun />
          ) : (
            <FaMoon />
          )}

        </button>

        <div className="notification-wrapper">

          <button
            className="notification-btn"
            onClick={handleNotificationClick}
          >
            🔔

            {totalNotificationCount > 0 && (

              <span className="notification-count">
                {totalNotificationCount}
              </span>

            )}

          </button>

          {showNotifications && (

            <div className="notification-dropdown">

              <h4>
                Notifications
              </h4>

              {
                notifications.length === 0
                &&
                attendanceAccessRequests.length === 0
                &&
                leaveRequests.length === 0
                ? (

                  <p>
                    No Notifications
                  </p>

                ) : (

                  <>

                    {
                      notifications.map(
                        (notification, index) => (

                          <div
                            key={notification.id || index}
                            className="notification-item"
                          >

                            <p>
                              {
                                notification.text ||
                                notification.message ||
                                notification
                              }
                            </p>

                            {
                              notification.time && (

                                <small>
                                  {notification.time}
                                </small>

                              )
                            }

                          </div>

                        )
                      )
                    }

                    {
                      currentRole === "admin"
                      &&
                      attendanceAccessRequests.map(
                        (request) => (

                          <div
                            key={`attendance-${request.id}`}
                            className="notification-item notification-action-item"
                          >

                            <strong>
                              Attendance Access Request
                            </strong>

                            <p>
                              User: {request.name || request.email}
                            </p>

                            <p>
                              Email: {request.email}
                            </p>

                            <p>
                              Submitted: {request.submittedAt || "Just now"}
                            </p>

                            <div className="notification-actions">

                              <button
                                className="approve-btn"
                                onClick={(event) =>
                                  handleApproveAttendance(
                                    event,
                                    request.id
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={(event) =>
                                  handleRejectAttendance(
                                    event,
                                    request.id
                                  )
                                }
                              >
                                Reject
                              </button>

                            </div>

                          </div>

                        )
                      )
                    }

                    {
                      currentRole === "admin"
                      &&
                      leaveRequests.map(
                        (request) => (

                          <div
                            key={`leave-${request.id}`}
                            className="notification-item notification-action-item"
                          >

                            <strong>
                              Leave Request
                            </strong>

                            <p>
                              Email: {request.email}
                            </p>

                            <p>
                              Type: {request.leaveType}
                            </p>

                            <p>
                              Dates: {request.startDate} to {request.endDate}
                            </p>

                            <p>
                              Reason: {request.reason}
                            </p>

                            <div className="notification-actions">

                              <button
                                className="approve-btn"
                                onClick={(event) =>
                                  handleApproveLeave(
                                    event,
                                    request.id
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={(event) =>
                                  handleRejectLeave(
                                    event,
                                    request.id
                                  )
                                }
                              >
                                Reject
                              </button>

                            </div>

                          </div>

                        )
                      )
                    }

                  </>

                )
              }

            </div>

          )}

        </div>

        <div className="navbar-profile-wrapper">

          <div
            className="profile-section"
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
          >

            {
              currentRole === "admin"
                ? "Admin User"
                : "Normal User"
            }

          </div>

          {showProfileMenu && (

            <div className="navbar-profile-menu">

              <p>
                {localStorage.getItem("email")}
              </p>

              <p>
                Company: {currentCompany}
              </p>

              <p>
                Plan: {localStorage.getItem("plan") || "Free"}
              </p>

              <button
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

}

export default Navbar;