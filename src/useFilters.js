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

  function applyFilters(transactions, filters) {
    let filtered = transactions;
    for (let f of filters) {
      if (!f.enabled) {
        continue;
      }

      console.log({ f, filtered });
      filtered = filtered
        .filter(
          (t) =>
            t.memo.toLowerCase().includes(f.text) ||
            t.categ.toLowerCase().includes(f.text)
        )
        .filter((t) => t.date >= f.minDate)
        .filter((t) => t.date <= f.maxDate);
    }

    return filtered;
  }

  const current = applyFilters(transactions, [currentFilter]);
  const filtered = applyFilters(transactions, myFilters);
  const currentFiltered = applyFilters(current, myFilters);

  function setMyFilters(fs) {
    window.localStorage.setItem("myFilters", JSON.stringify(fs));
    _setMyFilters(fs);
  }

  function saveFilter(f) {
    setMyFilters([...myFilters, f]);
  }

  function toggleFilter(f) {
    setMyFilters(
      myFilters.map((ff) =>
        ff.id !== f.id ? ff : { ...f, enabled: !f.enabled }
      )
    );
  }

  return {
    filtered,
    current,
    currentFilter,
    setCurrentFilter,
    currentFiltered,
    myFilters,
    saveFilter,
    toggleFilter,
  };
}
