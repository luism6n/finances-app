import { Box, TextField } from "@mui/material";
import React from "react";

export default function Search({ query, setQuery }) {
  return (
    <TextField
      variant={"filled"}
      label="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
