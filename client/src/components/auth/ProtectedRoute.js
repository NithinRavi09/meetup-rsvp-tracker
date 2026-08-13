"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import Loading from "../ui/Loading";

/**
 * Route guard component that protects client-side pages.
 * Redirects unauthenticated users to '/login' after auth state finishes loading.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated after initial auth check completes
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, loading, router]);

  // Display loading indicator while checking auth status or during redirect
  if (loading || !isLoggedIn) {
    return <Loading message="Checking authentication..." />;
  }

  return children;
}
