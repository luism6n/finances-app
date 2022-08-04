import moment from "moment"

export interface Filter {
    query: any,
    enabled: boolean,
    queryString: string,
    name: string,
    id: string
}

export const emptyFilter: Filter = {
    query: {},
    queryString: "",
    name: "",
    id: "",
    enabled: true,
}

export interface Transaction {
    id: string,
    date: moment.Moment,
    amount: number,
    description: string,
    sequence: number,
    categ: string,
    fileId: string,
    fileName: string,
    ignored: boolean,
  }