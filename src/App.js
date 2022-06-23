import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Transactions from "./Transactions";
import useTransactions from "./useTransactions";
import Visualization from "./Visualization";

function App() {
  const [tab, setTab] = useState("1");
  const [filterMemo, setFilterMemo] = useState("");
  const {
    transactions,
    unfiltered,
    ignore,
    unignore,
    setUnfiltered,
    setOpenFiles,
  } = useTransactions();

  const filtered = unfiltered.filter((t) =>
    t.memo.toLowerCase().includes(filterMemo)
  );

  return (
    <Stack sx={{ height: "100vh", padding: 2 }}>
      <Typography variant="h2">Finances</Typography>
      <TextField
        value={filterMemo}
        onChange={(e) => setFilterMemo(e.target.value)}
        label="filter memo"
      />
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, tab) => setTab(tab)}
            aria-label="lab API tabs example"
          >
            <Tab label="Transactions" value="1" />
            <Tab label="Visualization" value="2" />
          </TabList>
        </Box>
        <TabPanel sx={{ overflow: "scroll", height: "100%" }} value="1">
          <Transactions
            transactions={filtered}
            ignore={ignore}
            unignore={unignore}
            setUnfiltered={setUnfiltered}
            setOpenFiles={setOpenFiles}
          />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="2">
          {filtered.length > 0 ? (
            <Visualization transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
      </TabContext>
    </Stack>
  );
}

export default App;
