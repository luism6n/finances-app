import {
  Button,
  Dialog,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCategory: (category: string) => void,
}

export default function CategorizeDialog({ open, setOpen, setCategory }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.focus();
  }, [open]);

  const [c, setC] = useState("");
  return (
    <Dialog
      aria-labelledby="file-selector-title"
      aria-describedby="file-selector-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogActions>
        <Stack>
          <form>
            <Stack>
              <TextField
                ref={ref}
                type="text"
                onChange={(e) => setC(e.target.value)}
                value={c}
              ></TextField>
              <Button
                type="submit"
                sx={{ flex: 1, marginTop: 1 }}
                onClick={(e) => {
                  e.preventDefault();
                  setC("");
                  setCategory(c);
                  setOpen(false);
                }}
              >
                Set category
              </Button>
            </Stack>
          </form>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
