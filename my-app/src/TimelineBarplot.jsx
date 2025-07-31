import React, { useState } from "react";

const TimelineBarplot = ({ data = [], svgWidth = 1000 }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedOceanYear, setSelectedOceanYear] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  if (!data || data.length === 0) return <div>No data available</div>;

  const allYears = Array.from({ length: 11 }, (_, i) => 2013 + i); // 2013-2023
  const allYears_Ocean = Array.from({ length: 7 }, (_, i) => 2016 + i); // 2016-2023
  const controlYears = [2013, 2015, 2020];
  const controlYears_ocean = [2016, 2018, 2021, 2022, 2023];
  const yearSpacing = 40;
  const xBase = 120;
  const maxBeach = Math.max(...data.map(d => d.Beach_Cleanliness));
  const maxAllowedWidth = 300;
  const beachScale = maxBeach > 0 ? maxAllowedWidth / maxBeach : 0.0008;
  const centerOffset = 50;
  const showTooltip = (e, x, y, text) => {
    setTooltip({
      visible: true,
      x: x + 10,
      y,
      text,
    });
  };

  const hideTooltip = () => setTooltip({ visible: false, x: 0, y: 0, text: "", fontSize: "14" });

  return (
    <div style={{ position: "relative", backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px" }}>
      <svg width={svgWidth} height={data.length * 40 + 120}>
        {/* Axis labels */}
        <text x={svgWidth / 2 - centerOffset - 50} y={data.length * 40 + 60} fontSize="13" fontWeight="bold" textAnchor="middle">Land Policy</text>
        <text x={svgWidth / 2 - centerOffset + 50} y={data.length * 40 + 60} fontSize="13" fontWeight="bold" textAnchor="middle">Ocean Policy</text>
        <text x={svgWidth / 2 - centerOffset} y={30} fontWeight="bold" textAnchor="middle">Country</text>

        {/* Vertical year lines */}
        {allYears.map((year, i) => {
          const xLeft = svgWidth / 2 - centerOffset - xBase - i * yearSpacing;
          return (
            <g key={`grid-land-${year}`}>
              <line x1={xLeft} y1={50} x2={xLeft} y2={data.length * 40 + 20} stroke="#eee" />
            </g>
          );
        })}
        {allYears_Ocean.map((year, i) => {
          const xRight = svgWidth / 2 - centerOffset + xBase + i * yearSpacing;
          return (
            <g key={`grid-ocean-${year}`}>
              <line x1={xRight} y1={50} x2={xRight} y2={data.length * 40 + 20} stroke="#eee" />
            </g>
          );
        })}

        {/* Control year dots */}
        {controlYears.map((year) => {
          const x = svgWidth / 2 - centerOffset - xBase - (year - 2013) * yearSpacing;
          return (
            <g key={`control-${year}`} onClick={() => setSelectedYear(year)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={data.length * 40 + 55} r={6} fill={selectedYear === year ? "#9d174d" : "#ccc"} />
              <text x={x} y={data.length * 40 + 80} fontSize="12" textAnchor="middle">{year}</text>
            </g>
          );
        })}
        {controlYears_ocean.map((year) => {
          const x = svgWidth / 2 - centerOffset + xBase + (year - 2016) * yearSpacing;
          return (
            <g key={`control-ocean-${year}`} onClick={() => setSelectedOceanYear(year)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={data.length * 40 + 55} r={6} fill={selectedOceanYear === year ? "#2878b9ff" : "#ccc"} />
              <text x={x} y={data.length * 40 + 80} fontSize="12" textAnchor="middle">{year}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const y = 50 + i * 40;
          const xLand = svgWidth / 2 - centerOffset - xBase - (d.manage_year - 2013) * yearSpacing;
          const xOcean = svgWidth / 2 - centerOffset + xBase + (d.litter_year - 2016) * yearSpacing;

          const highlight = d.manage_year === selectedYear;
          const fillColor_drr = highlight ? "#9d174d" : "#d4d4d4";
          const fillColor_renewable = highlight ? "#9d174d7c" : "#d4d4d4";
          const highlight_ocean = d.litter_year === selectedOceanYear;
          const fillColor_ocean1 = highlight_ocean ? "#c3d5e6ff" : "#d4d4d4";
          const fillColor_ocean2 = highlight_ocean ? "#82a6c5ff" : "#d4d4d4";
          const fillColor_ocean3 = highlight_ocean ? "#476F84" : "#d4d4d4";

          return (
            <g key={`${d.name}-${i}`}>
              <text x={svgWidth / 2 - centerOffset} y={y + 10} fontSize="15" textAnchor="middle">{d.name}</text>

              {/* Land DRR */}
              <rect
                x={xLand - d.risk_reduction * 2}
                y={y}
                width={d.risk_reduction === 0 ? 1 : d.risk_reduction * 2}
                height={10}
                fill={fillColor_drr}
                onClick={(e) => showTooltip(e, xLand, y, `<strong>${d.name}</strong>: since <strong>${d.manage_year}</strong>, legislative and/or regulatory provisions been made for managing disaster risk. <strong>${d.risk_reduction}</strong>% local governments that adopt and implement local disaster risk reduction strategies.`)}
                onMouseEnter={(e) => showTooltip(e, xLand, y, `<strong>${d.name}</strong>: since <strong>${d.manage_year}</strong>, legislative and/or regulatory provisions been made for managing disaster risk. <strong>${d.risk_reduction}</strong>% local governments that adopt and implement local disaster risk reduction strategies.`)}
                onMouseLeave={hideTooltip}
              />

              {/* Land Renewable */}
              <rect
                x={xLand - d.renewable_energy * 2}
                y={y + 12}
                width={d.renewable_energy * 2}
                height={10}
                fill={fillColor_renewable}
                onClick={(e) => showTooltip(e, xLand, y + 12, `<strong>${d.name}</strong> — Renewable energy share in the total final energy consumption(%): 
                  <strong>${d.renewable_energy}</strong>`)}
                onMouseEnter={(e) => showTooltip(e, xLand, y + 12, `<strong>${d.name}</strong> — Renewable energy share in the total final energy consumption(%): 
                  <strong>${d.renewable_energy}</strong>`)}
                onMouseLeave={hideTooltip}
              />

              {/* Ocean MPA Coverage */}
              <rect
                x={xOcean}
                y={y}
                width={d.MPA_Coverage * 2}
                height={8}
                fill={fillColor_ocean1}
                onClick={(e) => showTooltip(e, xOcean, y, `<strong>${d.name}</strong> — Protected area coverage for marine (Key Biodiversity Area)(%):
                                                                  <strong>${d.MPA_Coverage}</strong>`)}
                onMouseEnter={(e) => showTooltip(e, xOcean, y, `<strong>${d.name}</strong> — Protected area coverage for marine (Key Biodiversity Area)(%):
                                                                  <strong>${d.MPA_Coverage}</strong>`)}
                onMouseLeave={hideTooltip}
              />

              {/* Ocean Beach Cleanliness */}
              <rect
                x={xOcean}
                y={y + 10}
                width={d.Beach_Cleanliness * beachScale}
                height={8}
                fill={fillColor_ocean2}
                onClick={(e) => showTooltip(e, xOcean, y + 12, `<strong>${d.name}</strong> (data collected in <strong>${d.litter_year}</strong>) — Beach litter per sq km: <strong>${d.Beach_Cleanliness}</strong>`)}
                onMouseEnter={(e) => showTooltip(e, xOcean, y + 12, `<strong>${d.name}</strong> (data collected in <strong>${d.litter_year}</strong>) — Beach litter per sq km: <strong>${d.Beach_Cleanliness}</strong>`)}
                onMouseLeave={hideTooltip}
              />

              {/* Ocean Red List Index */}
              <rect
                x={xOcean}
                y={y + 20}
                width={d.RedListIndex * 100}
                height={8}
                fill={fillColor_ocean3}
                onClick={(e) => showTooltip(e, xOcean, y + 24, `<strong>${d.name}</strong> — Red List Index: <strong>${d.RedListIndex}</strong>`)}
                onMouseEnter={(e) => showTooltip(e, xOcean, y + 24, `<strong>${d.name}</strong> — Red List Index: <strong>${d.RedListIndex}</strong>`)}
                onMouseLeave={hideTooltip}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y - 20,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            color: "black",
            padding: "6px 10px",
            fontSize: "13px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            whiteSpace: "normal",
            maxWidth: "240px",
            lineHeight: "1.3",
            zIndex: 10,
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.text }}
        >

        </div>
      )}
    </div>
  );
};

export default TimelineBarplot;

