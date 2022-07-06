import React, { Fragment, useEffect, useState } from "react";
import * as d3 from "d3";
import useSize from "./useSize";
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import getTransactionsVsDateAxes from "./axes";
import { motion } from "framer-motion";
import { formatMoney } from "./utils";
import useGroups from "./useGroups";

export default function Visualization({ transactions }) {
  const { width, height, ref } = useSize();
  const { topGroups, key1, key2, setKey1, setKey2, allKeys } = useGroups();

  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  const net = {
    groups: topGroups(transactions, key1, 8).map((g) => {
      return {
        ...g,
        children: topGroups(g.transactions, key2, 10),
      };
    }),
  };

  const expenses = {
    groups: topGroups(
      transactions.filter((t) => t.amount < 0),
      key1,
      8,
      net.groups.map((g) => g.key)
    ).map((g) => {
      return {
        ...g,
        children: topGroups(g.transactions, key2, 10),
      };
    }),
  };

  const income = {
    groups: topGroups(
      transactions.filter((t) => t.amount > 0),
      key1,
      8,
      net.groups.map((g) => g.key)
    ).map((g) => {
      return {
        ...g,
        children: topGroups(g.transactions, key2, 10),
      };
    }),
  };

  console.log(net.groups);
  const { xAxis, xScale, yAxis, yScale } = getTransactionsVsDateAxes(
    [
      d3.min([...expenses.groups.map((g) => g.sum), 0]),
      d3.max([...income.groups.map((g) => g.sum), 0]),
    ],
    net.groups.map((g) => g.key),
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key1, key2, transactions, width, height]);

  function smallSummary(title, total, groups) {
    return (
      <Grid width={200} container>
        <Grid item xs={7}>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography>{formatMoney(total)}</Typography>
        </Grid>

        {groups.map((g) => (
          <Fragment key={g.key}>
            <Grid item xs={7}>
              <Typography>{g.key}</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography>{formatMoney(g.sum)}</Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    );
  }

  console.log({ income });

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

      <Box ref={ref} sx={{ height: "100%" }}>
        <svg height="100%" width="100%" id="container">
          <g className="xAxis"></g>
          <path className="lineAtZero"></path>
          <g className="yAxis"></g>
          <g className="income">
            {income.groups.map((g) => (
              <Tooltip
                key={g.key}
                title={smallSummary("Income", g.sum, g.children)}
                placement="right"
              >
                <motion.rect
                  animate={{
                    x: xScale(g.key),
                    y: yScale(g.sum),
                    height: Math.abs(yScale(0) - yScale(g.sum)),
                    width: xScale.bandwidth() / 3,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ fill: "#b3de69" }}
                ></motion.rect>
              </Tooltip>
            ))}
          </g>
          <g className="expenses">
            {expenses.groups.map((g) => (
              <Tooltip
                key={g.key}
                title={smallSummary("Expenses", g.sum, g.children)}
                placement="right"
              >
                <motion.rect
                  animate={{
                    x: xScale(g.key) + xScale.bandwidth() / 3,
                    y: yScale(0),
                    height: Math.abs(yScale(0) - yScale(g.sum)),
                    width: xScale.bandwidth() / 3,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ fill: "#fb8072" }}
                ></motion.rect>
              </Tooltip>
            ))}
          </g>
          <g className="net">
            {net.groups.map((g) => (
              <Tooltip
                key={g.key}
                title={smallSummary("Net", g.sum, g.children)}
                placement="right"
              >
                <motion.rect
                  animate={{
                    x: xScale(g.key) + (2 * xScale.bandwidth()) / 3,
                    y: Math.min(yScale(0), yScale(g.sum)),
                    height: Math.abs(yScale(0) - yScale(g.sum)),
                    width: xScale.bandwidth() / 3,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ fill: "#80b1d3" }}
                ></motion.rect>
              </Tooltip>
            ))}
          </g>
        </svg>
      </Box>
    </Stack>
  );
}
