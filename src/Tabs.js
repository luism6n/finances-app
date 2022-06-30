import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
import React, { useState } from "react";
import Evolution from "./Evolution";
import Summary from "./Summary";
import Transactions from "./Transactions";
import Visualization from "./Visualization";

export default function Tabs({ sx, filtered, groupBy, currentFilterResults }) {
  const [tab, setTab] = useState("1");
  return (
    <TabContext value={tab}>
      <Stack sx={sx}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, tab) => setTab(tab)}
            aria-label="lab API tabs example"
          >
            <Tab label="Transactions" value="1" />
            <Tab label="Filtered" value="2" />
            <Tab label="Visualization" value="3" />
            <Tab label="Evolution" value="4" />
            <Tab label="Summary" value="5" />
          </TabList>
        </Box>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="1">
          <Transactions transactions={currentFilterResults} />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="2">
          <Transactions transactions={filtered} />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="3">
          {filtered.length > 0 ? (
            <Visualization transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="4">
          {filtered.length > 0 ? (
            <Evolution transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="5">
          {filtered.length > 0 ? (
            <Summary transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
      </Stack>
    </TabContext>
  );
}
