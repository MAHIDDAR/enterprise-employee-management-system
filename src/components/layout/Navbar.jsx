import {
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaMoon,
  FaSun,
} from "react-icons/fa";

import { ThemeContext } from "../../context/ThemeContext";

import { SearchContext } from "../../context/SearchContext";

import { fetchEmployees } from "../../services/employeeService";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  const {
    searchValue,
    setSearchValue,
  } = useContext(SearchContext);

  const [showMenu, setShowMenu] =
    useState(false);

  const [employees, setEmployees] =
    useState([]);

  const [filteredResults, setFilteredResults] =
    useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredResults([]);
      return;
    }

    const results = employees.filter(
      (employee) =>
        employee.name
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        employee.company.name
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredResults(results);
  };

  const handleEmployeeClick = (
    employeeId
  ) => {
    setSearchValue("");
    setFilteredResults([]);

    navigate("/employees");

    setTimeout(() => {
      const section = document.getElementById(
        `employee-${employeeId}`
      );

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search employee or department..."
          className="search-input"
          value={searchValue}
          onChange={(event) =>
            setSearchValue(
              event.target.value
            )
          }
        />

        {filteredResults.length > 0 && (
          <div className="search-dropdown">
            {filteredResults.map(
              (employee) => (
                <div
                  key={employee.id}
                  className="search-item"
                  onClick={() =>
                    handleEmployeeClick(
                      employee.id
                    )
                  }
                >
                  <h4>{employee.name}</h4>

                  <p>
                    {
                      employee.company
                        .name
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
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

        <div className="profile-wrapper">
          <div
            className="profile-section"
            onClick={() =>
              setShowMenu(!showMenu)
            }
          >
            Admin User
          </div>

          {showMenu && (
            <div className="dropdown-menu">
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