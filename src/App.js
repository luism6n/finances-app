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

function App() {
  const [groupBy, setGroupBy] = useState("memo");
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const {
    setCategory,
    unfiltered,
    ignore,
    unignore,
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
  } = useFilters(unfiltered, {
    text: "",
    minDate: d3.min(unfiltered, (t) => t.date),
    maxDate: d3.max(unfiltered, (t) => t.date),
  });

  function ignoreSelected() {
    ignore(current);
  }

  function unignoreSelected() {
    unignore(current);
  }

  function selectOnly() {
    ignore(unfiltered);
    unignore(current);
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
          ignoreSelected,
          unignoreSelected,
          selectOnly,
          setOpenCategorizeDialog,
        }}
      />

      <Stack sx={{ flex: 1 }}>
        <Tabs
          sx={{ flex: 3 }}
          {...{
            setCategory,
            current,
            currentFiltered,
            ignore,
            unignore,
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
