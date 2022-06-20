import React, { Fragment } from "react";
import TransactionCard from "./TransactionCard.js";
import useTransactions from "./useTransactions.js";

export default function Transactions() {
  const transactions = useTransactions();

  return (
    <Fragment>
      {transactions.map((t) => (
        <TransactionCard key={t.id} t={t} />
      ))}
    </Fragment>
  );
}
