import {
  useEffect,
  useState,
} from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./EmployeeChart.css";

function EmployeeChart() {

  const [filter, setFilter] =
    useState("weekly");

  const [isDarkMode, setIsDarkMode] =
    useState(
      document.body.classList.contains(
        "dark-theme"
      )
    );

  useEffect(() => {

    const observer =
      new MutationObserver(() => {

        setIsDarkMode(
          document.body.classList.contains(
            "dark-theme"
          )
        );

      });

    observer.observe(
      document.body,
      {
        attributes: true,
        attributeFilter: ["class"],
      }
    );

    return () =>
      observer.disconnect();

  }, []);

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

        <h3>
          Employee Overview
        </h3>

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

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={currentData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={
              isDarkMode
                ? "#475569"
                : "#e5e7eb"
            }
          />

          <XAxis
            dataKey="name"
            tick={{
              fill: isDarkMode
                ? "#ffffff"
                : "#475569",
            }}
            axisLine={{
              stroke: isDarkMode
                ? "#64748b"
                : "#cbd5e1",
            }}
            tickLine={{
              stroke: isDarkMode
                ? "#64748b"
                : "#cbd5e1",
            }}
          />

          <YAxis
            tick={{
              fill: isDarkMode
                ? "#ffffff"
                : "#475569",
            }}
            axisLine={{
              stroke: isDarkMode
                ? "#64748b"
                : "#cbd5e1",
            }}
            tickLine={{
              stroke: isDarkMode
                ? "#64748b"
                : "#cbd5e1",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode
                ? "#0f172a"
                : "#ffffff",
              color: isDarkMode
                ? "#ffffff"
                : "#0f172a",
              border: isDarkMode
                ? "1px solid #334155"
                : "1px solid #e5e7eb",
              borderRadius: "10px",
            }}
            labelStyle={{
              color: isDarkMode
                ? "#ffffff"
                : "#0f172a",
            }}
            itemStyle={{
              color: isDarkMode
                ? "#ffffff"
                : "#0f172a",
            }}
          />

          <Line
            type="monotone"
            dataKey="employees"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{
              fill: "#14b8a6",
              stroke: "#14b8a6",
            }}
            activeDot={{
              r: 7,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default EmployeeChart;