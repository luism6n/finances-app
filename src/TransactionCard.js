import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

function formatMoney(s) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(s);
}

export default function TransactionCard({
  index,
  t,
  ignore,
  select,
  setCategory,
}) {
  const [categ, setCateg] = useState(t.categ);
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
        alignContent: "center",
      }}
    >
      <Typography color={color} sx={{ flex: 0.5 }}>
        {index}
      </Typography>
      <Typography color={color} sx={{ textDecoration, flex: 1 }}>
        {t.date.format("DD/MM/YYYY")}
      </Typography>
      <TextField
        size="small"
        value={categ}
        sx={{ px: 2, py: 1 }}
        onChange={(e) => setCateg(e.target.value)}
        onBlur={(e) => setCategory(t, e.target.value)}
      >
        {categ}
      </TextField>
      <Typography color={color} sx={{ textDecoration, flex: 4 }}>
        {t.memo}
      </Typography>
      <Typography align="left" color={color} sx={{ textDecoration, flex: 1 }}>
        {formatMoney(t.amount)}
      </Typography>
      {t.ignored ? (
        <Button sx={{ flex: 1 }} onClick={() => select(t)}>
          Select
        </Button>
      ) : (
        <Button sx={{ flex: 1 }} onClick={() => ignore(t)}>
          Ignore
        </Button>
      )}
    </Stack>
  );
}
