import React, { Fragment, useEffect } from "react";
import useTransactions from "./useTransactions";
import * as d3 from "d3";
import useSize from "./useSize";
import { Stack } from "@mui/material";

export default function Visualization() {
  const transactions = useTransactions();
  const { ref, height, width } = useSize();
  console.log({ height, width });

  useEffect(() => {
    const margin = {
      r: 50,
      l: 50,
      b: 50,
    };

    const rollup = d3.rollup(
      transactions,
      (g) => d3.sum(g, (t) => t.amount),
      (t) => t.date.startOf("month")
    );

    const xDomain = d3.extent(rollup.keys());
    let xScale = d3
      .scaleTime()
      .domain(xDomain)
      .range([margin.l, width - margin.r])
      .nice();

    let xAxis = d3.axisBottom(xScale);

    d3.select("#container")
      .select("g.xAxis")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .call(xAxis);
  }, [transactions, width, height]);

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
      </svg>
    </Stack>
  );
}
