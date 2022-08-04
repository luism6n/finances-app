import { Button, Stack, TextField } from "@mui/material";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { parse } from "search-query-parser";
import {Filter, emptyFilter} from "./types";

interface Props {
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  saveFilter: (f: Filter) => void,
}

export default function CurrentFilter({ filter, setFilter, saveFilter }: Props) {
  const [filterName, setFilterName] = useState("");
  const [query, setQuery] = useState("");

  const [currentFilterNoNameError, setCurrentFilterNoNameError] = useState("");
  function validateAndSaveFilter(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!filterName) {
      setCurrentFilterNoNameError("Filter must have a name");
      return;
    }

    setCurrentFilterNoNameError("");
    saveFilter({ ...filter, name: filterName, id: nanoid() });
    setFilterName("");
    setQuery("");
    setFilter(emptyFilter);
  }

  function onQueryChange(newQuery: string) {
    setQuery(newQuery);
    const options = {
      alwaysArray: true,
      keywords: ["desc", "categ", "y", "d", "m", "amount"],
      ranges: ["date"],
      tokenize: true,
    };
    setFilter({
      ...filter,
      query: parse(newQuery, options),
      queryString: newQuery,
    });
  }

  return (
    <form style={{ width: "100%" }}>
      <Stack sx={{ my: 1, flexDirection: "row" }}>
        <TextField
          sx={{ flex: 3, pr: 1 }}
          variant="filled"
          size="small"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          label="Search query"
        />
        <TextField
          sx={{ flex: 1, pr: 1 }}
          variant="filled"
          size="small"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          label="Filter name"
          error={!!currentFilterNoNameError}
        />
        <Button type="submit" onClick={validateAndSaveFilter}>
          Save filter
        </Button>
      </Stack>
    </form>
  );
}
