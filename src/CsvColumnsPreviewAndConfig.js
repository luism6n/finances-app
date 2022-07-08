import {
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { parseCSV } from "./utils";

function useCsvColumnsConfig() {
  const [csvColumnsConfig, setCsvColumnsConfig] = useState([]);

  return [csvColumnsConfig, setCsvColumnsConfig];
}

function CsvColumnsPreviewAndConfig({
  file,
  csvColumnsConfig,
  setCsvColumnsConfig,
}) {
  const [isReadingFile, setIsReadingFile] = useState(true);
  const [previewRows, setPreviewRows] = useState([]);

  async function updatePreview() {
    setIsReadingFile(true);
    let text = await file.text();
    let lines = text.split("\n");
    let previewLines = lines.slice(0, Math.min(10, lines.length)).join("\n");

    let rows = parseCSV(previewLines);
    setPreviewRows(rows);
    setCsvColumnsConfig(rows[0].map((cell) => "ignore"));

    setIsReadingFile(false);
  }

  useEffect(() => {
    if (!file) {
      return;
    }

    updatePreview();
  }, [file]);

  if (!file) {
    return <Typography textAlign="center">Select a file</Typography>;
  }

  if (isReadingFile) {
    return <Typography textAlign="center">Loading preview...</Typography>;
  }

  function columnDisplayName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function updateColumnsConfig(value, index) {
    setCsvColumnsConfig(
      csvColumnsConfig.map((v, i) => {
        return i === index ? value : v;
      })
    );
  }

  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {csvColumnsConfig.map((columnValue, i) => (
              <TableCell key={nanoid()}>
                <Select
                  value={columnValue}
                  onChange={(e) => updateColumnsConfig(e.target.value, i)}
                  sx={{ width: "100%" }}
                  size="small"
                >
                  {["ignore", "description", "category", "amount", "date"].map(
                    (c) => (
                      <MenuItem value={c}>{columnDisplayName(c)}</MenuItem>
                    )
                  )}
                </Select>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {previewRows.map((row, i) => {
            return (
              <TableRow
                key={nanoid()}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {row.map((cell, i) => (
                  <TableCell key={nanoid()}>{cell}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { CsvColumnsPreviewAndConfig, useCsvColumnsConfig };
