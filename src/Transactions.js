import { Add } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@mui/material";
import { stack } from "d3";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { Fragment, useState } from "react";
import TransactionCard from "./TransactionCard.js";
import useTransactions from "./useTransactions.js";
import parseCSV from "./utils.js";

export default function Transactions() {
  const { transactions, setTransactions } = useTransactions();
  const [openFiles, setOpenFiles] = useState([]);
  const [erasePrevious, setErasePrevious] = useState(false);
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);
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
            };
          case "nubank account":
            return {
              amount: -Number.parseFloat(t[1]),
              date: moment(t[0], "DD/MM/YYYY"),
              memo: t[3],
              sequence: i,
              fileId: fileId,
              fileName: f.name,
              id: nanoid(),
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
      console.log("file loaded:", newFile);

      newFiles.push(newFile);
      newTransactions = newTransactions
        .concat(fileTransactions)
        .filter((t) => !Number.isNaN(t.amount));
    }

    console.log("new transactions:", newTransactions);
    if (erasePrevious) {
      setOpenFiles(newFiles);
      setTransactions(newTransactions);
    } else {
      setOpenFiles((o) => {
        return [...o, newFiles];
      });
      setTransactions([...transactions, ...newTransactions]);
    }

    setFileSelectorOpen(false);
  }

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  function onFileSelectorClosed() {
    setFileSelectorOpen(false);
  }

  return (
    <Fragment>
      {transactions.slice(-10).map((t) => (
        <TransactionCard key={t.id} t={t} />
      ))}
      <Fab sx={{ position: "absolute", bottom: 25, right: 25 }}>
        <Add onClick={openFileSelector} />
      </Fab>
      <Dialog
        aria-labelledby="file-selector-title"
        aria-describedby="file-selector-description"
        open={fileSelectorOpen}
        onClose={onFileSelectorClosed}
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
                    onChange={setErasePrevious}
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
          <Button onClick={() => setFileSelectorOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => loadFiles()}>
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
