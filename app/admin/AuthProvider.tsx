'use client';

import { createContext, useContext, useEffect, useState } from "react";

import {
  checkCredentials,
  clearSession,
  readSession,
  saveSession,
  type AuthUser,
} from "@/lib/auth";

// What every admin page can ask for
interface AuthContextValue {
  user: AuthUser | null; // the logged-in user, or null
  loading: boolean; // true until we have checked the browser for a saved login
  login: (username: string, password: string) => boolean; // true if it worked
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Wraps the whole admin area. It remembers who is logged in.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // When the page opens, look for a saved login
  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const found = checkCredentials(username, password);
    if (!found) return false;

    saveSession(found);
    setUser(found);
    return true;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Any admin component calls this to get the user, login and logout
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}