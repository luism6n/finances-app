import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import parseCSV from "./utils";

export default function FileSelector({
  open,
  setOpen,
  setUnfiltered,
  setOpenFiles,
}) {
  const [erasePrevious, setErasePrevious] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesFormat, setSelectedFilesFormat] = useState("nubank cc");

  async function loadFiles() {
    if (selectedFiles.length === 0) {
      console.info("no files added");
      return;
    }

    let newFiles = [];
    let newTransactions = [];
    for (let f of selectedFiles) {
      const fileId = nanoid(10);

      const fileContents = await f.text();
      const fileTransactions = parseCSV(fileContents).map((t, i) => {
        switch (selectedFilesFormat) {
          case "nubank credit card":
            return {
              amount: -Number.parseFloat(t[3]),
              date: moment(t[0], "YYYY-MM-DD"),
              memo: t[2],
              sequence: i,
              fileId: fileId,
              fileName: f.name,
              id: nanoid(),
              ignored: false,
            };
          case "nubank account":
            return {
              amount: Number.parseFloat(t[1]),
              date: moment(t[0], "DD/MM/YYYY"),
              memo: t[3],
              sequence: i,
              fileId: fileId,
              fileName: f.name,
              id: nanoid(),
              ignored: false,
            };
          default:
            console.error(`file format "${selectedFilesFormat}" unknown`);
            return null;
        }
      });

      const newFile = {
        id: fileId,
        name: f.name,
        format: selectedFilesFormat,
        numTransactions: fileTransactions.length,
      };

      newFiles.push(newFile);
      newTransactions = newTransactions
        .concat(fileTransactions)
        .filter((t) => !Number.isNaN(t.amount));
    }

    if (erasePrevious) {
      setOpenFiles(newFiles);
      setUnfiltered(newTransactions);
    } else {
      setOpenFiles((o) => {
        return [...o, newFiles];
      });
      setUnfiltered((u) => {
        return [...u, ...newTransactions];
      });
    }

    setOpen(false);
  }
  return (
    <Dialog
      aria-labelledby="file-selector-title"
      aria-describedby="file-selector-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>Select files</DialogTitle>
      <DialogContent>
        <Stack>
          <Input
            sx={{ marginBottom: 3 }}
            onChange={(e) => setSelectedFiles(e.target.files)}
            id="fileInput"
            inputProps={{ multiple: true }}
            type="file"
          ></Input>
          <FormControl component="fieldset">
            <FormLabel component="legend">Format</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={selectedFilesFormat}
              onChange={(e) => setSelectedFilesFormat(e.target.value)}
            >
              <FormControlLabel
                value="nubank credit card"
                control={<Radio />}
                label="Nubank Credit Card"
              />
              <FormControlLabel
                value="nubank account"
                control={<Radio />}
                label="Nubank Account"
              />
            </RadioGroup>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={erasePrevious}
                  onChange={(e) => setErasePrevious(e.target.checked)}
                />
              }
              label="Erase previously loaded transactions"
            ></FormControlLabel>
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button variant="contained" onClick={() => loadFiles()}>
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
}
