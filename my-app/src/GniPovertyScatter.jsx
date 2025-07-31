import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GniPovertyScatter = ({ data, width = 600, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 40, right: 20, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear existing

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.gni))
      .nice()
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.poverty))
      .nice()
      .range([innerHeight, 0]);

    const rScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.population)])
      .range([4, 20]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));

    // Labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .text("GNI per capita (USD)");

    g.append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Poverty Rate (% below $3/day)");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip bg-white border px-3 py-1 rounded shadow")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(255, 255, 255, 0.85)")
      .style("backdrop-filter", "blur(4px)")
      .style("padding", "12px 16px")                        
      .style("border", "1px solid #ccc")
      .style("border-radius", "6px")
      .style("font-size", "0.875rem")
      .style("pointer-events", "none")
      .style("z-index", 1000);


    // Circles
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.gni))
      .attr("cy", (d) => yScale(d.poverty))
      .attr("r", (d) => rScale(d.population))
      .attr("fill", "#9d174d")
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.name}</strong><br/>GNI: $${d.gni}<br/>Poverty: ${d.poverty}%<br/>Population: ${d.population}M`
          );
        d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 30 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("stroke", null);
      });

    // Population size legend (bottom right corner)
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${height - 320})`);

    const legendSizes = [0.1, 1, 10]; // example: in millions
    legendSizes.reverse().forEach((p, i) => {
      const y = i * 40;
      const r = rScale(p);

      legendGroup
        .append("circle")
        .attr("cx", 30)
        .attr("cy", y + r)
        .attr("r", r)
        .attr("fill", "#9d174d")
        .attr("opacity", 0.7);

      legendGroup
        .append("text")
        .attr("x", 70)
        .attr("y", y + r)
        .attr("dy", "0.35em")
        .text(`${p}M`);
    });

    // Legend title
    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr("class", "text-sm")
      .text("Population (Million)");

  }, [data]);


  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default GniPovertyScatter;
