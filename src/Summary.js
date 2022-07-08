import { Grid, Stack, Typography } from "@mui/material";
import React, { Fragment } from "react";
import * as d3 from "d3";
import { formatMoney } from "./utils";

export default function Summary({ transactions }) {
  function largestTransaction() {
    let l = transactions[d3.maxIndex(transactions, (t) => Math.abs(t.amount))];
    return `${formatMoney(l.amount)} ${l.memo} (${l.date.format(
      "DD/MM/YYYY"
    )})`;
  }

  function mostFrequentTransaction() {
    let [memo, stats] = Array.from(
      d3.rollup(
        transactions,
        (g) => ({ count: g.length, avg: d3.mean(g.map((t) => t.amount)) }),
        (t) => t.memo
      )
    ).sort(([k1, v1], [k2, v2]) => {
      return v2.count - v1.count;
    })[0];

    return `${stats.count}x ${memo} (average ${formatMoney(stats.avg)})`;
  }

  function averagePerKey() {
    return d3.rollup(
      transactions,
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.categ
    );
  }

  const [dateMin, dateMax] = d3.extent(transactions, (t) => t.date);
  const moneyIn = d3.sum(
    transactions.filter((t) => t.amount > 0),
    (t) => t.amount
  );

  const moneyOut = d3.sum(
    transactions.filter((t) => t.amount < 0),
    (t) => t.amount
  );

  const stats = [
    { name: "Total transactions", value: transactions.length },
    { name: "Money in", value: formatMoney(moneyIn) },
    { name: "Money out", value: formatMoney(moneyOut) },
    {
      name: "Time span",
      value: `${dateMin.format("MM/YYYY")} - ${dateMax.format("MM/YYYY")}`,
    },
    { name: "Largest", value: largestTransaction() },
    { name: "Most frequent", value: mostFrequentTransaction() },
    ...Array.from(averagePerKey().entries())
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .map(([key, value]) => {
        return { name: `Category "${key}"`, value: formatMoney(value) };
      }),
  ];

  return (
    <Grid container columnSpacing={3} rowSpacing={1}>
      {stats.map((s) => (
        <Fragment>
          <Grid item xs={6}>
            <Typography textAlign="right">{s.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{s.value}</Typography>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
}
