import { Box } from "@mui/material";
import React from "react";
import TransactionCard from "./TransactionCard.js";
import { FixedSizeList as List } from "react-window";
import useSize from "./useSize.js";

export default function Transactions({
  transactions,
  ignore,
  select,
  setCategory,
}) {
  const { ref, width, height } = useSize();

  function orderTransactions(t1, t2) {
    return t1.id.localeCompare(t2.id);
  }

  const sortedTransactions = transactions.sort(orderTransactions);

  const Row = ({ index, style }) => (
    <div style={style}>
      <TransactionCard
        setCategory={setCategory}
        index={index}
        key={sortedTransactions[index].id}
        t={sortedTransactions[index]}
        ignore={ignore}
        select={select}
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
    </Box>
  );
}
