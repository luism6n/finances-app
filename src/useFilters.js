import moment from "moment";
import { useState } from "react";

export default function useFilters(transactions, initialFilter) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter);
  const [myFilters, _setMyFilters] = useState(
    (JSON.parse(window.localStorage.getItem("myFilters")) || []).map((f) => {
      return {
        ...f,
        minDate: moment(f.minDate, moment.defaultFormatUtc),
        maxDate: moment(f.maxDate, moment.defaultFormatUtc),
      };
    })
  );

  function filter(transactions) {
    const filtered = transactions
      .filter(
        (t) =>
          t.memo.toLowerCase().includes(currentFilter.text) ||
          t.categ.toLowerCase().includes(currentFilter.text)
      )
      .filter((t) => t.date >= currentFilter.minDate)
      .filter((t) => t.date <= currentFilter.maxDate);

    return filtered;
  }

  const current = filter(transactions);
  const filtered = transactions.filter((t) => !t.ignored);
  const currentFiltered = current.filter((t) => !t.ignored);

  function setMyFilters(fs) {
    window.localStorage.setItem("myFilters", JSON.stringify(fs));
    _setMyFilters(fs);
  }

  function saveFilter(f) {
    setMyFilters([...myFilters, f]);
  }

  return {
    filtered,
    current,
    currentFilter,
    setCurrentFilter,
    currentFiltered,
    myFilters,
    saveFilter,
  };
}
