import api from "./api";
import { AuthResponse } from "../types";

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/api/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/api/auth/login", data).then((r) => r.data),
};
