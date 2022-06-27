import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";

function Actions({
  groupBy,
  setGroupBy,
  ignoreSelected,
  unignoreSelected,
  selectOnly,
  setOpenCategorizeDialog,
}) {
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
        <Button onClick={ignoreSelected}>Ignore selected</Button>
        <Button onClick={unignoreSelected}>Unignore selected</Button>
        <Button onClick={selectOnly}>Select these only</Button>
        <Button onClick={() => setOpenCategorizeDialog(true)}>
          Categorize these
        </Button>
      </Stack>
    </Stack>
  );
}

export default Actions;
