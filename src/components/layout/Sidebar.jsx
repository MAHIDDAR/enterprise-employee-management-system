import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

  const role =
    localStorage.getItem("role");

  // COMMON FOR BOTH USER + ADMIN

  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },

    {
      name: "Employees",
      path: "/employees",
      icon: <FaUsers />,
    },

    {
      name: "Departments",
      path: "/departments",
      icon: <FaBuilding />,
    },

  ];

  // ADMIN ONLY

  if (role === "admin") {

    menuItems.push(

      {
        name: "Attendance",
        path: "/attendance",
        icon: <FaCalendarCheck />,
      },

      {
        name: "Settings",
        path: "/settings",
        icon: <FaCog />,
      }

    );

  }

  return (

    <aside className="sidebar">

      <div className="logo">

        <h2>EEMS</h2>

      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (

          <NavLink

            key={item.name}

            to={item.path}

            className="nav-item"

          >

            <span>

              {item.icon}

            </span>

            <span>

              {item.name}

            </span>

          </NavLink>

        ))}

      </nav>

    </aside>

  );

}

export default Sidebar;