import { Add } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import React, { Fragment, useState } from "react";
import FileSelector from "./FileSelector.js";
import TransactionCard from "./TransactionCard.js";
import { FixedSizeList as List } from "react-window";
import useSize from "./useSize.js";

export default function Transactions({
  transactions,
  ignore,
  unignore,
  setUnfiltered,
  setOpenFiles,
}) {
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);
  const { ref, width, height } = useSize();

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  function orderTransactions(t1, t2) {
    return t1.id.localeCompare(t2.id);
  }

  const sortedTransactions = transactions.sort(orderTransactions);

  const Row = ({ index, style }) => (
    <div style={style}>
      <TransactionCard
        index={index}
        key={sortedTransactions[index].id}
        t={sortedTransactions[index]}
        ignore={ignore}
        unignore={unignore}
      />
    </div>
  );

  return (
    <Box ref={ref} sx={{ width: "100%", height: "100%" }}>
      <List
        className="List"
        height={height}
        itemCount={sortedTransactions.length}
        itemSize={75}
        width={width}
      >
        {Row}
      </List>
      <Fab sx={{ position: "absolute", bottom: 25, right: 25 }}>
        <Add onClick={openFileSelector} />
      </Fab>
      <FileSelector
        open={fileSelectorOpen}
        setOpen={setFileSelectorOpen}
        setUnfiltered={setUnfiltered}
        setOpenFiles={setOpenFiles}
      ></FileSelector>
    </Box>
  );
}
