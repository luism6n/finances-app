import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React, { Fragment, useState } from "react";
import FileSelector from "./FileSelector.js";
import TransactionCard from "./TransactionCard.js";

export default function Transactions({
  unfiltered,
  ignore,
  unignore,
  setUnfiltered,
  setOpenFiles,
}) {
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  return (
    <Fragment>
      {unfiltered
        .sort((t1, t2) => t1.id.localeCompare(t2.id))
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
