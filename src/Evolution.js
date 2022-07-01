import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import getTransactionsVsDateAxes from "./axes";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import useSize from "./useSize";
import moment from "moment";

export default function Evolution({ transactions }) {
  const [groupBy, setGroupBy] = useState("memo");
  console.log({ groupBy });

  const [mousedOverKey, setMousedOverKey] = useState("");
  const [mousedOverKeyAnnotation, setMousedOverKeyAnnotation] = useState("");
  const { ref, height, width } = useSize();
  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  function groupByKey(t) {
    switch (groupBy) {
      case "memo":
        return t.memo;
      case "category":
        return t.categ;
      case "weekday":
        return t.date.format("ddd");
      default:
        console.error("unknown groupBy", groupBy);
    }
  }

  const byKey = d3.rollup(
    transactions,
    (g) => d3.sum(g, (t) => -t.amount),
    (t) => groupByKey(t),
    (t) => t.date.clone().startOf("month")
  );

  console.log({ t: transactions.map((t) => t.date.format("ddd")) });
  console.log({ byKey });

  let maxY = d3.max(
    Array.from(byKey, ([memo, dates]) => {
      return d3.max(
        Array.from(dates, ([date, value]) => {
          return value;
        })
      );
    })
  );

  let minY = d3.min(
    Array.from(byKey, ([memo, dates]) => {
      return d3.min(
        Array.from(dates, ([date, value]) => {
          return value;
        })
      );
    })
  );

  const top10Memos = Array.from(byKey.keys()).sort(sortMemoKeys).slice(0, 10);

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
      .transition()
      .duration(500)
      .call(yAxis);

    d3.select("#container")
      .select("g.xAxis")
      .attr("transform", `translate(0, ${height - margin.b})`)
      .transition()
      .duration(500)
      .call(xAxis);

    d3.select("path.lineAtZero")
      .transition()
      .duration(500)
      .attr("d", lineAtZero)
      .style("stroke", "gray");

    const keys = top10Memos;
    for (let i = 0; i < keys.length; i++) {
      let t = byKey.get(keys[i]);

      const points = xDomain.map((d) => [
        d,
        t.get(moment(d, "YY/MM").startOf("month")),
      ]);

      // const points = Array.from(t.entries());
      const lineGenerator = d3
        .line()
        .defined((d) => typeof d[1] !== "undefined")
        .x((d) => xScale(d[0]) + xScale.step() / 2)
        .y((d) => yScale(d[1]));

      const pathData = lineGenerator(points);
      d3.select("#id" + i + ">g.lines")
        .selectAll("path")
        .data([pathData])
        .join("path")
        .transition()
        .duration(500)
        .attr("d", pathData)
        .style("fill", "none")
        .style("stroke", (d) => {
          return colorScale(keys[i]);
        })
        .style("stroke-width", 3);

      let circles = d3
        .select("#id" + i + ">g.circles")
        .selectAll("circle")
        .data(points.filter((d) => typeof d[1] !== "undefined"))
        .join("circle");

      circles
        .transition()
        .duration(500)
        .attr("cx", (d) => {
          return xScale(d[0]) + xScale.step() / 2;
        })
        .attr("cy", (d) => {
          return yScale(d[1]);
        })
        .attr("fill", (d) => {
          return colorScale(keys[i]);
        })
        .attr("r", 5);

      circles
        .on("mouseover", (e) => {
          d3.select(e.srcElement).attr("r", 10);
          setMousedOverKey(keys[i]);
          setMousedOverKeyAnnotation(e.srcElement.__data__[0]);
        })
        .on("mouseout", (e) => {
          d3.select(e.srcElement).attr("r", 5);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, width, height, groupBy]);

  function sortMemoKeys(k1, k2) {
    return (
      Math.abs(d3.sum(byKey.get(k2).values())) -
      Math.abs(d3.sum(byKey.get(k1).values()))
    );
  }

  return (
    <Stack sx={{ flex: 1, height: "100%" }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Group By</FormLabel>
        <RadioGroup
          row
          aria-label="groupby options"
          name="groupby"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <FormControlLabel value="memo" control={<Radio />} label="memo" />
          <FormControlLabel
            value="category"
            control={<Radio />}
            label="category"
          />
          <FormControlLabel
            value="weekday"
            control={<Radio />}
            label="weekday"
          />
        </RadioGroup>
      </FormControl>

      <Box height="100%" ref={ref}>
        <Typography
          align="center"
          height={20}
          color={colorScale(mousedOverKey)}
        >
          <strong>{mousedOverKey}</strong> {mousedOverKeyAnnotation}
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
      </Box>
    </Stack>
  );
}
