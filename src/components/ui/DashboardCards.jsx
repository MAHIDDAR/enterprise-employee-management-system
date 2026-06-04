import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarCheck,
} from "react-icons/fa";

import "./DashboardCards.css";

function DashboardCards({ employees }) {

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        (employee.status || "Active") === "Active"
    ).length;

  const totalDepartments =
    [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ].length;

  const attendancePercentage =
    totalEmployees === 0
      ? 0
      : Math.round(
          (activeEmployees / totalEmployees) * 100
        );

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
      title: "Departments",
      value: totalDepartments,
      icon: <FaBuilding />,
      color: "#f59e0b",
    },
    {
      title: "Attendance",
      value: `${attendancePercentage}%`,
      icon: <FaCalendarCheck />,
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