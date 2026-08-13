"use client";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom React hook to access AuthContext authentication state and helpers.
 * Throws a descriptive error if called outside of an AuthProvider ancestor.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default useAuth;