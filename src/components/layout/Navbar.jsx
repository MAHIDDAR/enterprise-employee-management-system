import {
  useContext,
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
    clearNotifications,
  } = useContext(
    EmployeeContext
  );

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

      </div>

      <div className="navbar-right">

        {/* DARK / LIGHT BUTTON */}
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

        {/* PROFILE WITH LOGOUT DROPDOWN */}
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
              localStorage.getItem(
                "role"
              ) === "admin"
                ? "Admin User"
                : "Normal User"
            }

          </div>

          {showProfileMenu && (

            <div className="navbar-profile-menu">

              <p>
                {localStorage.getItem("email")}
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