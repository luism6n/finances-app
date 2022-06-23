import moment from "moment";
import { useState } from "react";

function useTransactions() {
  const [openFiles, setOpenFiles] = useState([]);
  const [unfiltered, _setUnfiltered] = useState(
    (
      JSON.parse(window.localStorage.getItem("unfiltered")) || [
        {
          id: "626e4741-144e-4ea4-be0d-1a4ec851c073",
          memo: "a",
          amount: 20,
          date: "2022-01-01T03:00:00.000Z",
          ignored: false,
          sequence: 1,
          fileId: "fileId",
          fileName: "f.name",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708195b6610",
          memo: "b",
          amount: -10,
          date: "2022-02-02T03:00:00.000Z",
          ignored: false,
          sequence: 1,
          fileId: "fileId",
          fileName: "f.name",
        },
      ]
    ).map((t) => {
      return { ...t, date: moment(t.date, moment.defaultFormatUtc) };
    })
  );

  function setUnfiltered(t) {
    if (typeof t === "function") {
      window.localStorage.setItem("unfiltered", JSON.stringify(t(unfiltered)));
    } else {
      window.localStorage.setItem("unfiltered", JSON.stringify(t));
    }
    _setUnfiltered(t);
  }

  function ignore(t) {
    setUnfiltered([
      ...unfiltered.filter((tt) => tt.id !== t.id),
      { ...t, ignored: true },
    ]);
  }

  function unignore(t) {
    setUnfiltered([
      ...unfiltered.filter((tt) => tt.id !== t.id),
      { ...t, ignored: false },
    ]);
  }

  let transactions = unfiltered.filter((t) => !t.ignored);
  console.log(transactions);

  return {
    unfiltered,
    transactions,
    setUnfiltered,
    setOpenFiles,
    ignore,
    unignore,
  };
}

export default useTransactions;
