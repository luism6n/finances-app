import React, { useMemo, useRef, useState } from "react";
import * as d3 from "d3";
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
import { formatMoney } from "./utils";
import CategorizeDialog from "./CategorizeDialog";

export default function Categorize({ transactions, setCategory }) {
  const ref = useRef();
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const [clickedMemo, setClickedMemo] = useState("");

  let largestMemos = useMemo(
    () =>
      Array.from(
        d3.rollup(
          transactions.filter((t) => t.categ === "" || t.categ === "?"),
          (g) => ({ sum: d3.sum(g, (t) => t.amount), count: g.length }),
          (t) => t.memo
        )
      ).sort(([k1, v1], [k2, v2]) => {
        return Math.abs(v2.sum) - Math.abs(v1.sum);
      }),
    [transactions]
  );

  const [page, setPage] = useState(1);
  const perPage = 50;

  const memosInThePage = largestMemos.slice(
    (page - 1) * perPage,
    page * perPage
  );

  function onPageChange(e, v) {
    setPage(v);
    ref.current.scrollTo(0, 0);
  }

  console.log({ largestMemos });

  if (largestMemos.length === 0) {
    return "All transactions have a category already";
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
      <CategorizeDialog
        open={openCategorizeDialog}
        setOpen={setOpenCategorizeDialog}
        setCategory={(c) =>
          setCategory(
            transactions.filter((t) => t.memo === clickedMemo),
            c
          )
        }
      ></CategorizeDialog>
      <TableContainer sx={{ height: "100%", overflowY: "scroll" }} ref={ref}>
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="center">Count</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Sum</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memosInThePage.map(([k, v], i) => {
              return (
                <TableRow
                  key={k}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="right">
                    {(page - 1) * perPage + i + 1}
                  </TableCell>
                  <TableCell align="center">{v.count}x</TableCell>
                  <TableCell align="right">{k}</TableCell>
                  <TableCell
                    sx={{ color: v.sum > 0 ? "darkgreen" : "black" }}
                    align="right"
                  >
                    {formatMoney(v.sum)}
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      onClick={(e) => {
                        setClickedMemo(k);
                        setOpenCategorizeDialog(true);
                      }}
                      size="small"
                    >
                      Set category
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ p: 2 }}
        count={Math.ceil(memosInThePage.length / perPage)}
        page={page}
        onChange={onPageChange}
      />
    </Stack>
  );
}
