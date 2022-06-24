import React, { useEffect } from "react";

import * as d3 from "d3";
import getTransactionsVsDateAxes from "./axes";
import { Stack } from "@mui/material";
import useSize from "./useSize";

export default function Evolution({ transactions }) {
  const { ref, height, width } = useSize();
  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  const { xDomain, xAxis, xScale, yDomain, yAxis, yScale } =
    getTransactionsVsDateAxes(
      [0, 100],
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

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
        <path className="lineAtZero"></path>
        <g className="yAxis"></g>;
      </svg>
    </Stack>
  );
}
