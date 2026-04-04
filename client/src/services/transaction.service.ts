import api from "./api";
import {
  Transaction,
  CreateTransactionData,
  CreateTransactionResponse,
  TransactionFilters,
} from "../types";

export const transactionService = {
  getAll: (filters?: TransactionFilters) =>
    api
      .get<Transaction[]>("/api/transactions", { params: filters })
      .then((r) => r.data),
  create: (data: CreateTransactionData) =>
    api
      .post<CreateTransactionResponse>("/api/transactions", data)
      .then((r) => r.data),
  update: (id: string, data: CreateTransactionData) =>
    api.put<Transaction>(`/api/transactions/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/api/transactions/${id}`).then((r) => r.data),
};
