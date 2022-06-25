import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import getTransactionsVsDateAxes from "./axes";
import { Stack, TextField, Typography } from "@mui/material";
import useSize from "./useSize";
import moment from "moment";

export default function Evolution({ transactions }) {
  const [mousedOverMemo, setMousedOverMemo] = useState("");
  const [mousedOverMemoAnnotation, setMousedOverMemoAnnotation] = useState("");
  const { ref, height, width } = useSize();
  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  const byMemo = d3.rollup(
    transactions,
    (g) => d3.sum(g, (t) => -t.amount),
    (t) => t.memo,
    (t) => t.date.startOf("month")
  );

  let maxY = d3.max(
    Array.from(byMemo, ([memo, dates]) => {
      return d3.max(
        Array.from(dates, ([date, value]) => {
          return value;
        })
      );
    })
  );

  let minY = d3.min(
    Array.from(byMemo, ([memo, dates]) => {
      return d3.min(
        Array.from(dates, ([date, value]) => {
          return value;
        })
      );
    })
  );

  console.log(maxY);

  const top10Memos = Array.from(byMemo.keys()).sort(sortMemoKeys).slice(0, 10);

  const { xDomain, xAxis, xScale, yDomain, yAxis, yScale } =
    getTransactionsVsDateAxes(
      [minY, maxY],
      d3.extent(transactions, (t) => t.date),
      width,
      height,
      margin
    );

  const lineAtZero = d3.line()([
    [margin.l, yScale(0)],
    [width - margin.r, yScale(0)],
  ]);

  let colorScale = d3
    .scaleOrdinal()
    .domain(top10Memos)
    .range([
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928",
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

    const keys = top10Memos;
    for (let i = 0; i < keys.length; i++) {
      let t = byMemo.get(keys[i]);

      const points = xDomain.map((d) => [
        d,
        t.get(moment(d, "YY/MM").startOf("month")),
      ]);

      // const points = Array.from(t.entries());
      console.log({ points });
      const lineGenerator = d3
        .line()
        .defined((d) => typeof d[1] !== "undefined")
        .x((d) => xScale(d[0]) + xScale.step() / 2)
        .y((d) => yScale(d[1]));

      const pathData = lineGenerator(points);
      console.log({ pathData });
      d3.select("#id" + i + ">g.lines")
        .selectAll("path")
        .data([pathData])
        .join("path")
        .attr("d", pathData)
        .style("fill", "none")
        .style("stroke", (d) => {
          return colorScale(keys[i]);
        })
        .style("stroke-width", 3);

      d3.select("#id" + i + ">g.circles")
        .selectAll("circle")
        .data(points.filter((d) => typeof d[1] !== "undefined"))
        .join("circle")
        .attr("cx", (d) => {
          return xScale(d[0]) + xScale.step() / 2;
        })
        .attr("cy", (d) => {
          return yScale(d[1]);
        })
        .attr("fill", (d) => {
          return colorScale(keys[i]);
        })
        .attr("r", 5)
        .on("mouseover", (e) => {
          d3.select(e.srcElement).attr("r", 10);
          setMousedOverMemo(keys[i]);
          setMousedOverMemoAnnotation(e.srcElement.__data__[0]);
        })
        .on("mouseout", (e) => {
          d3.select(e.srcElement).attr("r", 5);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, width, height]);

  function sortMemoKeys(k1, k2) {
    return (
      Math.abs(d3.sum(byMemo.get(k2).values())) -
      Math.abs(d3.sum(byMemo.get(k1).values()))
    );
  }

  return (
    <Stack sx={{ flex: 1, height: "100%" }} ref={ref}>
      <Typography align="center" height={20} color={colorScale(mousedOverMemo)}>
        <strong>{mousedOverMemo}</strong> {mousedOverMemoAnnotation}
      </Typography>
      <svg height="100%" width="100%" id="container">
        <g className="xAxis"></g>
        <path className="lineAtZero"></path>
        {top10Memos.map((memo, i) => {
          return (
            <g key={memo} id={"id" + i}>
              <g className="lines"></g>
              <g className="circles"></g>
            </g>
          );
        })}
        <g className="yAxis"></g>;
      </svg>
    </Stack>
  );
}
