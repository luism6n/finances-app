import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
import React, { useState } from "react";
import Evolution from "./Evolution";
import Summary from "./Summary";
import Transactions from "./Transactions";
import Overview from "./Overview";
import Categorize from "./Categorize";

export default function Tabs({
  sx,
  filtered,
  setCategory,
  currentFilterResults,
}) {
  const [tab, setTab] = useState("1");
  return (
    <TabContext value={tab}>
      <Stack sx={sx}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, tab) => setTab(tab)}
            aria-label="lab API tabs example"
          >
            <Tab label="Overview" value="1" />
            <Tab label="Evolution" value="2" />
            <Tab label="Filtered" value="3" />
            <Tab label="Transactions" value="4" />
            <Tab label="Summary" value="5" />
            <Tab label="Categorize" value="6" />
          </TabList>
        </Box>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="1">
          {filtered.length > 0 ? (
            <Overview transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="2">
          {filtered.length > 0 ? (
            <Evolution transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="3">
          <Transactions setCategory={setCategory} transactions={filtered} />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="4">
          <Transactions
            setCategory={setCategory}
            transactions={currentFilterResults}
          />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="5">
          {filtered.length > 0 ? (
            <Summary transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="6">
          {filtered.length > 0 ? (
            <Categorize setCategory={setCategory} transactions={filtered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
      </Stack>
    </TabContext>
  );
}
