import moment from "moment";
import { useState } from "react";
import * as d3 from "d3";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { Transaction } from "./types";

function useTransactions() {
  const [transactions, _setTransactions] = useState<Transaction[]>(() => {
    let storedTransactions = window.localStorage.getItem("transactions");
    if (!storedTransactions) {
      return generateABunchOfTransactions(1000);
    }

    return JSON.parse(storedTransactions).map((t: any) => ({
      ...t,
      date: moment(t.date),
    }));
  });

  function setTransactions(
    t: Transaction[] | ((t: Transaction[]) => Transaction[])
  ) {
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

  function replaceInUnfiltered(newTransactions: Transaction[]) {
    const newIgnoredIds = new Set(newTransactions.map((t) => t.id));

    setTransactions((u) => [
      ...u.filter((tt) => !newIgnoredIds.has(tt.id)),
      ...newTransactions,
    ]);
  }

  function makeArray<T>(x: T | T[]): T[] {
    if (!Array.isArray(x)) {
      return [x];
    }

    return x;
  }

  function setCategory(t: Transaction | Transaction[], categ: string) {
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
  };
}

function generateABunchOfTransactions(num: number): Transaction[] {
  function choice<T>(array: T[]): T {
    return array[d3.randomInt(array.length)()];
  }

  let date = moment();

  let categs: { name: string; memos: string[] }[] = [
    { name: "?", memos: ["Monster Inc.", "ACME"] },
  ];
  for (let i = 0; i < 10; i++) {
    let memos: string[] = [];
    for (let i = 0; i < 10; i++) {
      memos.push(faker.company.companyName());
    }
    categs.push({ name: faker.commerce.department(), memos: memos });
  }

  const transactions: Transaction[] = [];
  const randNormal = d3.randomNormal(5, 2);

  let numTransactions = 0;
  while (numTransactions < num) {
    let forToday = d3.max([0, Math.floor(randNormal())])!;
    for (let i = 0; i < forToday; i++) {
      let categ = choice(categs);
      transactions.push({
        id: nanoid(),
        description: choice(categ.memos),
        categ: categ.name,
        amount: Number.parseFloat(faker.finance.amount(-1000, 1500)),
        date: date.clone(),
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
