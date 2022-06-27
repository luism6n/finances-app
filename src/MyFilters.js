import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import React, { Fragment } from "react";

function MyFilter({ f, setCurrentFilter }) {
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
      <Chip onClick={() => setCurrentFilter(f)} sx={{ m: 1 }} label={f.name} />
    </Tooltip>
  );
}

export default function MyFilters({ sx, myFilters, setCurrentFilter }) {
  console.log(myFilters);
  return (
    <Stack sx={{ ...sx }}>
      {myFilters.map((f) => (
        <MyFilter setCurrentFilter={setCurrentFilter} key={f.id} f={f} />
      ))}
    </Stack>
  );
}
