import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import "./CalendarHeatmap.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const cellSize = 15;


const width = cellSize * 53 + 60;  // 53 weeks + label margin
const height = cellSize * 7 + 40;  // 7 days + labels space

export default function CalendarHeatmap({ year }) {
  const ref = useRef();
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/calendar/${year}`);
        if(!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setData(data)
      }catch (error) {
        console.error("Erreur lors du chargement des données du graphique :", error)
      }
    }
    fetchData()
  }, [year]);

  useEffect(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const parsedData = Object.entries(data).map(([dateStr, value]) => [
      new Date(dateStr),
      value
    ]);

    if (parsedData.length === 0) return;

    const values = parsedData.map(d => d[1]);
    const min = d3.min(values);
    const max = d3.max(values);

    const color = d3.scaleLinear()
      .domain([min, 0, max])
      .range(["#d73027", "#ffffbf", "#1a9850"]);

    const year = parsedData[0][0].getFullYear();
    const dayMap = new Map(parsedData.map(d => [d3.timeFormat("%Y-%m-%d")(d[0]), d[1]]));

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const days = d3.timeDays(start, end);

    const g = svg.append("g").attr("transform", `translate(40, 20)`);

    // Days
    g.selectAll(".day")
      .data(days)
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
      .attr("y", d => d.getDay() * cellSize)
      .attr("fill", d => {
        const key = d3.timeFormat("%Y-%m-%d")(d);
        return dayMap.has(key) ? color(dayMap.get(key)) : "#eee";
      });

    // Months outlines
    g.selectAll(".month")
      .data(d3.timeMonths(start, end).slice(0, -1))
      .enter().append("path")
      .attr("class", "month")
      .attr("d", d => monthPath(d, cellSize));

    // Months labels
    g.selectAll(".month-label")
      .data(d3.timeMonths(start, end))
      .enter()
      .append("text")
      .attr("class", "month-label")
      .text(d => months[d.getMonth()])
      .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
      .attr("y", -5)
      .style("font-size", "12px")
      .style("text-anchor", "start");

    function monthPath(t0, cellSize) {
      const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
      const d1 = t1.getDay();
      const w1 = d3.timeWeek.count(d3.timeYear(t1), t1);

      return `M${(w1) * cellSize},${7 * cellSize}
              V${(d1 + 1) * cellSize}
              H${(w1 + 1) * cellSize}
              V0`;
    }
  }, [data]);

  return (
    <div className="svg-container">
      <svg
        ref={ref}
        className="chart"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", maxWidth: `${width}px` }}
      />
    </div>
  );
}
