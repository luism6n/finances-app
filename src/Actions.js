import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import SaveFilterDialog from "./SaveFilterDialog";

function Actions({
  groupBy,
  setGroupBy,
  setOpenCategorizeDialog,
  saveFilter,
  current,
  currentFilter,
  setCurrentFilter,
}) {
  const [openSaveFilterDialog, setOpenSaveFilterDialog] = useState(false);

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
        <Button onClick={() => setOpenCategorizeDialog(true)}>
          Categorize selection
        </Button>
        <Button onClick={() => setOpenSaveFilterDialog(true)}>
          Create filter
        </Button>
        <SaveFilterDialog
          {...{
            current,
            currentFilter,
            setCurrentFilter,
            saveFilter,
            open: openSaveFilterDialog,
            setOpen: setOpenSaveFilterDialog,
          }}
        />
      </Stack>
    </Stack>
  );
}

export default Actions;
