import api from "./api";
import { Budget } from "../types";

export const budgetService = {
  getAll: () => api.get<Budget[]>("/api/budget").then((r) => r.data),
  create: (data: { category: string; limit: number }) =>
    api.post<Budget>("/api/budget", data).then((r) => r.data),
  update: (id: string, data: { category: string; limit: number }) =>
    api.put<Budget>(`/api/budget/${id}`, data).then((r) => r.data),
};
