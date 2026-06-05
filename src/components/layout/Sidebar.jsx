import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCog,
  FaClipboardList,
} from "react-icons/fa";

import "./Sidebar.css";


function Sidebar() {

  const role =
    localStorage.getItem("role");

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


  // ADMIN ONLY PAGES
  if(role==="admin"){

    menuItems.push({

      name:"Company",
      path:"/company",
      icon:<FaBuilding/>

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


  // SETTINGS FOR BOTH USER + ADMIN
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

              <span>
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>

          ))

        }

      </nav>

    </aside>

  );

}

export default Sidebar;