import { Button, Stack } from "@mui/material";
import React from "react";

function Actions({ setOpenCategorizeDialog }) {
  return (
    <Stack
      sx={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Stack sx={{ flexDirection: "row", justifyContent: "right" }}>
        <Button onClick={() => setOpenCategorizeDialog(true)}>
          Categorize selection
        </Button>
      </Stack>
    </Stack>
  );
}

export default Actions;
