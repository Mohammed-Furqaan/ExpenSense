import { ITransaction } from "../models/Transaction";

export interface BudgetStatus {
  exceeded: boolean;
  spent: number;
}

export function computeBudgetStatus(
  transactions: ITransaction[],
  newAmount: number,
  limit: number,
): BudgetStatus {
  const now = new Date();
  const currentMonthTotal = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
  const spent = currentMonthTotal + newAmount;
  return { exceeded: spent >= limit, spent };
}
