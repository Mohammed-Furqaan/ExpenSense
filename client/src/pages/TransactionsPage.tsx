import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { TransactionForm } from "../components/TransactionForm";
import { TableRowSkeleton } from "../components/LoadingSkeleton";
import { transactionService } from "../services/transaction.service";
import { Transaction, CreateTransactionData } from "../types";
import { useToast } from "../hooks/useToast";

const CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const toast = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getAll({
        type: filterType || undefined,
        category: filterCategory || undefined,
        startDate: filterStart || undefined,
        endDate: filterEnd || undefined,
      });
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory, filterStart, filterEnd]);

  const handleCreate = async (data: CreateTransactionData) => {
    const res = await transactionService.create(data);
    toast.success("Transaction added");
    if (res.budgetExceeded) {
      toast.warning(
        `⚠️ Budget exceeded for ${res.budgetExceeded.category}! Spent ₹${res.budgetExceeded.spent.toFixed(2)} of ₹${res.budgetExceeded.limit.toFixed(2)}`,
      );
    }
    fetchTransactions();
  };

  const handleUpdate = async (data: CreateTransactionData) => {
    if (!editing) return;
    await transactionService.update(editing._id, data);
    toast.success("Transaction updated");
    setEditing(null);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await transactionService.delete(id);
    toast.success("Transaction deleted");
    fetchTransactions();
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setFormOpen(true);
  };
  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Transactions</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your income and expenses
            </p>
          </div>
          <button
            onClick={openCreate}
            className="btn-primary whitespace-nowrap"
          >
            + Add Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field text-sm py-2"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field text-sm py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === "All" ? "" : c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            className="input-field text-sm py-2"
            placeholder="Start date"
          />
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            className="input-field text-sm py-2"
            placeholder="End date"
          />
        </div>

        {/* Transaction list */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="divide-y divide-slate-700/50">
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <svg
                className="w-12 h-12 mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {transactions.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-700/20 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"}`}
                  >
                    <span
                      className={`text-lg ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {t.type === "income" ? "↑" : "↓"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium truncate">
                      {t.category}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {t.description || new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(t)}
                      className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
      />
    </div>
  );
}
