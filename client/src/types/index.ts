export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description?: string;
}

export interface BudgetExceeded {
  category: string;
  limit: number;
  spent: number;
}

export interface CreateTransactionResponse {
  transaction: Transaction;
  budgetExceeded?: BudgetExceeded;
}

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  limit: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}
