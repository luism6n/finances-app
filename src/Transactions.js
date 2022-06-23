import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React, { Fragment, useState } from "react";
import FileSelector from "./FileSelector.js";
import TransactionCard from "./TransactionCard.js";

export default function Transactions({
  transactions,
  ignore,
  unignore,
  setUnfiltered,
  setOpenFiles,
}) {
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  function orderTransactions(t1, t2) {
    if (t1.ignored && !t2.ignored) {
      return 1;
    } else if (t2.ignored && !t1.ignored) {
      return -1;
    }

    return t1.id.localeCompare(t2.id);
  }

  return (
    <Fragment>
      {transactions
        .sort(orderTransactions)
        .slice(-10)
        .map((t) => (
          <TransactionCard
            key={t.id}
            t={t}
            ignore={ignore}
            unignore={unignore}
          />
        ))}
      <Fab sx={{ position: "absolute", bottom: 25, right: 25 }}>
        <Add onClick={openFileSelector} />
      </Fab>
      <FileSelector
        open={fileSelectorOpen}
        setOpen={setFileSelectorOpen}
        setUnfiltered={setUnfiltered}
        setOpenFiles={setOpenFiles}
      ></FileSelector>
    </Fragment>
  );
}
