import moment from "moment";
import { useState } from "react";
import { Filter } from "./types";

export default function useFilters() {
  const [myFilters, _setMyFilters] = useState<Filter[]>(
    JSON.parse(window.localStorage.getItem("myFilters") || '""') || exampleFilters()
  );

  function setMyFilters(fs: Filter[]) {
    window.localStorage.setItem("myFilters", JSON.stringify(fs));
    _setMyFilters(fs);
  }

  function saveFilter(f: Filter) {
    setMyFilters([...myFilters, f]);
  }

  function toggleFilter(f: Filter) {
    setMyFilters(
      myFilters.map((ff) =>
        ff.id !== f.id ? ff : { ...f, enabled: !f.enabled }
      )
    );
  }

  function deleteFilter(f: Filter) {
    setMyFilters(myFilters.filter((ff) => ff.id !== f.id));
  }

  return {
    myFilters,
    saveFilter,
    toggleFilter,
    deleteFilter,
  };
}

function exampleFilters(): Filter[] {
  return [
    {
      query: {
        offsets: [
          {
            keyword: "amount",
            value: ">0",
            offsetStart: 0,
            offsetEnd: 9,
          },
        ],
        amount: [">0"],
        exclude: {},
      },
      enabled: false,
      queryString: "amount:>0",
      name: "income",
      id: "u_v52Agbm-9NMZibfyVA_",
    },
    {
      query: {
        offsets: [
          {
            keyword: "amount",
            value: "<0",
            offsetStart: 0,
            offsetEnd: 9,
          },
        ],
        amount: ["<0"],
        exclude: {},
      },
      enabled: false,
      queryString: "amount:<0",
      name: "expenses",
      id: "7biMSLFd8QjK6wdNgKDS0",
    },
    {
      query: {
        offsets: [
          {
            keyword: "y",
            value: moment().format("YYYY"),
            offsetStart: 0,
            offsetEnd: 6,
          },
        ],
        y: [moment().format("YYYY")],
        exclude: {},
      },
      enabled: true,
      queryString: `y:${moment().format("YYYY")}`,
      name: "this year",
      id: "tW5bL440kLFWcPH647u8t",
    },
    {
      query: {
        offsets: [
          {
            keyword: "amount",
            value: "<-900",
            offsetStart: 0,
            offsetEnd: 12,
          },
        ],
        amount: ["<-900"],
        exclude: {},
      },
      enabled: false,
      queryString: "amount:<-900",
      name: "expensive",
      id: "ZcQKWq5WndSgjGAKlAOwG",
    },
    {
      query: {
        offsets: [
          {
            keyword: "categ",
            value: "shoes",
            offsetStart: 0,
            offsetEnd: 11,
          },
        ],
        categ: ["shoes"],
        exclude: {},
      },
      enabled: false,
      queryString: "categ:shoes",
      name: "shoes",
      id: "9XXHVl-BxrYjB1uBrQZoD",
    },
    {
      query: {
        text: ["! inc"],
        offsets: [
          {
            text: "! inc",
            offsetStart: 0,
            offsetEnd: 5,
          },
        ],
        exclude: {},
      },
      enabled: false,
      queryString: '"! inc"',
      name: "remove inc",
      id: "R7lkui1o9esi2waBz85NQ",
    },
    {
      query: {
        offsets: [
          {
            keyword: "desc",
            value: " inc",
            offsetStart: 0,
            offsetEnd: 11,
          },
        ],
        desc: [" inc"],
        exclude: {},
      },
      enabled: false,
      queryString: 'desc:" inc"',
      name: "only inc",
      id: "ajWaswAZpicMEAq-Fblmn",
    },
  ];
}
