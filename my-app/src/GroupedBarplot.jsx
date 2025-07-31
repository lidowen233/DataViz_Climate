import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from "recharts";


const resourceColors = {
  Tourism_ratio: "#9d174d7c", // dark red
  Remittances_ratio: "#9d174d31", // blue
  fdi_oda_pct: "#b3c593b7", // green
  Gov_revenue_ratio: "#A4BED5", // amber
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "8px",
          fontSize: "14px",
          color: "#000",
        }}
      >
        <p style={{ marginBottom: "4px" }}><strong>{label}</strong></p>
        {payload.map((entry, index) => {
          const isGDP = entry.dataKey === "gdp_2019";
          const unit = isGDP
            ? `$${(entry.value / 1e9).toFixed(2)}Billion`
            : `${entry.value}%`;
          return (
            <p key={index} style={{ margin: 0 }}>
              <span style={{ color: entry.color }}>■</span> {entry.name}: {unit}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};


export const GroupedBarChart = ({ data }) => {
  return (
    <div className="w-full h-[500px]">
      
      <p className="text-sm mb-4 text-gray-600 text-left">
        Each bar represents a country's economic or institutional foundation that could support resilience:
        tourism, remittances, foreign aid, and government revenue.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 60, left: 20, bottom: 90 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="Tourism_ratio" fill={resourceColors.Tourism_ratio} name="Tourism % GDP" />
          <Bar yAxisId="left" dataKey="Remittances_ratio" fill={resourceColors.Remittances_ratio} name="Remittances % GDP" />
          <Bar yAxisId="left" dataKey="fdi_oda_pct" fill={resourceColors.fdi_oda_pct} name="FDI/ODA % GDP" />
          <Bar yAxisId="left" dataKey="Gov_revenue_ratio" fill={resourceColors.Gov_revenue_ratio} name="Gov Revenue % GDP" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="gdp_2019"
            stroke="#9d174dc7"
            strokeWidth={1}
            name="GDP (USD)"
            dot={{ r: 1 }}
            activeDot={{ r: 2 }}
          />
        </BarChart>

      </ResponsiveContainer>
    </div>
  );
};

export default GroupedBarChart;
