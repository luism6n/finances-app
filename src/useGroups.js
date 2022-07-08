import moment from "moment";
import * as d3 from "d3";
import { useState } from "react";

export default function useGroups(initialKey1, initialKey2) {
  const allKeys = ["Month", "Weekday", "Category", "Description"];
  const [key1, setKey1] = useState("Month");
  const [key2, setKey2] = useState("Category");

  function getKey(t, key) {
    switch (key) {
      case "Month":
        return t.date.format("MM/YY");
      case "Weekday":
        return t.date.format("ddd");
      case "Category":
        return t.categ;
      case "Description":
        return t.memo;
      default:
        console.error(`unknown key ${key}`);
    }
  }

  function topGroups(
    transactions,
    key,
    numGroups,
    mandatoryTopKeys,
    ellipsize
  ) {
    function sortKeyValues([k1, v1], [k2, v2]) {
      if (!ellipsize) {
        if (key === "Month") {
          return moment(k1, "MM/YY") - moment(k2, "MM/YY");
        }

        if (key === "Weekday") {
          return (
            moment(k1, "ddd").isoWeekday() - moment(k2, "ddd").isoWeekday()
          );
        }
      }

      return v2 - v1;
    }

    let topKeys;
    if (mandatoryTopKeys) {
      topKeys = mandatoryTopKeys;
    } else {
      topKeys = Array.from(
        d3.rollup(
          transactions,
          // Top keys = largest abs(amount) = more money moved
          (g) => d3.sum(g, (t) => Math.abs(t.amount)),
          (t) => getKey(t, key)
        )
      )
        .sort(sortKeyValues)
        .map(([k, v]) => k);

      if ((key !== "Month" && topKeys.length > numGroups) || ellipsize) {
        topKeys = topKeys.slice(0, numGroups - 1);
        topKeys.push("Others");
      }
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
  return {
    key1,
    key2,
    setKey1,
    setKey2,
    topGroups,
    allKeys,
    getKey,
  };
}
