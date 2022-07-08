import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Input,
  Stack,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { parse } from "node-ofx-parser";
import moment from "moment";

export default function FileSelector({
  open,
  setOpen,
  setTransactions,
  setOpenFiles,
}) {
  const [erasePrevious, setErasePrevious] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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

      const ofx = parse(fileContents).OFX;
      let rawTransactionList;

      try {
        rawTransactionList =
          ofx.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
      } catch (e) {
        if (e instanceof TypeError) {
          rawTransactionList =
            ofx.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN;
        }
      }

      const fileTransactions = rawTransactionList.map((t, i) => {
        return {
          amount: Number.parseFloat(t.TRNAMT),
          date: moment(t.DTPOSTED.slice(0, 8), "YYYYMMDD"),
          memo: t.MEMO,
          categ: "?",
          sequence: i,
          fileId: fileId,
          fileName: f.name,
          id: nanoid(),
          ignored: false,
        };
      });

      const newFile = {
        id: fileId,
        name: f.name,
        numTransactions: fileTransactions.length,
      };

      newFiles.push(newFile);
      newTransactions = newTransactions
        .concat(fileTransactions)
        .filter((t) => !Number.isNaN(t.amount));
    }

    if (erasePrevious) {
      setOpenFiles(newFiles);
      setTransactions(newTransactions);
    } else {
      setOpenFiles((o) => {
        return [...o, newFiles];
      });
      setTransactions((u) => {
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
      <DialogTitle>Upload OFX files</DialogTitle>
      <DialogContent>
        <Stack>
          <Input
            sx={{ marginBottom: 3 }}
            onChange={(e) => setSelectedFiles(e.target.files)}
            id="fileInput"
            inputProps={{ multiple: true }}
            type="file"
          ></Input>
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
