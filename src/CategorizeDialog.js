import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export default function CategorizeDialog({ open, setOpen, setCategory }) {
  const [c, setC] = useState("");
  return (
    <Dialog
      aria-labelledby="file-selector-title"
      aria-describedby="file-selector-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <TextField onChange={(e) => setC(e.target.value)} value={c}></TextField>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ flex: 1 }}
          onClick={() => {
            setCategory(c);
            setOpen(false);
          }}
        >
          Set category
        </Button>
      </DialogActions>
    </Dialog>
  );
}
