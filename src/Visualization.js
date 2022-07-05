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
import moment from "moment";

export default function Visualization({ transactions }) {
  const [key1, setKey1] = useState("month");
  const [key2, setKey2] = useState("category");

  const { width, height, ref } = useSize();

  console.log({ key1, key2, width, height });

  const margin = {
    r: 50,
    t: 50,
    l: 50,
    b: 50,
  };

  function getKey(t, key) {
    switch (key) {
      case "month":
        return t.date.format("MM/YY");
      case "weekday":
        return t.date.format("ddd");
      case "category":
        return t.categ;
      case "description":
        return t.memo;
      default:
        console.error(`unknown key ${key}`);
    }
  }

  function topGroups(transactions, key, numGroups, reverse) {
    reverse = reverse ? -1 : 1;

    function sortKeyValues([k1, v1], [k2, v2]) {
      if (key === "month") {
        return reverse * (moment(k2, "MM/YY") - moment(k1, "MM/YY"));
      }

      if (key === "weekday") {
        return (
          reverse *
          (moment(k2, "ddd").isoWeekday() - moment(k1, "ddd").isoWeekday())
        );
      }

      return reverse * (v2 - v1);
    }

    let topKeys = Array.from(
      d3.rollup(
        transactions,
        (g) => d3.sum(g, (t) => t.amount),
        (t) => getKey(t, key)
      )
    )
      .sort(sortKeyValues)
      .map(([k, v]) => k);

    if (key !== "month" && topKeys.length > numGroups) {
      topKeys = topKeys.slice(0, numGroups - 1);
      topKeys.push("Others");
    }

    let groups = d3.group(transactions, (t) => {
      if (topKeys.indexOf(getKey(t, key)) < 0) {
        return "Others";
      }

      return getKey(t, key);
    });

    return Array.from(groups)
      .sort(([k1, v1], [k2, v2]) => topKeys.indexOf(k1) - topKeys.indexOf(k2))
      .map(([k, t]) => {
        return {
          key: k,
          transactions: t,
          sum: d3.sum(t, (t) => t.amount),
        };
      });
  }

  const expenses = {
    groups: topGroups(
      transactions.filter((t) => t.amount < 0),
      key1,
      8,
      true
    ).map((g) => {
      return {
        ...g,
        children: topGroups(g.transactions, key2, 10, true),
      };
    }),
  };

  console.log({ expenses });

  const { xAxis, xScale, yAxis, yScale } = getTransactionsVsDateAxes(
    [
      d3.min([...expenses.groups.map((g) => g.sum), 0]),
      d3.max([...expenses.groups.map((g) => g.sum), 0]),
    ],
    expenses.groups.map((g) => g.key),
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

  function smallSummary(total, groups) {
    return (
      <Grid width={200} container>
        <Grid item xs={7}>
          <Typography>Total</Typography>
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
          <MenuItem value="weekday">Weekday</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="description">Description</MenuItem>
        </Select>
        <InputLabel id="key2Label">Then by</InputLabel>
        <Select
          labelId="key2Label"
          value={key2}
          onChange={(e) => setKey2(e.target.value)}
          size="small"
        >
          <MenuItem value="weekday">Weekday</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="description">Description</MenuItem>
        </Select>
      </Stack>

      <Box ref={ref} sx={{ height: "100%" }}>
        <svg height="100%" width="100%" id="container">
          <g className="xAxis"></g>
          <path className="lineAtZero"></path>
          <g className="yAxis"></g>
          <g className="expenses">
            {expenses.groups.map((g) => (
              <Tooltip
                key={g.key}
                title={smallSummary(g.sum, g.children)}
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
        </svg>
      </Box>
    </Stack>
  );
}
