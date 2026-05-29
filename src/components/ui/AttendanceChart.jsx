import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./AttendanceChart.css";

function AttendanceChart() {

  const data = [
    { name: "Present", value: 78 },
    { name: "Absent", value: 12 },
    { name: "Leave", value: 10 },
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