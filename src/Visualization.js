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

    const expenses = d3.rollup(
      transactions.filter((t) => t.amount < 0),
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.date.format("Y/M")
    );

    const income = d3.rollup(
      transactions.filter((t) => t.amount >= 0),
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.date.format("Y/M")
    );

    const net = d3.rollup(
      transactions,
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.date.format("Y/M")
    );

    const yDomain = [d3.min(expenses.values()), d3.max(income.values())];
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

    const xDomain = [
      ...new Set(transactions.map((t) => t.date.format("Y/M"))),
    ].sort(); // Add empty month at the end so that we have space
    const xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([margin.l, width - margin.r])
      .paddingOuter(0.1)
      .paddingInner(0.1);
    const xAxis = d3.axisBottom(xScale);
    d3.select("#container")
      .select("g.xAxis")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .call(xAxis);

    const lineAtZero = d3.line()([
      [margin.l, yScale(0)],
      [width - margin.r, yScale(0)],
    ]);

    d3.select("path.lineAtZero").attr("d", lineAtZero).style("stroke", "gray");

    d3.select("g.expenses")
      .selectAll("rect")
      .data(expenses.entries())
      .join("rect")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", yScale(0))
      .attr("height", (d) => Math.abs(yScale(0) - yScale(d[1])))
      .attr("width", xScale.bandwidth() / 4)
      .style("fill", "red");

    d3.select("g.income")
      .selectAll("rect")
      .data(income.entries())
      .join("rect")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 4)
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => Math.abs(yScale(0) - yScale(d[1])))
      .attr("width", xScale.bandwidth() / 4)
      .style("fill", "green");

    d3.select("g.net")
      .selectAll("rect")
      .data(net.entries())
      .join("rect")
      .attr("x", (d) => xScale(d[0]) + (2 * xScale.bandwidth()) / 4)
      .attr("y", (d) => Math.min(yScale(0), yScale(d[1])))
      .attr("height", (d) => Math.abs(yScale(0) - yScale(d[1])))
      .attr("width", xScale.bandwidth() / 4)
      .style("fill", "blue");
  }, [transactions, width, height]);

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
        <path className="lineAtZero"></path>
        <g className="yAxis"></g>
        <g className="expenses"></g>
        <g className="income"></g>
        <g className="net"></g>
      </svg>
    </Stack>
  );
}
