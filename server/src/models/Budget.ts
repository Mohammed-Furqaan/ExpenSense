import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true, min: 0.01 },
  },
  { timestamps: true },
);

BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export default mongoose.model<IBudget>("Budget", BudgetSchema);
