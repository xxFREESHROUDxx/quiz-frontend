import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // On mount only, restore token from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("token");
    if (saved) {
      const { token, user } = JSON.parse(saved);
      setToken(token);
      setUser(user);
    }
    setIsHydrated(true);
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    sessionStorage.setItem("token", JSON.stringify({ token, user }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
  };

  const values = { token, user, login, logout, isHydrated };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
