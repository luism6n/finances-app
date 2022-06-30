import { Stack, Typography } from "@mui/material";
import React from "react";
import * as d3 from "d3";
import { formatMoney } from "./utils";

export default function Summary({ transactions }) {
  function largestTransaction() {
    let l = transactions[d3.maxIndex(transactions, (t) => t.amount)];
    return `${formatMoney(l.amount)} ${l.memo}`;
  }

  function averagePerKey() {
    return d3.rollup(
      transactions,
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.categ
    );
  }

  return (
    <Stack>
      <Typography>Total transactions: {transactions.length}</Typography>
      <Typography>Largest: {largestTransaction()}</Typography>
      {Array.from(averagePerKey().entries())
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .map(([key, value]) => {
          return <Typography>{`${formatMoney(value)} ${key}`}</Typography>;
        })}
    </Stack>
  );
}
