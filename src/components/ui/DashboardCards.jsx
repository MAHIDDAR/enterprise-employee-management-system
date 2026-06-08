import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaClipboardList,
} from "react-icons/fa";

import "./DashboardCards.css";

function DashboardCards({
  employees,
  analyticsData,
}) {

  const totalEmployees =
    analyticsData?.totalEmployees ??
    employees.length;

  const activeEmployees =
    analyticsData?.activeEmployees ??
    employees.filter(
      (employee) =>
        (employee.status || "Active") === "Active"
    ).length;

  const totalDepartments =
    analyticsData?.totalDepartments ??
    [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ].length;

  const pendingRequests =
    analyticsData?.pendingRequests ?? 0;

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUsers />,
      color: "#2563eb",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: <FaUserCheck />,
      color: "#10b981",
    },
    {
      title: "Total Departments",
      value: totalDepartments,
      icon: <FaBuilding />,
      color: "#f59e0b",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: <FaClipboardList />,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="cards-grid">
      {cards.map((card, index) => (
        <div className="dashboard-card" key={index}>
          <div
            className="card-icon"
            style={{ backgroundColor: card.color }}
          >
            {card.icon}
          </div>

          <div>
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;