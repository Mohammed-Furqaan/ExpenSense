import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://mohammedfurqaan999_db_user:oTt88veeqm4zuWOw@cluster0.jka08ni.mongodb.net/expensense?retryWrites=true&w=majority&appName=Cluster0";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "expensense_jwt_secret_2024";
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
