import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./DashboardLayout.css";

function DashboardLayout() {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(true);

  const toggleSidebar = () => {

    setSidebarOpen(
      !sidebarOpen
    );

  };

  return (

    <div className="dashboard-layout">

      {
        sidebarOpen &&
        <Sidebar />
      }

      <div
        className={
          sidebarOpen
            ? "main-content"
            : "main-content full-width"
        }
      >

        <Navbar
          toggleSidebar={toggleSidebar}
        />

        <div className="page-content">

          <Outlet />

        </div>

      </div>

    </div>

  );
}

export default DashboardLayout;