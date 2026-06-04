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

function AttendanceChart() {

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

  const data = [
    {
      name: "Present",
      value: activeCount,
    },
    {
      name: "Absent",
      value: inactiveCount,
    },
    {
      name: "Leave",
      value: onLeaveCount,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];

  return (

    <div className="attendance-chart">

      <h3>Attendance Analytics</h3>

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
                    COLORS[index]
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