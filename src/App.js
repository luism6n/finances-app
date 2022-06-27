import { Fab, Stack, Typography } from "@mui/material";
import { useState } from "react";
import useTransactions from "./useTransactions";
import * as d3 from "d3";
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
  const {
    setCategory,
    unfiltered,
    ignore,
    select,
    setUnfiltered,
    setOpenFiles,
  } = useTransactions();
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);

  const {
    currentFilter,
    setCurrentFilter,
    filtered,
    current,
    currentFiltered,
    myFilters,
    saveFilter,
  } = useFilters(unfiltered, {
    text: "",
    minDate: d3.min(unfiltered, (t) => t.date),
    maxDate: d3.max(unfiltered, (t) => t.date),
  });

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
      <CurrentFilter filter={currentFilter} setFilter={setCurrentFilter} />
      <Actions
        {...{
          groupBy,
          setGroupBy,
          ignoreCurrent,
          selectCurrent,
          selectOnly,
          setOpenCategorizeDialog,
          saveFilter,
          currentFilter,
        }}
      />

      <Stack sx={{ flex: 1, flexDirection: "row" }}>
        <MyFilters
          sx={{ flex: 1, margin: 2 }}
          {...{ myFilters, setCurrentFilter }}
        ></MyFilters>
        <Tabs
          sx={{ flex: 5, margin: 2 }}
          {...{
            setCategory,
            current,
            currentFiltered,
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
