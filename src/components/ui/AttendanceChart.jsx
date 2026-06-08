import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  useContext,
} from "react";

import {
  EmployeeContext,
} from "../../context/EmployeeContext";

import "./AttendanceChart.css";

function AttendanceChart({
  statusData,
}) {

  const { employees } =
    useContext(EmployeeContext);

  const activeCount =
    employees.filter(
      (employee) =>
        (employee.status || "Active") === "Active"
    ).length;

  const inactiveCount =
    employees.filter(
      (employee) =>
        employee.status === "Inactive"
    ).length;

  const onLeaveCount =
    employees.filter(
      (employee) =>
        employee.status === "On Leave"
    ).length;

  const fallbackData = [
    {
      name: "Active",
      value: activeCount,
    },
    {
      name: "Inactive",
      value: inactiveCount,
    },
    {
      name: "On Leave",
      value: onLeaveCount,
    },
  ];

  const data =
    statusData && statusData.length > 0
      ? statusData
      : fallbackData;

  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];

  return (

    <div className="attendance-chart">

      <h3>Employee Status Overview</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >

            {data.map(
              (entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              )
            )}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default AttendanceChart;