import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./AnalyticsCharts.css";

function DepartmentDistributionChart({
  departmentData,
}) {

  return (

    <div className="analytics-chart-card">

      <h3>
        Employee Distribution by Department
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={departmentData}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default DepartmentDistributionChart;