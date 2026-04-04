import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
}

type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user: User } }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  token: localStorage.getItem("expensense_token"),
  user: (() => {
    try {
      const u = localStorage.getItem("expensense_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("expensense_token", action.payload.token);
      localStorage.setItem(
        "expensense_user",
        JSON.stringify(action.payload.user),
      );
      return { token: action.payload.token, user: action.payload.user };
    case "LOGOUT":
      localStorage.removeItem("expensense_token");
      localStorage.removeItem("expensense_user");
      return { token: null, user: null };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
