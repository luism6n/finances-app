import { Fab, Stack, Typography } from "@mui/material";
import { useState } from "react";
import useTransactions from "./useTransactions";
import CategorizeDialog from "./CategorizeDialog";
import CurrentFilter from "./CurrentFilter";
import useFilters from "./useFilters";
import Actions from "./Actions";
import { Add } from "@mui/icons-material";
import FileSelector from "./FileSelector";
import Tabs from "./Tabs";
import MyFilters from "./MyFilters";

function App() {
  const [groupBy, setGroupBy] = useState("memo");
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const { myFilters, saveFilter, toggleFilter, deleteFilter } = useFilters();

  const { transactions, setCategory, setTransactions, setOpenFiles } =
    useTransactions();
  const [currentFilter, setCurrentFilter] = useState({
    memo: "",
    categ: "",
    enabled: true,
  });

  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  function applyFilters(transactions, filters) {
    console.log(transactions);
    let filtered = transactions;
    for (let f of filters) {
      if (!f.enabled) {
        continue;
      }

      filtered = filtered
        .filter((t) => t.memo.toLowerCase().includes(f.memo))
        .filter((t) => t.categ.toLowerCase().includes(f.categ))
        .filter((t) =>
          f.minDate && f.minDate.isValid() ? t.date >= f.minDate : true
        )
        .filter((t) =>
          f.maxDate && f.maxDate.isValid() ? t.date <= f.maxDate : true
        );
    }

    return filtered;
  }

  console.log({ currentFilter, myFilters, transactions });
  const filtered = applyFilters(transactions, [...myFilters, currentFilter]);

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  return (
    <Stack
      sx={{ margin: "auto", height: "98vh", padding: "1vh", maxWidth: 1200 }}
    >
      <Typography variant="h2">Finances</Typography>
      <CurrentFilter
        filter={currentFilter}
        setFilter={setCurrentFilter}
        saveFilter={saveFilter}
      />
      <Actions
        {...{
          groupBy,
          setGroupBy,
          setOpenCategorizeDialog,
          saveFilter,
          currentFilter,
        }}
      />

      <Stack sx={{ overflow: "hidden", flex: 1, flexDirection: "row" }}>
        <MyFilters
          sx={{ flex: 1, margin: 2 }}
          {...{ myFilters, toggleFilter, deleteFilter }}
        ></MyFilters>
        <Tabs
          sx={{ flex: 5, margin: 2 }}
          {...{
            setCategory,
            filtered,
            setTransactions,
            setOpenFiles,
            groupBy,
          }}
        />
      </Stack>

      <Fab size="small" sx={{ position: "absolute", bottom: 25, right: 25 }}>
        <Add onClick={openFileSelector} />
      </Fab>
      <FileSelector
        open={fileSelectorOpen}
        setOpen={setFileSelectorOpen}
        setTransactions={setTransactions}
        setOpenFiles={setOpenFiles}
      ></FileSelector>

      <CategorizeDialog
        open={openCategorizeDialog}
        setOpen={setOpenCategorizeDialog}
        setCategory={(c) => setCategory(filtered, c)}
      ></CategorizeDialog>
    </Stack>
  );
}

export default App;
