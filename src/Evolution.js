import React, { useEffect, useState } from "react";

import * as d3 from "d3";
import getTransactionsVsDateAxes from "./axes";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import useSize from "./useSize";
import moment from "moment";
import useGroups from "./useGroups";

export default function Evolution({ transactions }) {
  const { width, height, ref } = useSize();
  const { topGroups, key1, key2, setKey1, setKey2, allKeys, getKey } =
    useGroups();
  const [mousedOverKey, setMousedOverKey] = useState("");
  const [mousedOverKeyAnnotation, setMousedOverKeyAnnotation] = useState("");

  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  const mandatoryKeys = transactions
    .map((t) => getKey(t, key1))
    .sort((k1, k2) => {
      if (key1 === "Month") {
        return moment(k1, "MM/YY") - moment(k2, "MM/YY");
      }

      if (key1 === "Weekday") {
        return moment(k1, "ddd").isoWeekday() - moment(k2, "ddd").isoWeekday();
      }

      return k1 - k2;
    });

  const groups = topGroups(transactions, key2, 8, undefined, true).map((g) => {
    return {
      ...g,
      children: topGroups(g.transactions, key1, -1, mandatoryKeys),
    };
  });

  let maxY = d3.max(groups, (g) => d3.max(g.children, (g) => g.sum));
  let minY = d3.min(groups, (g) => d3.min(g.children, (g) => g.sum));
  const { xAxis, xScale, yAxis, yScale } = getTransactionsVsDateAxes(
    [minY, maxY],
    mandatoryKeys,
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
    .domain(groups.map((g) => g.key))
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

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const points = g.children.map((g) => [g.key, g.sum]);

      const lineGenerator = d3
        .line()
        .x((d) => xScale(d[0]) + xScale.step() / 4)
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
          return colorScale(g.key);
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
          return xScale(d[0]) + xScale.step() / 4;
        })
        .attr("cy", (d) => {
          return yScale(d[1]);
        })
        .attr("fill", (d) => {
          return colorScale(g.key);
        })
        .attr("r", 5);

      circles
        .on("mouseover", (e) => {
          d3.select(e.srcElement).attr("r", 10);
          setMousedOverKey(g.key);
          setMousedOverKeyAnnotation(e.srcElement.__data__[0]);
        })
        .on("mouseout", (e) => {
          d3.select(e.srcElement).attr("r", 5);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key1, key2, transactions, width, height]);

  return (
    <Stack sx={{ flex: 1, height: "100%" }}>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <InputLabel id="key1Label">Group by</InputLabel>
        <Select
          labelId="key1Label"
          value={key1}
          onChange={(e) => setKey1(e.target.value)}
          size="small"
        >
          {allKeys.map((k) => (
            <MenuItem key={k} value={k}>
              {k}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="key2Label">Then by</InputLabel>
        <Select
          labelId="key2Label"
          value={key2}
          onChange={(e) => setKey2(e.target.value)}
          size="small"
        >
          {allKeys.map((k) => (
            <MenuItem key={k} value={k}>
              {k}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack
        sx={{
          justifyContent: "center",
          marginTop: 2,
          gap: 2,
          flexDirection: "row",
        }}
      >
        {groups.map((g) => (
          <Typography
            key={g.key}
            sx={{
              fontWeight: g.key === mousedOverKey ? "bold" : "lighter",
              textDecoration: g.key === mousedOverKey ? "underline" : "none",
              color: colorScale(g.key),
            }}
          >
            {g.key}
          </Typography>
        ))}
      </Stack>

      <Box ref={ref} sx={{ height: "100%" }}>
        <svg height="100%" width="100%" id="container">
          <g className="xAxis"></g>
          <path className="lineAtZero"></path>
          <g className="yAxis"></g>
          {groups.map((g, i) => {
            return (
              <g key={g.key} id={"id" + i}>
                <g className="lines"></g>
                <g className="circles"></g>
              </g>
            );
          })}
        </svg>
      </Box>
    </Stack>
  );
}
