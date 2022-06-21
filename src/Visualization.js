import React, { useEffect } from "react";
import useTransactions from "./useTransactions";
import * as d3 from "d3";
import useSize from "./useSize";
import { Stack, Tooltip, Typography } from "@mui/material";

export default function Visualization() {
  const { transactions } = useTransactions();
  const { ref, height, width } = useSize();

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

  const lineAtZero = d3.line()([
    [margin.l, yScale(0)],
    [width - margin.r, yScale(0)],
  ]);

  useEffect(() => {
    d3.select("#container")
      .select("g.yAxis")
      .attr("transform", `translate(${margin.r})`)
      .call(yAxis);

    d3.select("#container")
      .select("g.xAxis")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .call(xAxis);

    d3.select("path.lineAtZero").attr("d", lineAtZero).style("stroke", "gray");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, width, height]);

  function expensesTitle(yearMonth) {
    const biggestExpenses = d3.rollup(
      transactions
        .filter((t) => t.amount < 0)
        .filter((t) => t.date.format("Y/M") === yearMonth),
      (g) => d3.sum(g, (d) => -d.amount),
      (d) => d.memo
    );

    return (
      <Stack max-height="100%">
        <Typography>Expenses</Typography>
        {Array.from(biggestExpenses.entries())
          .sort((d1, d2) => d2[1] - d1[1])
          .map((d) => {
            return (
              <Typography key={d[0]} variant="body2">
                {d[0]}: {d[1]}
              </Typography>
            );
          })}
      </Stack>
    );
  }

  function incomeTitle(yearMonth) {
    return (
      <Stack>
        <Typography>Income</Typography>
        {transactions
          .filter((t) => t.amount >= 0)
          .filter((t) => t.date.format("Y/M") === yearMonth)
          .sort((t1, t2) => t1.amount - t2.amount[1])
          .map((t) => {
            return (
              <Typography key={t.id} variant="body2">
                {t.memo}: {t.amount}
              </Typography>
            );
          })}
      </Stack>
    );
  }

  function netTitle(yearMonth) {
    const net = d3.sum(
      transactions
        .filter((t) => t.date.format("Y/M") === yearMonth)
        .map((d) => d.amount)
    );

    return (
      <Stack>
        <Typography>Net</Typography>
        <Typography variant="body2">Total: {net}</Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
        <path className="lineAtZero"></path>
        <g className="yAxis"></g>
        <g className="income">
          {Array.from(income.entries()).map((d) => {
            return (
              <Tooltip key={d[0]} title={incomeTitle(d[0])}>
                <rect
                  x={xScale(d[0])}
                  y={yScale(d[1])}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "green" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
        <g className="expenses">
          {Array.from(expenses.entries()).map((d) => {
            return (
              <Tooltip key={d[0]} title={expensesTitle(d[0])}>
                <rect
                  x={xScale(d[0]) + xScale.bandwidth() / 3}
                  y={yScale(0)}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "red" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
        <g className="net">
          {Array.from(net.entries()).map((d) => {
            return (
              <Tooltip key={d[0]} title={netTitle(d[0])}>
                <rect
                  x={xScale(d[0]) + (2 * xScale.bandwidth()) / 3}
                  y={Math.min(yScale(0), yScale(d[1]))}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "blue" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
      </svg>
    </Stack>
  );
}
