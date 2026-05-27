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
} from "react-icons/fa";

import {
  ThemeContext,
} from "../../context/ThemeContext";

import {
  SearchContext,
} from "../../context/SearchContext";

import {
  fetchEmployees,
} from "../../services/employeeService";

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

  const {
    searchValue,
    setSearchValue,
  } = useContext(
    SearchContext
  );

  const [showMenu, setShowMenu] =
    useState(false);

  const [employees, setEmployees] =
    useState([]);

  const [
    filteredResults,
    setFilteredResults,
  ] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, employees]);

  // LOAD EMPLOYEES
  const loadEmployees = async () => {

    try {

      const data =
        await fetchEmployees();

      setEmployees(data);

    } catch (error) {

      console.log(error);
    }
  };

  // SEARCH
  const handleSearch = (
    value
  ) => {

    if (!value) {

      setFilteredResults([]);

      return;
    }

    const results =
      employees.filter(
        (employee) => {

          const employeeName =
            (
              employee?.name ||
              ""
            ).toLowerCase();

          const department =
            (
              employee?.company
                ?.name ||
              employee?.department ||
              ""
            ).toLowerCase();

          return (
            employeeName.includes(
              value.toLowerCase()
            ) ||
            department.includes(
              value.toLowerCase()
            )
          );
        }
      );

    setFilteredResults(results);
  };

  // CLICK EMPLOYEE
  const handleEmployeeClick =
    (employeeId) => {

      setSearchValue("");

      setFilteredResults([]);

      navigate("/employees");

      setTimeout(() => {

        const section =
          document.getElementById(
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

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <header className="navbar">

      {/* SEARCH */}
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

        {filteredResults.length >
          0 && (

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

                  <h4>
                    {employee.name}
                  </h4>

                  <p>
                    {
                      employee?.company
                        ?.name ||
                      employee?.department ||
                      "No Department"
                    }
                  </p>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* THEME BUTTON */}
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

        {/* PROFILE */}
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