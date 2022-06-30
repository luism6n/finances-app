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
import Search from "./Search";

function App() {
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const { myFilters, saveFilter, toggleFilter, deleteFilter } = useFilters();

  const { transactions, setCategory, setTransactions, setOpenFiles } =
    useTransactions();
  const [currentFilter, setCurrentFilter] = useState({
    query: {},
    enabled: true,
  });

  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  function includesAny(value, searchTerms) {
    if (!searchTerms) {
      return true;
    }

    for (let term of searchTerms) {
      if (term.startsWith("!")) {
        if (!value.includes(term.substring(1))) return true;
      } else if (value.includes(term)) {
        return true;
      }
    }

    return false;
  }

  function applyFilters(transactions, filters) {
    let filtered = transactions;
    for (let f of filters) {
      if (!f.enabled) {
        continue;
      }

      let q = f.query;
      console.log({ q });

      filtered = filtered
        .filter((t) =>
          includesAny(t.memo.toLowerCase() + t.categ.toLowerCase(), q.text)
        )
        .filter((t) => includesAny(t.memo.toLowerCase(), q.desc))
        .filter((t) => includesAny(t.categ.toLowerCase(), q.categ))
        .filter((t) => includesAny(t.date.format("YYYY"), q.y))
        .filter((t) => includesAny(t.date.format("MM"), q.m))
        .filter((t) => includesAny(t.date.format("DD"), q.d));
    }

    return filtered;
  }

  const filtered = applyFilters(transactions, [...myFilters, currentFilter]);
  const currentFilterResults = applyFilters(transactions, [currentFilter]);

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
          setOpenCategorizeDialog,
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
            filtered,
            currentFilterResults,
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
