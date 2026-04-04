import { Router, RequestHandler } from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/authenticate";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController";

const router = Router();

const transactionValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
];

router.get(
  "/",
  authenticate as RequestHandler,
  getTransactions as RequestHandler,
);
router.post(
  "/",
  authenticate as RequestHandler,
  transactionValidation,
  createTransaction as RequestHandler,
);
router.put(
  "/:id",
  authenticate as RequestHandler,
  transactionValidation,
  updateTransaction as RequestHandler,
);
router.delete(
  "/:id",
  authenticate as RequestHandler,
  deleteTransaction as RequestHandler,
);

export default router;
