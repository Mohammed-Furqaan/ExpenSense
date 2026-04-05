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
      .get<Transaction[]>("/transactions", { params: filters })
      .then((r) => r.data),
  create: (data: CreateTransactionData) =>
    api
      .post<CreateTransactionResponse>("/transactions", data)
      .then((r) => r.data),
  update: (id: string, data: CreateTransactionData) =>
    api.put<Transaction>(`/transactions/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/transactions/${id}`).then((r) => r.data),
};
