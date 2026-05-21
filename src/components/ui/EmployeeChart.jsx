import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./EmployeeChart.css";

function EmployeeChart() {
  const [filter, setFilter] = useState("weekly");

  const weeklyData = [
    { name: "Mon", employees: 40 },
    { name: "Tue", employees: 55 },
    { name: "Wed", employees: 48 },
    { name: "Thu", employees: 70 },
    { name: "Fri", employees: 62 },
    { name: "Sat", employees: 58 },
    { name: "Sun", employees: 75 },
  ];

  const monthlyData = [
    { name: "Jan", employees: 120 },
    { name: "Feb", employees: 150 },
    { name: "Mar", employees: 170 },
    { name: "Apr", employees: 160 },
    { name: "May", employees: 190 },
  ];

  const currentData =
    filter === "weekly"
      ? weeklyData
      : monthlyData;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Employee Overview</h3>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        >
          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={currentData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="employees"
            stroke="#14b8a6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EmployeeChart;