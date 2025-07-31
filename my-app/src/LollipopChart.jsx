import React, { useRef, useEffect, useState } from "react";

const categoryColors = {
  Health: "#9d174d7c",  // red
  Info: "#A4BED5",    // blue
  Legal: "#b3c593ff",   // green
};
const normalizeIndicators = (data) => {
  return [
    {
      label: "International Health Regulations capacity",
      value: data.IHR / 100,
      category: "Health",
    },
    {
      label: "Multi-sectoral NCD",
      value: data.Multi_sectoral_NCD / 10,
      category: "Health",
    },
    {
      label: " National strategy in NCDs and risk factors",
      value: data.NCD / 10,
      category: "Health",
    },
    {
      label: " Internet subscriptions per 100",
      value: data.Internet_Acce_Rate * 0.01,
      category: "Info",
    },
    {
      label: "Online Service Index",
      value: data.Online_service_Index,
      category: "Info",
    },
    {
      label: "WGI: Government Effectiveness",
      value: (data.government_effective + 2.5) / 5,
      category: "Legal",
    },
    {
      label: "WGI: Rule of Law",
      value: (data.Law_Rule + 2.5) / 5,
      category: "Legal",
    },
    {
      label: "WGI: Regulatory Quality",
      value: (data.Regular_Quality + 2.5) / 5,
      category: "Legal",
    },
  ];
};

export const LollipopChart = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const indicators = normalizeIndicators(data);
  const height = indicators.length * 36 + 60;
  const margin = { top: 30, right: 30, bottom: 30, left: 280 };
  const barWidth = containerWidth - margin.left - margin.right;

  return (
    <div ref={containerRef} className="w-full" style={{ position: "relative" }}>
      <svg width={containerWidth} height={height}>
        {indicators.map((d, i) => {
          const y = margin.top + i * 36;
          const xStart = margin.left;
          const xEnd = margin.left + d.value * barWidth;
          return (
            <g key={d.label}>
              <line x1={xStart} x2={xEnd} y1={y} y2={y} stroke="#ddd" strokeWidth={2} />
              <circle cx={xEnd} cy={y} r={6} fill={categoryColors[d.category]} />
              <text x={xStart - 10} y={y + 4} textAnchor="end" fontSize={14}>{d.label}</text>
              <text x={xEnd + 8} y={y + 4} fontSize={14} fill="#444">
                {(d.value * 100).toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>


      <div
        className="absolute"
        style={{
          bottom: "12px",
          right: "16px",
          display: "flex",
          gap: "12px",
          fontSize: "14px",
          backgroundColor: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            className="inline-block"
            style={{
              width: "16px",
              height: "6px",
              backgroundColor: categoryColors.Health,
            }}
          ></span>
          <span>Health</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            className="inline-block"
            style={{
              width: "16px",
              height: "6px",
              backgroundColor: categoryColors.Info,
            }}
          ></span>
          <span>Info</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            className="inline-block"
            style={{
              width: "16px",
              height: "6px",
              backgroundColor: categoryColors.Legal,
            }}
          ></span>
          <span>Legal</span>
        </div>
      </div>

    </div>
  );
};
