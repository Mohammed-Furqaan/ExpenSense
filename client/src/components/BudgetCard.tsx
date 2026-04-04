import { Budget, Transaction } from "../types";

interface BudgetCardProps {
  budget: Budget;
  transactions: Transaction[];
}

export function BudgetCard({ budget, transactions }: BudgetCardProps) {
  const now = new Date();
  const spent = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        t.category.toLowerCase() === budget.category.toLowerCase() &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      );
    })
    .reduce((s, t) => s + t.amount, 0);

  const pct = Math.min((spent / budget.limit) * 100, 100);
  const exceeded = spent >= budget.limit;

  return (
    <div
      className={`glass-card p-5 transition-all duration-300 ${exceeded ? "border-red-500/50 bg-red-500/5" : ""}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-slate-400 text-sm">{budget.category}</p>
          <p
            className={`text-lg font-semibold ${exceeded ? "text-red-400" : "text-slate-100"}`}
          >
            ₹{spent.toFixed(2)}{" "}
            <span className="text-slate-500 text-sm font-normal">
              / ₹{budget.limit.toFixed(2)}
            </span>
          </p>
        </div>
        {exceeded && (
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full">
            Exceeded
          </span>
        )}
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${exceeded ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-slate-500 text-xs mt-2">{pct.toFixed(0)}% used</p>
    </div>
  );
}
