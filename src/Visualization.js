import React, { useEffect } from "react";
import * as d3 from "d3";
import useSize from "./useSize";
import { Stack, Tooltip, Typography } from "@mui/material";
import getTransactionsVsDateAxes from "./axes";

export default function Visualization({ transactions }) {
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
    (t) => t.date.format("YY/MM")
  );

  const income = d3.rollup(
    transactions.filter((t) => t.amount >= 0),
    (g) => d3.sum(g, (t) => t.amount),
    (t) => t.date.format("YY/MM")
  );

  const net = d3.rollup(
    transactions,
    (g) => d3.sum(g, (t) => t.amount),
    (t) => t.date.format("YY/MM")
  );

  const { xDomain, xAxis, xScale, yDomain, yAxis, yScale } =
    getTransactionsVsDateAxes(
      [d3.min([...expenses.values(), 0]), d3.max([...income.values(), 0])],
      d3.extent(transactions, (t) => t.date),
      width,
      height,
      margin
    );

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
        .filter((t) => t.date.format("YY/MM") === yearMonth),
      (g) => d3.sum(g, (d) => -d.amount),
      (d) => d.memo
    );

    let total = d3.sum(biggestExpenses.values());

    return (
      <Stack max-height="100%">
        <Typography>Expenses: {total}</Typography>
        {Array.from(biggestExpenses.entries())
          .sort((d1, d2) => d2[1] - d1[1])
          .slice(0, 10)
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
    let income = transactions
      .filter((t) => t.amount >= 0)
      .filter((t) => t.date.format("YY/MM") === yearMonth);
    let total = d3.sum(income, (t) => t.amount);
    return (
      <Stack>
        <Typography>Income: {total}</Typography>
        {income
          .sort((t1, t2) => t1.amount - t2.amount[1])
          .slice(0, 5)
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
        .filter((t) => t.date.format("YY/MM") === yearMonth)
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
              <Tooltip key={d[0]} title={incomeTitle(d[0])} placement="right">
                <rect
                  x={xScale(d[0])}
                  y={yScale(d[1])}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "#b3de69" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
        <g className="expenses">
          {Array.from(expenses.entries()).map((d) => {
            return (
              <Tooltip key={d[0]} title={expensesTitle(d[0])} placement="right">
                <rect
                  x={xScale(d[0]) + xScale.bandwidth() / 3}
                  y={yScale(0)}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "#fb8072" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
        <g className="net">
          {Array.from(net.entries()).map((d) => {
            return (
              <Tooltip key={d[0]} title={netTitle(d[0])} placement="right">
                <rect
                  x={xScale(d[0]) + (2 * xScale.bandwidth()) / 3}
                  y={Math.min(yScale(0), yScale(d[1]))}
                  height={Math.abs(yScale(0) - yScale(d[1]))}
                  width={xScale.bandwidth() / 3}
                  style={{ fill: "#80b1d3" }}
                ></rect>
              </Tooltip>
            );
          })}
        </g>
      </svg>
    </Stack>
  );
}
