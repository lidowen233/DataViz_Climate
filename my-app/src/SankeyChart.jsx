import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import React, { useState, useEffect, useMemo, useRef } from "react";

export const SankeyChart = ({ data, highlightCountry, onHighlightCountryChange, width = 500, height = 400 }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedLink, setClickedLink] = useState(null);
  const tooltipRef = useRef(null);

  const sankeyData = useMemo(() => {
    const hazardTypes = ["Storm", "Flood", "Drought", "VolcanicActivity", "Earthquake"];
    const nodes = [];
    const links = [];
    const countrySet = new Set();

    data.forEach((d) => {
      if (!countrySet.has(d.name)) {
        nodes.push({ name: d.name });
        countrySet.add(d.name);
      }
    });

    hazardTypes.forEach((type) => {
      nodes.push({ name: type });
    });

    data.forEach((d) => {
      hazardTypes.forEach((type) => {
        if (d[type] > 0) {
          links.push({
            source: d.name,
            target: type,
            value: d[type],
          });
        }
      });
    });

    const sankeyGen = sankey()
      .nodeId((d) => d.name)
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    return sankeyGen({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });
  }, [data, width, height]);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;

      if (tooltip && container) {
        const rect = container.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        tooltip.style.left = offsetX + 10 + "px";
        tooltip.style.top = offsetY + 10 + "px";
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width, height }}
    >
      <svg width={width} height={height}>
        {/* Links */}
        {sankeyData.links.map((link, i) => {
          const isHighlighted = highlightCountry === link.source.name || clickedLink === link;
          const isLinkHighlighted =
            clickedLink
              ? clickedLink === link
              : highlightCountry === link.source.name;

          return (
            <path
              key={i}
              d={sankeyLinkHorizontal()(link)}
              fill="none"
              stroke={isHighlighted ? "#9d174d" : "#888888"}
              strokeOpacity={isHighlighted ? 0.7 : 0.2}
              strokeWidth={Math.max(1, link.width)}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setClickedLink((prev) =>
                  prev === link ? null : link
                );
                if (highlightCountry) {
                  onHighlightCountryChange(null);
                }
              }}
              onMouseEnter={() => {
                const isHighlighted =
                  highlightCountry === link.source.name || clickedLink === link;
                if (isHighlighted) {
                  setHoveredItem({ type: "link", data: link });
                }
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
              }}
            />
          );
        })}

        {/* Nodes */}
        {sankeyData.nodes.map((node, i) => {
          const isHighlighted = highlightCountry === node.name;

          return (
            <g
              key={i}
              transform={`translate(${node.x0},${node.y0})`}
              onClick={() => {
                if (onHighlightCountryChange) {
                  if (highlightCountry === node.name) {
                    onHighlightCountryChange(null); // unselect
                  } else {
                    onHighlightCountryChange(node.name);
                  }
                }
                setClickedLink(null); // clear link when selecting a node
              }}
              onMouseEnter={() => {
                const isHighlighted = highlightCountry === node.name;
                if (isHighlighted) {
                  setHoveredItem({ type: "node", data: node });
                }
              }}

              onMouseLeave={() => {
                setHoveredItem(null);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect
                height={node.y1 - node.y0}
                width={node.x1 - node.x0}
                fill={isHighlighted ? "#9d174d" : "#999"}
              />
              <text
                x={node.x0 < width / 2 ? 25 : -6}
                y={(node.y1 - node.y0) / 2}
                dy="0.35em"
                textAnchor={node.x0 < width / 2 ? "start" : "end"}
                fontWeight={"bold"}
                fontSize={14}
                fill="#000"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredItem && (
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
            zIndex: 100,
          }}
        >
          {hoveredItem.type === "node" && <div><strong>{hoveredItem.data.name}</strong></div>}
          {hoveredItem.type === "link" && (
            <div>
              <strong>{hoveredItem.data.source.name}</strong> {" "}
              <strong>{hoveredItem.data.target.name}</strong>:{" "}
              {hoveredItem.data.value.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
