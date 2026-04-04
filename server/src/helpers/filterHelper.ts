import { ITransaction } from "../models/Transaction";

export interface TransactionFilters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export function filterTransactions(
  transactions: ITransaction[],
  filters: TransactionFilters,
): ITransaction[] {
  return transactions.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (
      filters.category &&
      t.category.toLowerCase() !== filters.category.toLowerCase()
    )
      return false;
    if (filters.startDate && new Date(t.date) < new Date(filters.startDate))
      return false;
    if (filters.endDate && new Date(t.date) > new Date(filters.endDate))
      return false;
    return true;
  });
}
