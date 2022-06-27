import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useState } from "react";

function Actions({
  groupBy,
  setGroupBy,
  ignoreCurrent,
  selectCurrent,
  selectOnly,
  setOpenCategorizeDialog,
  saveFilter,
  currentFilter,
}) {
  const [filterName, setFilterName] = useState("");
  const [currentFilterNoNameError, setCurrentFilterNoNameError] = useState("");
  function validateAndSaveFilter(e) {
    if (!filterName) {
      setCurrentFilterNoNameError("Filter must have a name");
      return;
    }

    saveFilter({ ...currentFilter, name: filterName, id: nanoid() });
  }

  return (
    <Stack
      sx={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <FormControl component="fieldset">
        <FormLabel component="legend">Group By</FormLabel>
        <RadioGroup
          aria-label="groupby"
          name="groupby"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <FormControlLabel value="memo" control={<Radio />} label="memo" />
          <FormControlLabel
            value="category"
            control={<Radio />}
            label="category"
          />
        </RadioGroup>
      </FormControl>
      <Stack sx={{ flexDirection: "row", justifyContent: "right" }}>
        <Button onClick={ignoreCurrent}>Ignore current</Button>
        <Button onClick={selectCurrent}>Select current</Button>
        <Button onClick={selectOnly}>Select these only</Button>
        <Button onClick={() => setOpenCategorizeDialog(true)}>
          Categorize these
        </Button>
        <Stack>
          <TextField
            sx={{ flex: 2, p: 1 }}
            variant="filled"
            size="small"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            label="filter name"
          />
          <Button onClick={validateAndSaveFilter}>Save filter</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Actions;
