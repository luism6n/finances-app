import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React from "react";

export default function CurrentFilter(filter, setFilter) {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <TextField
        sx={{ flex: 2, p: 1 }}
        variant="filled"
        size="small"
        value={filter.text}
        onChange={(e) => setFilter({ ...filter, text: e.target.value })}
        label="filter memo"
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label="min date"
          inputFormat="dd/MM/yyyy"
          value={filter.minDate}
          onChange={(d) => setFilter({ ...filter, minDate: moment(d) })}
          renderInput={(params) => (
            <TextField
              sx={{ flex: 1, p: 1 }}
              variant="filled"
              size="small"
              {...params}
            />
          )}
        />
        <DesktopDatePicker
          label="max date"
          inputFormat="dd/MM/yyyy"
          value={filter.maxDate}
          onChange={(d) => setFilter({ ...filter, maxDate: moment(d) })}
          renderInput={(params) => (
            <TextField
              sx={{ flex: 1, p: 1 }}
              variant="filled"
              size="small"
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}
