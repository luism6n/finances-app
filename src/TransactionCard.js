import { Stack, Typography } from "@mui/material";
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
        color,
        textDecoration,
        minHeight: 50,
        paddingX: 3,
      }}
    >
      <Typography sx={{ flex: 0.5 }}>{index}</Typography>
      <Typography sx={{ flex: 1 }}>{t.date.format("DD/MM/YYYY")}</Typography>
      <Typography sx={{ flex: 1 }}>{t.categ}</Typography>
      <Typography sx={{ flex: 3 }}>{t.memo}</Typography>
      <Typography align="right" sx={{ flex: 1 }}>
        {formatMoney(t.amount)}
      </Typography>
    </Stack>
  );
}
