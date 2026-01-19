'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { meApi } from "./api";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !loading && user !== null;

  // Login with token only
  const login = async (token: string) => {
    try {
      localStorage.setItem("token", token);

      // fetch user profile
      const profile = await meApi(token);
      setUser(profile);
    } catch (err) {
      console.error("Login failed:", err);
      logout(); // clear invalid token
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await meApi(token);
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch user on init:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
