import { useState } from "react";

export default function useFilters(transactions, initialFilter) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter);
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
  let filtered = transactions.filter((t) => !t.ignored);

  return {
    filtered,
    current,
    currentFilter,
    setCurrentFilter,
  };
}
