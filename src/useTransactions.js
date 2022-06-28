import moment from "moment";
import { useState } from "react";

function useTransactions(currentFilter, myFilters, searchQuery) {
  const [openFiles, setOpenFiles] = useState([]);
  const [_unfiltered, _setUnfiltered] = useState(() =>
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

  function replaceInUnfiltered(newTransactions) {
    const newIgnoredIds = new Set(newTransactions.map((t) => t.id));

    setUnfiltered((u) => [
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

  function ignore(newIgnored) {
    newIgnored = makeArray(newIgnored).map((t) => {
      return {
        ...t,
        ignored: true,
      };
    });

    replaceInUnfiltered(newIgnored);
  }

  function select(newSelected) {
    newSelected = makeArray(newSelected).map((t) => {
      return {
        ...t,
        ignored: false,
      };
    });

    replaceInUnfiltered(newSelected);
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

  function applyFilters(transactions, filters) {
    let filtered = transactions;
    for (let f of filters) {
      if (!f.enabled) {
        continue;
      }

      filtered = filtered
        .filter((t) => t.memo.toLowerCase().includes(f.memo))
        .filter((t) => t.categ.toLowerCase().includes(f.categ))
        .filter((t) =>
          f.minDate && f.minDate.isValid() ? t.date >= f.minDate : true
        )
        .filter((t) =>
          f.maxDate && f.maxDate.isValid() ? t.date <= f.maxDate : true
        );
    }

    console.log(searchQuery);
    filtered = filtered.filter((t) => {
      return (
        t.memo.toLowerCase().includes(searchQuery) ||
        t.categ.toLowerCase().includes(searchQuery)
      );
    });

    return filtered;
  }

  const filteredIds = new Set(
    applyFilters(_unfiltered, myFilters).map((t) => t.id)
  );
  const unfiltered = _unfiltered.map((t) => ({
    ...t,
    ignored: !filteredIds.has(t.id),
  }));
  const current = applyFilters(unfiltered, [currentFilter]);
  const filtered = unfiltered.filter((t) => filteredIds.has(t.id));
  const currentFiltered = applyFilters(current, myFilters);
  console.log({ unfiltered, filtered, current });

  return {
    setCategory,
    unfiltered,
    current,
    filtered,
    currentFiltered,
    setUnfiltered,
    setOpenFiles,
    ignore,
    select,
  };
}

export default useTransactions;
