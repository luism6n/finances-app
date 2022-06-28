import { Box, CircularProgress, Pagination, Stack } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TransactionCard from "./TransactionCard.js";

export default function Transactions({
  transactions,
  ignore,
  select,
  setCategory,
}) {
  const ref = useRef();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 50;

  const orderedTransactions = useMemo(
    () =>
      transactions.sort((t1, t2) => {
        return t1.id.localeCompare(t2.id);
      }),
    [transactions]
  );

  const transactionsInPage = orderedTransactions.slice(
    (page - 1) * perPage,
    page * perPage
  );
  console.log({ transactionsInPage });

  useEffect(() => {
    setLoading(false);
  }, [page]);

  function onPageChange(e, v) {
    setLoading(true);
    setPage(v);
    ref.current.scrollTo(0, 0);
  }

  return (
    <Stack sx={{ alignItems: "center", width: "100%", height: "100%" }}>
      <Stack ref={ref} sx={{ flex: 1, width: "100%", overflowY: "scroll" }}>
        {loading
          ? null
          : transactionsInPage.map((t, i) => (
              <TransactionCard
                setCategory={setCategory}
                index={(page - 1) * perPage + i + 1}
                key={t.id}
                t={t}
                ignore={ignore}
                select={select}
              />
            ))}
      </Stack>
      <Pagination
        sx={{ p: 2 }}
        count={Math.ceil(transactions.length / perPage)}
        page={page}
        onChange={onPageChange}
      />
    </Stack>
  );
}
