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
  const [groupBy, setGroupBy] = useState("memo");
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const {
    currentFilter,
    setCurrentFilter,
    myFilters,
    saveFilter,
    toggleFilter,
    deleteFilter,
  } = useFilters({
    memo: "",
    categ: "",
    enabled: true,
  });

  const [query, setQuery] = useState("");

  const {
    setCategory,
    unfiltered,
    current,
    currentFiltered,
    filtered,
    ignore,
    select,
    setUnfiltered,
    setOpenFiles,
  } = useTransactions(currentFilter, myFilters, query);

  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  function ignoreCurrent() {
    ignore(current);
  }

  function selectCurrent() {
    select(current);
  }

  function selectOnly() {
    ignore(unfiltered);
    select(current);
  }

  function openFileSelector() {
    setFileSelectorOpen(true);
  }

  return (
    <Stack
      sx={{ margin: "auto", height: "98vh", padding: "1vh", maxWidth: 1200 }}
    >
      <Typography variant="h2">Finances</Typography>
      <Search {...{ query, setQuery }} />
      <Actions
        {...{
          groupBy,
          setGroupBy,
          ignoreCurrent,
          selectCurrent,
          selectOnly,
          setOpenCategorizeDialog,
          saveFilter,
          current,
          currentFilter,
          setCurrentFilter,
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
            ignore,
            select,
            setUnfiltered,
            setOpenFiles,
            filtered,
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
        setUnfiltered={setUnfiltered}
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
