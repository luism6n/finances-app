import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useState } from "react";
import Transactions from "./Transactions";
import useTransactions from "./useTransactions";
import Visualization from "./Visualization";
import * as d3 from "d3";
import Evolution from "./Evolution";
import CategorizeDialog from "./CategorizeDialog";

function App() {
  const [tab, setTab] = useState("1");
  const [filterText, setfilterText] = useState("");
  const [groupBy, setGroupBy] = useState("memo");
  const [openCategorizeDialog, setOpenCategorizeDialog] = useState(false);
  const {
    setCategory,
    transactions,
    unfiltered,
    ignore,
    unignore,
    setUnfiltered,
    setOpenFiles,
  } = useTransactions();
  const [filterMinDate, setFilterMinDate] = useState(
    d3.min(unfiltered, (t) => t.date)
  );
  const [filterMaxDate, setFilterMaxDate] = useState(
    d3.max(unfiltered, (t) => t.date)
  );

  function filter(transactions) {
    const filtered = transactions
      .filter(
        (t) =>
          t.memo.toLowerCase().includes(filterText) ||
          t.categ.toLowerCase().includes(filterText)
      )
      .filter((t) => t.date >= filterMinDate)
      .filter((t) => t.date <= filterMaxDate);

    return filtered;
  }

  const filtered = filter(unfiltered);

  function ignoreSelected() {
    ignore(filtered);
  }

  function unignoreSelected() {
    unignore(filtered);
  }

  function selectOnly() {
    ignore(unfiltered);
    unignore(filtered);
  }

  return (
    <Stack
      sx={{ margin: "auto", height: "98vh", padding: "1vh", maxWidth: 1200 }}
    >
      <Typography variant="h2">Finances</Typography>

      <Stack sx={{ flexDirection: "row" }}>
        <TextField
          sx={{ flex: 2, p: 1 }}
          variant="filled"
          size="small"
          value={filterText}
          onChange={(e) => setfilterText(e.target.value)}
          label="filter memo"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="min date"
            inputFormat="dd/MM/yyyy"
            value={filterMinDate}
            onChange={(d) => setFilterMinDate(moment(d))}
            renderInput={(params) => (
              <TextField
                sx={{ flex: 1, p: 1 }}
                variant="filled"
                size="small"
                {...params}
              />
            )}
          />
          <DesktopDatePicker
            label="max date"
            inputFormat="dd/MM/yyyy"
            value={filterMaxDate}
            onChange={(d) => setFilterMaxDate(moment(d))}
            renderInput={(params) => (
              <TextField
                sx={{ flex: 1, p: 1 }}
                variant="filled"
                size="small"
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend">Group By</FormLabel>
          <RadioGroup
            aria-label="groupby"
            name="groupby"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <FormControlLabel value="memo" control={<Radio />} label="memo" />
            <FormControlLabel
              value="category"
              control={<Radio />}
              label="category"
            />
          </RadioGroup>
        </FormControl>
        <Stack sx={{ flexDirection: "row", justifyContent: "right" }}>
          <Button onClick={ignoreSelected}>Ignore selected</Button>
          <Button onClick={unignoreSelected}>Unignore selected</Button>
          <Button onClick={selectOnly}>Select these only</Button>
          <Button onClick={() => setOpenCategorizeDialog(true)}>
            Categorize these
          </Button>
        </Stack>
      </Stack>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, tab) => setTab(tab)}
            aria-label="lab API tabs example"
          >
            <Tab label="Transactions" value="1" />
            <Tab label="Visualization" value="2" />
            <Tab label="Evolution" value="3" />
          </TabList>
        </Box>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="1">
          <Transactions
            setCategory={setCategory}
            transactions={filtered}
            ignore={ignore}
            unignore={unignore}
            setUnfiltered={setUnfiltered}
            setOpenFiles={setOpenFiles}
          />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="2">
          {filter(transactions).length > 0 ? (
            <Visualization
              groupBy={groupBy}
              transactions={filter(transactions)}
            />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="3">
          {filter(transactions).length > 0 ? (
            <Evolution groupBy={groupBy} transactions={filter(transactions)} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
      </TabContext>

      <CategorizeDialog
        open={openCategorizeDialog}
        setOpen={setOpenCategorizeDialog}
        setCategory={(c) => setCategory(filtered, c)}
      ></CategorizeDialog>
    </Stack>
  );
}

export default App;
