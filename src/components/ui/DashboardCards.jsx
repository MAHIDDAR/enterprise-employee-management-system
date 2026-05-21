import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarCheck,
} from "react-icons/fa";

import "./DashboardCards.css";

function DashboardCards({ employees }) {
  const cards = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: <FaUsers />,
      color: "#2563eb",
    },
    {
      title: "Active Employees",
      value: employees.length - 2,
      icon: <FaUserCheck />,
      color: "#10b981",
    },
    {
      title: "Departments",
      value: 5,
      icon: <FaBuilding />,
      color: "#f59e0b",
    },
    {
      title: "Attendance",
      value: "92%",
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