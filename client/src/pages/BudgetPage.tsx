import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { BudgetCard } from "../components/BudgetCard";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { budgetService } from "../services/budget.service";
import { transactionService } from "../services/transaction.service";
import { Budget, Transaction } from "../types";
import { useToast } from "../hooks/useToast";

const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState("");
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, t] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll(),
      ]);
      setBudgets(b);
      setTransactions(t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await budgetService.create({ category, limit: parseFloat(limit) });
      toast.success(`Budget set for ${category}`);
      setLimit("");
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create budget";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const budget = budgets.find((b) => b._id === id);
      if (!budget) return;
      await budgetService.update(id, {
        category: budget.category,
        limit: parseFloat(editLimit),
      });
      toast.success("Budget updated");
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update budget");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Budget Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Set spending limits per category
          </p>
        </div>

        {/* Create budget form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-slate-200 font-semibold mb-4">Set New Budget</h2>
          <form
            onSubmit={handleCreate}
            className="flex flex-col sm:flex-row gap-3"
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field sm:w-48"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="input-field sm:w-40"
              placeholder="Limit ($)"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary whitespace-nowrap"
            >
              {submitting ? "Setting..." : "Set Budget"}
            </button>
          </form>
          {formError && (
            <p className="text-red-400 text-sm mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {formError}
            </p>
          )}
        </motion.div>

        {/* Budget cards */}
        <div>
          <h2 className="text-slate-200 font-semibold mb-4">Your Budgets</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : budgets.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center py-16 text-slate-500">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No budgets set yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget, i) => (
                <motion.div
                  key={budget._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="space-y-2"
                >
                  <BudgetCard budget={budget} transactions={transactions} />
                  {editingId === budget._id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="input-field text-sm py-2 flex-1"
                        placeholder="New limit"
                      />
                      <button
                        onClick={() => handleUpdate(budget._id)}
                        className="btn-primary text-sm px-3 py-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-secondary text-sm px-3 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(budget._id);
                        setEditLimit(String(budget.limit));
                      }}
                      className="w-full text-center text-slate-500 hover:text-cyan-400 text-xs transition-colors py-1"
                    >
                      Edit limit
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
