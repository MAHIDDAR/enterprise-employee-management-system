import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./AnalyticsCharts.css";

function RoleCountChart({
  roleData,
}) {

  const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
  ];

  return (

    <div className="analytics-chart-card">

      <h3>
        Employee Count by Role
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={roleData}
            cx="50%"
            cy="50%"
            outerRadius={95}
            dataKey="value"
            label
          >

            {roleData.map(
              (entry,index)=>(

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
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

export default RoleCountChart;