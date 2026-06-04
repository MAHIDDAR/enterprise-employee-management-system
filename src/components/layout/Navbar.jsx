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
} from "react-icons/fa";

import {
  ThemeContext,
} from "../../context/ThemeContext";

import "./Navbar.css";

function Navbar() {

  const navigate =
    useNavigate();

  const {
    darkMode,
    toggleTheme,
  } = useContext(
    ThemeContext
  );

  const [showMenu, setShowMenu] =
    useState(false);

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <header className="navbar">

      {/* LEFT SIDE EMPTY BECAUSE SEARCH REMOVED */}
      <div className="navbar-empty"></div>

      {/* RIGHT SIDE */}
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

        <div className="profile-wrapper">

          <div
            className="profile-section"
            onClick={() =>
              setShowMenu(
                !showMenu
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

          {showMenu && (

            <div className="dropdown-menu">

              <button
                onClick={
                  handleLogout
                }
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