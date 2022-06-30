import moment from "moment";
import { useState } from "react";

function useTransactions(currentFilter, myFilters) {
  const [openFiles, setOpenFiles] = useState([]);
  const [transactions, _setTransactions] = useState(() =>
    (
      JSON.parse(window.localStorage.getItem("transactions")) || [
        {
          id: "626e4741-144e-4ea4-be0d-1a4ec851c073",
          memo: "a",
          categ: "c",
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
          categ: "d",
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

  function setTransactions(t) {
    if (typeof t === "function") {
      window.localStorage.setItem(
        "transactions",
        JSON.stringify(t(transactions))
      );
    } else {
      window.localStorage.setItem("transactions", JSON.stringify(t));
    }
    _setTransactions(t);
  }

  function replaceInUnfiltered(newTransactions) {
    const newIgnoredIds = new Set(newTransactions.map((t) => t.id));

    setTransactions((u) => [
      ...u.filter((tt) => !newIgnoredIds.has(tt.id)),
      ...newTransactions,
    ]);
  }

  function makeArray(x) {
    if (!Array.isArray(x)) {
      return [x];
    }

    return x;
  }

  function setCategory(t, categ) {
    t = makeArray(t).map((t) => {
      return {
        ...t,
        categ,
      };
    });
    replaceInUnfiltered(t);
  }

  return {
    transactions,
    setCategory,
    setTransactions,
    setOpenFiles,
  };
}

export default useTransactions;
