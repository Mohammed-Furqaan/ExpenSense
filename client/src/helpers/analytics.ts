import { Transaction } from "../types";

export function aggregateMonthlyTotals(transactions: Transaction[]) {
  const now = new Date();
  const current = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  });
  const income = current
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = current
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function last6Months(transactions: Transaction[]) {
  const now = new Date();
  const months: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    const filtered = transactions.filter((t) => {
      const td = new Date(t.date);
      return (
        td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth()
      );
    });
    months.push({
      month: label,
      income: filtered
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
      expense: filtered
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    });
  }
  return months;
}

export function groupByCategory(transactions: Transaction[]) {
  const now = new Date();
  const expenses = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "expense" &&
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  });
  const map: Record<string, number> = {};
  expenses.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function computePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}
