"use client";

import { createContext, useEffect, useState } from "react";
import {
  getToken,
  saveToken,
  removeToken,
} from "../lib/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (newToken) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    removeToken();
    setToken(null);
  };

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