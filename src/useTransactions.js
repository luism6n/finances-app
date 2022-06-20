import moment from "moment";

function useTransactions() {
  let mockTransactions = [
    {
      id: "626e4741-144e-4ea4-be0d-1a4ec851c073",
      memo: "a",
      amount: -5,
      date: moment(),
    },
    {
      id: "6275cf18-e75c-459b-a948-6708195b6610",
      memo: "b",
      amount: -10,
      date: moment(),
    },
    {
      id: "6275cf18-e75c-459b-a948-6708195b7321",
      memo: "c",
      amount: -3,
      date: moment(),
    },
    {
      id: "6275cf18-e75c-459b-a948-6708395be33e",
      memo: "d",
      amount: +20,
      date: moment(),
    },
  ];

  return mockTransactions;
}

export default useTransactions;
