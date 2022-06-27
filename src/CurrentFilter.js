import { Stack, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React from "react";

export default function CurrentFilter({ filter, setFilter }) {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <TextField
        sx={{ flex: 2, p: 1 }}
        variant="filled"
        size="small"
        value={filter.memo}
        onChange={(e) => setFilter({ ...filter, memo: e.target.value })}
        label="filter memo"
      />
      <TextField
        sx={{ flex: 2, p: 1 }}
        variant="filled"
        size="small"
        value={filter.categ}
        onChange={(e) => setFilter({ ...filter, categ: e.target.value })}
        label="filter category"
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label="min date"
          inputFormat="dd/MM/yyyy"
          value={
            filter.minDate && filter.minDate.isValid() ? filter.minDate : null
          }
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
          value={
            filter.maxDate && filter.maxDate.isValid() ? filter.maxDate : null
          }
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
