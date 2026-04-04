import { Router, RequestHandler } from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/authenticate";
import {
  createBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budgetController";

const router = Router();

const budgetValidation = [
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("limit")
    .isFloat({ min: 0.01 })
    .withMessage("Limit must be a positive number"),
];

router.get("/", authenticate as RequestHandler, getBudgets as RequestHandler);
router.post(
  "/",
  authenticate as RequestHandler,
  budgetValidation,
  createBudget as RequestHandler,
);
router.put(
  "/:id",
  authenticate as RequestHandler,
  budgetValidation,
  updateBudget as RequestHandler,
);

export default router;
