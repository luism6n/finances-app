import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab, Typography } from "@mui/material";
import { useState } from "react";
import Transactions from "./Transactions";
import Visualization from "./Visualization";

function App() {
  const [tab, setTab] = useState("1");

  return (
    <Stack sx={{ height: "100vh" }}>
      <Typography variant="h1">Finances</Typography>
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
          <Transactions />
        </TabPanel>
        <TabPanel sx={{ overflow: "hidden", height: "100%" }} value="2">
          <Visualization />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}

export default App;
