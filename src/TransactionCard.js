import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

function formatMoney(s) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(s);
}

export default function TransactionCard({ t }) {
  return (
    <Card sx={{ margin: 1 }}>
      <CardContent>
        <Typography sx={{ fontSize: "1.5em" }}>{t.memo}</Typography>
        <Typography>{formatMoney(t.amount)}</Typography>
        <Typography>{t.date.format("DD/MM/YYYY")}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {t.id}
        </Typography>
      </CardContent>
    </Card>
  );
}
