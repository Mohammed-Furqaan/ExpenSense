import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Navbar } from "../components/Navbar";
import { CardSkeleton, ChartSkeleton } from "../components/LoadingSkeleton";
import { transactionService } from "../services/transaction.service";
import { Transaction } from "../types";
import { computePercentageChange } from "../helpers/analytics";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
  },
  labelStyle: { color: "#94a3b8" },
  itemStyle: { color: "#e2e8f0" },
};

function getMonthTotals(
  transactions: Transaction[],
  year: number,
  month: number,
) {
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return { income, expenses, savings: income - expenses };
}

export function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  useEffect(() => {
    transactionService
      .getAll()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const current = getMonthTotals(transactions, selectedYear, selectedMonth);
  const prevDate = new Date(selectedYear, selectedMonth - 1, 1);
  const prev = getMonthTotals(
    transactions,
    prevDate.getFullYear(),
    prevDate.getMonth(),
  );

  const expenseChange = computePercentageChange(
    current.expenses,
    prev.expenses,
  );
  const incomeChange = computePercentageChange(current.income, prev.income);
  const savingsChange = computePercentageChange(current.savings, prev.savings);

  const comparisonData = [
    { label: "Income", current: current.income, previous: prev.income },
    { label: "Expenses", current: current.expenses, previous: prev.expenses },
    { label: "Savings", current: current.savings, previous: prev.savings },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const selectedLabel = `${months[selectedMonth]} ${selectedYear}`;
  const prevLabel = `${months[prevDate.getMonth()]} ${prevDate.getFullYear()}`;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Monthly Analytics
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Compare your financial performance month over month
            </p>
          </div>
          {/* Month selector */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="input-field text-sm py-2 w-32"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field text-sm py-2 w-24"
            >
              {[...Array(5)].map((_, i) => {
                const y = now.getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Current month stats */}
        <div>
          <p className="text-slate-400 text-sm mb-3">{selectedLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                {[
                  {
                    label: "Income",
                    value: current.income,
                    change: incomeChange,
                    color: "emerald",
                  },
                  {
                    label: "Expenses",
                    value: current.expenses,
                    change: expenseChange,
                    color: "red",
                  },
                  {
                    label: "Savings",
                    value: current.savings,
                    change: savingsChange,
                    color: "cyan",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6"
                  >
                    <p className="text-slate-400 text-sm mb-1">{item.label}</p>
                    <p
                      className={`text-3xl font-bold ${item.color === "emerald" ? "text-emerald-400" : item.color === "red" ? "text-red-400" : "text-cyan-400"}`}
                    >
                      ₹{item.value.toFixed(2)}
                    </p>
                    {item.change !== 0 && (
                      <p
                        className={`text-xs mt-2 ${item.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                        vs {prevLabel}
                      </p>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Previous month stats */}
        <div>
          <p className="text-slate-400 text-sm mb-3">{prevLabel} (previous)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                {[
                  { label: "Income", value: prev.income },
                  { label: "Expenses", value: prev.expenses },
                  { label: "Savings", value: prev.savings },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card p-5 opacity-70"
                  >
                    <p className="text-slate-500 text-sm mb-1">{item.label}</p>
                    <p className="text-2xl font-semibold text-slate-300">
                      ₹{item.value.toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Comparison chart */}
        {loading ? (
          <ChartSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-slate-200 font-semibold mb-4">
              Month Comparison
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Bar
                  dataKey="current"
                  name={selectedLabel}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="previous"
                  name={prevLabel}
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </main>
    </div>
  );
}
