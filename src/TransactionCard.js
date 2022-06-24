import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function formatMoney(s) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(s);
}

export default function TransactionCard({ index, t, ignore, unignore }) {
  if (!t.date) console.warn(t);

  let color = "text.primary";
  let textDecoration = "none";
  if (t.ignored) {
    textDecoration = "line-through";
    color = "text.secondary";
  }

  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography color={color} sx={{ flex: 0.5 }}>
        {index}
      </Typography>
      <Typography color={color} sx={{ textDecoration, flex: 1 }}>
        {t.date.format("DD/MM/YYYY")}
      </Typography>
      <Typography color={color} sx={{ textDecoration, flex: 4 }}>
        {t.memo}
      </Typography>
      <Typography align="left" color={color} sx={{ textDecoration, flex: 1 }}>
        {formatMoney(t.amount)}
      </Typography>
      {t.ignored ? (
        <Button sx={{ flex: 1 }} onClick={() => unignore(t)}>
          Unignore
        </Button>
      ) : (
        <Button sx={{ flex: 1 }} onClick={() => ignore(t)}>
          Ignore
        </Button>
      )}
    </Stack>
  );
}
