import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import transactionRouter from "./routes/transactionRoutes";
import budgetRouter from "./routes/budgetRoutes";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/budget", budgetRouter);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `Duplicate value for ${field}` });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
