"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import {
  getToken,
  saveToken,
  removeToken,
  getUser,
  saveUser,
  removeUser,
} from "../lib/auth";

/**
 * Context object providing global authentication state and authentication methods.
 */
export const AuthContext = createContext(null);

/**
 * Provider component managing token state, user profile, token expiry timers, and unauthorized API interceptor events.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Initialized to true to prevent premature redirects before checking localStorage on client mount
  const [loading, setLoading] = useState(true);

  // Synchronizes authentication state from localStorage after initial client hydration
  useEffect(() => {
    queueMicrotask(() => {
      const storedToken = getToken();
      const storedUser = getUser();

      setToken(storedToken);
      setUser(storedUser);
      setLoading(false);
    });
  }, []);

  /**
   * Persists authentication token and user data to storage and updates state.
   */
  const login = useCallback((newToken, newUser) => {
    saveToken(newToken);
    saveUser(newUser);

    setToken(newToken);
    setUser(newUser);
  }, []);

  /**
   * Clears stored token and user profile and resets authentication state.
   */
  const logout = useCallback(() => {
    removeToken();
    removeUser();

    setToken(null);
    setUser(null);
  }, []);

  // Listens for custom 'auth:unauthorized' events dispatched by api.js when a 401 response occurs
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  // Schedules an automatic logout timer based on JWT token 'exp' expiration claim
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
  }, [token, logout]);

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
