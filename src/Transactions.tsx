import {
  Button,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import CategorizeDialog from "./CategorizeDialog";
import { formatMoney } from "./utils";
import { Transaction } from "./types";

interface Props {
  transactions: Transaction[];
  setCategory: (
    transaction: Transaction | Transaction[],
    category: string
  ) => void;
}

export default function Transactions({ transactions, setCategory }: Props) {
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
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

  function onPageChange(e: React.ChangeEvent<unknown>, page: number): void {
    setPage(page);

    if (ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }

  return (
    <Stack
      sx={{
        overflowY: "scroll",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Button onClick={() => setOpenCategorizeDialog(true)}>
        Categorize selection
      </Button>
      <CategorizeDialog
        open={openCategorizeDialog}
        setOpen={setOpenCategorizeDialog}
        setCategory={(c) => setCategory(transactions, c)}
      ></CategorizeDialog>
      <TableContainer sx={{ height: "100%" }} ref={ref}>
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionsInPage.map((t, i) => {
              let rowColor = t.ignored ? "gray" : "black";
              return (
                <TableRow
                  key={t.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ color: rowColor }} align="right">
                    {(page - 1) * perPage + i + 1}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="left">
                    {t.date.format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="left">
                    {t.categ}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="right">
                    {t.description}
                  </TableCell>
                  <TableCell
                    sx={{ color: t.amount > 0 ? "darkgreen" : "black" }}
                    align="right"
                  >
                    {formatMoney(t.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ p: 2 }}
        count={Math.ceil(transactions.length / perPage)}
        page={page}
        onChange={onPageChange}
      />
    </Stack>
  );
}
