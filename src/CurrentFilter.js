import { Button, Stack, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { parse } from "search-query-parser";

export default function CurrentFilter({ filter, setFilter, saveFilter }) {
  const [filterName, setFilterName] = useState("");
  const [query, setQuery] = useState("");

  const [currentFilterNoNameError, setCurrentFilterNoNameError] = useState("");
  function validateAndSaveFilter(e) {
    if (!filterName) {
      setCurrentFilterNoNameError("Filter must have a name");
      return;
    }

    setCurrentFilterNoNameError("");
    saveFilter({ ...filter, name: filterName, id: nanoid() });
    setFilterName("");
    setFilter({ query: "", enabled: true });
  }

  function onQueryChange(newQuery) {
    setQuery(newQuery);
    const options = {
      alwaysArray: true,
      keywords: ["desc", "categ", "y", "d", "m"],
      ranges: ["date"],
      tokenize: true,
    };
    setFilter({ ...filter, query: parse(newQuery, options) });
  }

  return (
    <Stack sx={{ my: 1, flexDirection: "row" }}>
      <TextField
        sx={{ flex: 2, pr: 1 }}
        variant="filled"
        size="small"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        label="Search query"
      />
      <TextField
        sx={{ flex: 1, p: 1 }}
        variant="filled"
        size="small"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        label="filter name"
        error={!!currentFilterNoNameError}
      />
      <Button onClick={validateAndSaveFilter}>Save filter</Button>
    </Stack>
  );
}
