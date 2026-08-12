"use client";

import { createContext, useState, useEffect } from "react";
import {
  getToken,
  saveToken,
  removeToken,
  isTokenExpired,
} from "../lib/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return getToken();
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = (newToken) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    removeToken();
    setToken(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handleUnauthorized);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:unauthorized", handleUnauthorized);
      }
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(base64));
        if (decoded && decoded.exp) {
          const timeUntilExpiry = decoded.exp * 1000 - Date.now();
          const delay = Math.max(0, timeUntilExpiry);
          const timer = setTimeout(() => {
            logout();
          }, delay);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      const timer = setTimeout(() => {
        logout();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};