import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Navbar } from "../components/Navbar";
import { CardSkeleton, ChartSkeleton } from "../components/LoadingSkeleton";
import { BudgetCard } from "../components/BudgetCard";
import { transactionService } from "../services/transaction.service";
import { budgetService } from "../services/budget.service";
import { Transaction, Budget } from "../types";
import {
  aggregateMonthlyTotals,
  last6Months,
  groupByCategory,
  computePercentageChange,
} from "../helpers/analytics";

const PIE_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
  },
  labelStyle: { color: "#94a3b8" },
  itemStyle: { color: "#e2e8f0" },
};

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  color: "emerald" | "red" | "cyan";
  index: number;
}

function StatCard({ label, value, change, color, index }: StatCardProps) {
  const colorMap = {
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  };
  const c = colorMap[color];
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`glass-card p-6 border ${c.border} ${c.bg}`}
    >
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
      {change !== 0 && (
        <p
          className={`text-xs mt-2 ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
        >
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs last month
        </p>
      )}
    </motion.div>
  );
}

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([transactionService.getAll(), budgetService.getAll()])
      .then(([txns, bdgs]) => {
        setTransactions(txns);
        setBudgets(bdgs);
      })
      .finally(() => setLoading(false));
  }, []);

  const { income, expenses, balance } = aggregateMonthlyTotals(transactions);
  const trendData = last6Months(transactions);
  const categoryData = groupByCategory(transactions);

  const prevMonth = (() => {
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === prev.getFullYear() &&
        d.getMonth() === prev.getMonth()
      );
    });
    const inc = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { income: inc, expenses: exp, balance: inc - exp };
  })();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Your financial overview for this month
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                index={0}
                label="Total Income"
                value={`₹${income.toFixed(2)}`}
                change={computePercentageChange(income, prevMonth.income)}
                color="emerald"
              />
              <StatCard
                index={1}
                label="Total Expenses"
                value={`₹${expenses.toFixed(2)}`}
                change={computePercentageChange(expenses, prevMonth.expenses)}
                color="red"
              />
              <StatCard
                index={2}
                label="Balance"
                value={`₹${balance.toFixed(2)}`}
                change={computePercentageChange(balance, prevMonth.balance)}
                color="cyan"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="text-slate-200 font-semibold mb-4">
                  6-Month Trend
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip {...tooltipStyle} />
                    <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <h2 className="text-slate-200 font-semibold mb-4">
                  Expenses by Category
                </h2>
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-[220px] text-slate-500 text-sm">
                    No expense data this month
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        {...tooltipStyle}
                        formatter={(v: number) => `₹${v.toFixed(2)}`}
                      />
                      <Legend
                        wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </>
          )}
        </div>

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
              Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {budgets.length > 0 && (
          <div>
            <h2 className="text-slate-200 font-semibold mb-4">
              Budget Tracker
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget, i) => (
                <motion.div
                  key={budget._id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <BudgetCard budget={budget} transactions={transactions} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
