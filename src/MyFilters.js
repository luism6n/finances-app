import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";

function MyFilter({ f, toggleFilter, deleteFilter }) {
  return (
    <Tooltip
      placement="right"
      title={
        <Stack>
          <Typography>{f.queryString}</Typography>
        </Stack>
      }
    >
      <Chip
        size="small"
        onClick={() => toggleFilter(f)}
        onDelete={() => deleteFilter(f)}
        variant={f.enabled ? "" : "outlined"}
        sx={{ m: 1, p: 1 }}
        label={f.name}
      />
    </Tooltip>
  );
}

export default function MyFilters({
  sx,
  myFilters,
  toggleFilter,
  deleteFilter,
}) {
  return (
    <Stack sx={{ ...sx }}>
      <Typography variant="h4">My Filters</Typography>
      <Stack sx={{ overflowY: "scroll" }}>
        {myFilters.map((f) => (
          <MyFilter
            deleteFilter={deleteFilter}
            toggleFilter={toggleFilter}
            key={f.id}
            f={f}
          />
        ))}
      </Stack>
    </Stack>
  );
}
