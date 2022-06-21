import moment from "moment";
import { useState } from "react";

function useTransactions() {
  const [transactions, _setTransactions] = useState(
    (
      JSON.parse(window.localStorage.getItem("transactions")) || [
        {
          id: "626e4741-144e-4ea4-be0d-1a4ec851c073",
          memo: "a",
          amount: -5,
          date: "2022-01-01",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708195b6610",
          memo: "b",
          amount: -10,
          date: "2022-01-02",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708195b7321",
          memo: "c",
          amount: -3,
          date: "2022-01-03",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708395be33e",
          memo: "d",
          amount: +20,
          date: "2022-01-03",
        },
        {
          id: "626e4741-144e-4ea4-be0d-1a4ece51c073",
          memo: "a",
          amount: -10,
          date: "2022-02-03",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708195be610",
          memo: "b",
          amount: +10,
          date: "2022-02-01",
        },
        {
          id: "6275cf18-e75c-459b-a948-670839abe33e",
          memo: "d",
          amount: +20,
          date: "2022-02-04",
        },
        {
          id: "6275cf18-e75c-459b-a948-6708195b7d21",
          memo: "c",
          amount: -4,
          date: "2022-03-03",
        },
      ]
    ).map((t) => {
      return { ...t, date: moment(t.date) };
    })
  );

  function setTransactions(t) {
    window.localStorage.setItem("transactions", JSON.stringify(t));
    _setTransactions(t);
  }

  return { transactions, setTransactions };
}

export default useTransactions;
