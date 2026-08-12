"use client";

import { createContext, useEffect, useState } from "react";
import {
  getToken,
  saveToken,
  removeToken,
  getUser,
  saveUser,
  removeUser,
} from "../lib/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Important: start with true because we don't know the auth
  // state until the browser checks localStorage.
  const [loading, setLoading] = useState(true);

  // Read authentication data AFTER the component mounts
  useEffect(() => {
    queueMicrotask(() => {
      const storedToken = getToken();
      const storedUser = getUser();

      setToken(storedToken);
      setUser(storedUser);
      setLoading(false);
    });
  }, []);

  const login = (newToken, newUser) => {
    saveToken(newToken);
    saveUser(newUser);

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    removeUser();

    setToken(null);
    setUser(null);
  };

  // Handle unauthorized API responses
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Automatically logout when JWT expires
  useEffect(() => {
    if (!token) return;

    try {
      const payloadBase64 = token.split(".")[1];

      if (!payloadBase64) {
        queueMicrotask(logout);
        return;
      }

      const base64 = payloadBase64
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const decoded = JSON.parse(atob(base64));

      if (decoded?.exp) {
        const timeUntilExpiry = decoded.exp * 1000 - Date.now();

        if (timeUntilExpiry <= 0) {
          queueMicrotask(logout);
          return;
        }

        const timer = setTimeout(() => {
          logout();
        }, timeUntilExpiry);

        return () => clearTimeout(timer);
      }
    } catch {
      queueMicrotask(logout);
    }
  }, [token]);


  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
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
