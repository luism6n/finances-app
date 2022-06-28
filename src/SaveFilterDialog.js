import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import CurrentFilter from "./CurrentFilter";
import Transactions from "./Transactions";

export default function SaveFilterDialog({
  current,
  currentFilter,
  setCurrentFilter,
  saveFilter,
  open,
  setOpen,
}) {
  const [filterName, setFilterName] = useState("");
  const [currentFilterNoNameError, setCurrentFilterNoNameError] = useState("");
  function validateAndSaveFilter(e) {
    if (!filterName) {
      setCurrentFilterNoNameError("Filter must have a name");
      return;
    }

    setCurrentFilterNoNameError("");
    saveFilter({ ...currentFilter, name: filterName, id: nanoid() });
    setFilterName("");
    setOpen(false);
  }
  return (
    <Dialog
      PaperProps={{ sx: { height: "100%" } }}
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack sx={{ mb: 1, flexDirection: "row" }}>
            <TextField
              sx={{ flex: 2 }}
              variant="filled"
              size="small"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              label="filter name"
              error={!!currentFilterNoNameError}
            />
            <Button sx={{ ml: 1 }} onClick={validateAndSaveFilter}>
              Save filter
            </Button>
          </Stack>
          <CurrentFilter filter={currentFilter} setFilter={setCurrentFilter} />
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Filter Preview
          </Typography>
          <Transactions transactions={current} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
