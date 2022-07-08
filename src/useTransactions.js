import moment from "moment";
import { useState } from "react";
import * as d3 from "d3";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

function useTransactions(currentFilter, myFilters, searchQuery) {
  const [openFiles, setOpenFiles] = useState([]);
  const [transactions, _setTransactions] = useState(() =>
    (
      JSON.parse(window.localStorage.getItem("transactions")) ||
      generateABunchOfTransactions(2000)
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

function generateABunchOfTransactions(num) {
  function choice(array) {
    return array[d3.randomInt(array.length)()];
  }

  let date = moment();

  let categs = [];
  for (let i = 0; i < 10; i++) {
    let memos = [];
    for (let i = 0; i < 10; i++) {
      memos.push(faker.company.companyName());
    }
    categs.push({ name: faker.commerce.department(), memos: memos });
  }

  const transactions = [];
  const randNormal = d3.randomNormal(5, 2);

  let numTransactions = 0;
  while (numTransactions < num) {
    let forToday = d3.max([0, Math.floor(randNormal())]);
    for (let i = 0; i < forToday; i++) {
      let categ = choice(categs);
      transactions.push({
        id: nanoid(),
        memo: choice(categ.memos),
        categ: categ.name,
        amount: -faker.finance.amount(),
        date: date.format(moment.defaultFormatUtc),
        ignored: false,
        sequence: numTransactions,
        fileId: "<fileId>",
        fileName: "myBankExport.ofx",
      });
      numTransactions++;
    }
    date.add(1, "day");
  }

  return transactions;
}

export default useTransactions;
