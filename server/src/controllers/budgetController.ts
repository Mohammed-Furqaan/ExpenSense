import { Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Budget from "../models/Budget";
import { AuthRequest } from "../middleware/authenticate";

export async function createBudget(
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

  const { category, limit } = req.body;
  const userId = req.user!.id;

  const existing = await Budget.findOne({
    userId,
    category: { $regex: new RegExp(`^${category}$`, "i") },
  });
  if (existing) {
    res
      .status(409)
      .json({ message: `Budget for category "${category}" already exists` });
    return;
  }

  const budget = await Budget.create({ userId, category, limit });
  res.status(201).json(budget);
}

export async function getBudgets(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const budgets = await Budget.find({ userId });
  res.json(budgets);
}

export async function updateBudget(
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

  const budget = await Budget.findById(id);
  if (!budget) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (budget.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  budget.limit = req.body.limit;
  await budget.save();
  res.json(budget);
}
