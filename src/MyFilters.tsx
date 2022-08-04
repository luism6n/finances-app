import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Filter } from "./types";

interface MyFilterProps {
  f: Filter,
  toggleFilter: (filter: Filter) => void,
  deleteFilter: (filter: Filter) => void,
}

function MyFilter({ f, toggleFilter, deleteFilter }: MyFilterProps) {
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
        variant={f.enabled ? undefined : "outlined"}
        color={f.enabled ? "primary" : "default"}
        sx={{ m: 1, p: 1 }}
        label={f.name}
      />
    </Tooltip>
  );
}


interface MyFiltersProps {
  sx?: React.CSSProperties,
  myFilters: Filter[],
  toggleFilter: (filter: Filter) => void,
  deleteFilter: (filter: Filter) => void,
}

export default function MyFilters({
  sx,
  myFilters,
  toggleFilter,
  deleteFilter,
}: MyFiltersProps) {
  return (
    <Stack sx={{ ...sx }}>
      <Typography variant="h5">Saved filters</Typography>
      <Box sx={{ overflowY: "scroll" }}>
        {myFilters.map((f) => (
          <MyFilter
            deleteFilter={deleteFilter}
            toggleFilter={toggleFilter}
            key={f.id}
            f={f}
          />
        ))}
      </Box>
    </Stack>
  );
}
