import { Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Transaction from "../models/Transaction";
import Budget from "../models/Budget";
import { computeBudgetStatus } from "../helpers/budgetHelper";
import {
  filterTransactions,
  TransactionFilters,
} from "../helpers/filterHelper";
import { AuthRequest } from "../middleware/authenticate";

export async function createTransaction(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({
        errors: errors
          .array()
          .map((e) => ({ field: (e as any).path, message: e.msg })),
      });
    return;
  }

  const { amount, type, category, date, description } = req.body;
  const userId = req.user!.id;

  const transaction = await Transaction.create({
    userId,
    amount,
    type,
    category,
    date,
    description,
  });

  let budgetExceeded:
    | { category: string; limit: number; spent: number }
    | undefined;

  if (type === "expense") {
    const budget = await Budget.findOne({
      userId,
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });
    if (budget) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const existingTransactions = await Transaction.find({
        userId,
        type: "expense",
        category: { $regex: new RegExp(`^${category}$`, "i") },
        date: { $gte: startOfMonth, $lte: endOfMonth },
        _id: { $ne: transaction._id },
      });
      const status = computeBudgetStatus(
        existingTransactions,
        amount,
        budget.limit,
      );
      if (status.exceeded) {
        budgetExceeded = { category, limit: budget.limit, spent: status.spent };
      }
    }
  }

  res
    .status(201)
    .json({ transaction, ...(budgetExceeded ? { budgetExceeded } : {}) });
}

export async function getTransactions(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const { type, category, startDate, endDate } =
    req.query as TransactionFilters;
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });
  const filtered = filterTransactions(transactions, {
    type,
    category,
    startDate,
    endDate,
  });
  res.json(filtered);
}

export async function updateTransaction(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({
        errors: errors
          .array()
          .map((e) => ({ field: (e as any).path, message: e.msg })),
      });
    return;
  }

  const { id } = req.params;
  const userId = req.user!.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (transaction.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { amount, type, category, date, description } = req.body;
  transaction.amount = amount;
  transaction.type = type;
  transaction.category = category;
  transaction.date = date;
  transaction.description = description;
  await transaction.save();
  res.json(transaction);
}

export async function deleteTransaction(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (transaction.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await transaction.deleteOne();
  res.json({ message: "Transaction deleted" });
}
