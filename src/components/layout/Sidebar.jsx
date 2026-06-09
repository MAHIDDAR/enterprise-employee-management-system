import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem("role");

  const email =
    localStorage.getItem("email");

  const [
    showLogout,
    setShowLogout,
  ] = useState(false);

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  const menuItems = [

    {
      name:"Dashboard",
      path:"/dashboard",
      icon:<FaHome/>
    },

    {
      name:"Employees",
      path:"/employees",
      icon:<FaUsers/>
    }

  ];

  if(role==="admin"){

    menuItems.push({

      name:"Company",
      path:"/company",
      icon:<FaBuilding/>

    });

    menuItems.push({

      name:"Invitations",
      path:"/invitations",
      icon:<FaEnvelopeOpenText/>

    });

    menuItems.push({

      name:"Departments",
      path:"/departments",
      icon:<FaBuilding/>

    });

    menuItems.push({

      name:"Attendance",
      path:"/attendance",
      icon:<FaCalendarCheck/>

    });

    menuItems.push({

      name:"Audit Logs",
      path:"/audit-logs",
      icon:<FaClipboardList/>

    });

  }

  menuItems.push({

    name:"Settings",
    path:"/settings",
    icon:<FaCog/>

  });

  return (

    <aside className="sidebar">

      <div className="logo">

        <h2>EEMS</h2>

      </div>

      <nav className="sidebar-nav">

        {

          menuItems.map((item)=>(

            <NavLink

              key={item.name}

              to={item.path}

              className="nav-item"

            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>

          ))

        }

      </nav>

      <div className="sidebar-profile">

        <div
          className="profile-info"
          onClick={() =>
            setShowLogout(
              !showLogout
            )
          }
        >

          <FaUserCircle className="profile-icon" />

          <div>

            <h4>
              {
                role === "admin"
                  ? "Admin User"
                  : "Normal User"
              }
            </h4>

            <p>
              {email}
            </p>

          </div>

        </div>

        {
          showLogout &&
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            Logout

          </button>
        }

      </div>

    </aside>

  );

}

export default Sidebar;