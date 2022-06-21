import React, { useEffect } from "react";
import useTransactions from "./useTransactions";
import * as d3 from "d3";
import useSize from "./useSize";
import { Stack } from "@mui/material";

export default function Visualization() {
  const transactions = useTransactions();
  const { ref, height, width } = useSize();

  useEffect(() => {
    const margin = {
      r: 50,
      t: 50,
      l: 50,
      b: 50,
    };

    const yDomain = d3.extent(transactions.map((t) => t.amount));
    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - margin.b, margin.t])
      .nice();
    const yAxis = d3.axisLeft(yScale);
    d3.select("#container")
      .select("g.yAxis")
      .attr("transform", `translate(${margin.r})`)
      .call(yAxis);

    const datesExtent = d3.extent(transactions.map((t) => t.date));
    const maxDate = datesExtent[1].clone().add(1, "month");
    let allMonths = [datesExtent[0].clone().subtract(1, "month")];
    let i = 0;
    while (allMonths[i] < maxDate) {
      allMonths.push(allMonths[0].clone().add(i, "months"));
      i++;
    }
    allMonths.push(maxDate);

    const xDomain = [...new Set(allMonths.map((d) => d.format("Y/M")))].sort(); // Add empty month at the end so that we have space
    const xRange = xDomain.map(
      (t, i) =>
        margin.l + (i * (width - margin.r - margin.l)) / (xDomain.length - 1)
    );
    const xScale = d3.scaleOrdinal().domain(xDomain).range(xRange);
    const xAxis = d3.axisBottom(xScale);
    d3.select("#container")
      .select("g.xAxis")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .call(xAxis);

    const lineAtZero = d3.line()([
      [xRange[0], yScale(0)],
      [xRange[xRange.length - 1], yScale(0)],
    ]);

    d3.select("path.lineAtZero").attr("d", lineAtZero).style("stroke", "gray");
  }, [transactions, width, height]);

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
        <path className="lineAtZero"></path>
        <g className="yAxis"></g>
      </svg>
    </Stack>
  );
}
