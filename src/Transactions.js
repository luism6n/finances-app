import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import moment from "moment";
import React, { Fragment } from "react";
import TransactionCard from "./TransactionCard.js";
import useTransactions from "./useTransactions.js";
import parseCSV from "./utils.js";

export default function Transactions() {
  const { transactions, setTransactions } = useTransactions();

  function addFiles() {
    window.document.getElementById("fileInput").click();
  }

  async function loadFiles(files) {
    if (files.length === 0) {
      console.info("no files added");
      return;
    }

    let transactions = [];
    for (let f of files) {
      const fileContents = await f.text();
      transactions = transactions.concat(parseCSV(fileContents));
    }

    setTransactions(
      transactions
        .map((t, i) => {
          return {
            amount: -Number.parseFloat(t[3]),
            date: moment(t[0]),
            memo: t[2],
            id: i,
          };
        })
        .filter((t) => !Number.isNaN(t.amount))
    );
  }

  return (
    <Fragment>
      {transactions.map((t) => (
        <TransactionCard key={t.id} t={t} />
      ))}
      <Fab sx={{ position: "absolute", bottom: 25, right: 25 }}>
        <Add onClick={addFiles} />
      </Fab>
      <input
        onChange={(e) => loadFiles(e.target.files)}
        id="fileInput"
        type="file"
        style={{ hidden: true }}
        multiple
      ></input>
    </Fragment>
  );
}
