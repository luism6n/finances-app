import { Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";

function formatMoney(s) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(s);
}

export default function TransactionCard({ t, ignore, unignore }) {
  if (!t.date) console.warn(t);

  let color = "text.primary";
  if (t.ignored) {
    color = "text.secondary";
  }

  return (
    <Card sx={{ margin: 1 }}>
      <CardContent sx={{ color: color }}>
        <Typography sx={{ fontSize: "1.5em" }}>{t.memo}</Typography>
        <Typography>{formatMoney(t.amount)}</Typography>
        <Typography>{t.date.format("DD/MM/YYYY")}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {t.fileName}:{t.sequence}
        </Typography>
        {t.ignored ? (
          <Button onClick={() => unignore(t)}>Unignore</Button>
        ) : (
          <Button onClick={() => ignore(t)}>Ignore</Button>
        )}
      </CardContent>
    </Card>
  );
}
