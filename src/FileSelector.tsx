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
import { Transaction} from "./types";

interface Props {
  open: boolean,
  setOpen: (open: boolean) => void,
  setTransactions: (t: Transaction[] | ((t: Transaction[]) => Transaction[])) => void,
}

export default function FileSelector({
  open,
  setOpen,
  setTransactions,
}: Props) {
  const [erasePrevious, setErasePrevious] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  async function loadFiles() {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.info("no files added");
      return;
    }

    let newTransactions: Transaction[] = [];
    for (let f of Array.from(selectedFiles)) {
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

      const fileTransactions = rawTransactionList.map((t: any, i: number) => {
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

      newTransactions = newTransactions
        .concat(fileTransactions)
        .filter((t) => !Number.isNaN(t.amount));
    }

    if (erasePrevious) {
      setTransactions(newTransactions);
    } else {
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
            onChange={(e) => setSelectedFiles((e.target as HTMLInputElement).files)}
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
