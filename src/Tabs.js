import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
import React, { useState } from "react";
import Evolution from "./Evolution";
import Transactions from "./Transactions";
import Visualization from "./Visualization";

export default function Tabs({
  sx,
  setCategory,
  current,
  currentFiltered,
  ignore,
  select,
  setUnfiltered,
  setOpenFiles,
  filtered,
  groupBy,
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
            <Tab label="Filter preview" value="1" />
            <Tab label="Selection" value="2" />
            <Tab label="Visualization" value="3" />
            <Tab label="Evolution" value="4" />
          </TabList>
        </Box>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="1">
          <Transactions
            setCategory={setCategory}
            transactions={current}
            ignore={ignore}
            select={select}
            setUnfiltered={setUnfiltered}
            setOpenFiles={setOpenFiles}
          />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%", p: 0 }} value="2">
          <Transactions
            setCategory={setCategory}
            transactions={filtered}
            ignore={ignore}
            select={select}
            setUnfiltered={setUnfiltered}
            setOpenFiles={setOpenFiles}
          />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="3">
          {currentFiltered.length > 0 ? (
            <Visualization groupBy={groupBy} transactions={currentFiltered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="4">
          {currentFiltered.length > 0 ? (
            <Evolution groupBy={groupBy} transactions={currentFiltered} />
          ) : (
            "Select at least one transaction"
          )}
        </TabPanel>
      </Stack>
    </TabContext>
  );
}
