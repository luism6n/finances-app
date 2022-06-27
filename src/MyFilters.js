import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import React, { Fragment } from "react";

function MyFilter({ f, toggleFilter }) {
  return (
    <Tooltip
      placement="right"
      title={
        <Stack>
          <Typography>Text: {f.text}</Typography>
          <Typography>Min date: {f.minDate.format()}</Typography>
          <Typography>Max date: {f.maxDate.format()}</Typography>
        </Stack>
      }
    >
      <Chip
        size="small"
        onClick={() => toggleFilter(f)}
        variant={f.enabled ? "" : "outlined"}
        sx={{ m: 1, p: 1 }}
        label={f.name}
      />
    </Tooltip>
  );
}

export default function MyFilters({ sx, myFilters, toggleFilter }) {
  return (
    <Stack sx={{ ...sx }}>
      <Typography variant="h4">My Filters</Typography>
      <Stack sx={{ overflowY: "scroll" }}>
        {myFilters.map((f) => (
          <MyFilter toggleFilter={toggleFilter} key={f.id} f={f} />
        ))}
      </Stack>
    </Stack>
  );
}
