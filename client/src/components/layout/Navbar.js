"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";

/**
 * Top navigation header bar displaying brand logo, navigation links, user profile avatar, and logout action.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  /**
   * Logs out user and redirects to login page.
   */
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Links */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <Link
            href="/events"
            className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight hover:opacity-90 transition-opacity"
          >
            Local Meetup
          </Link>
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/events"
              className={`text-sm font-semibold transition-colors relative py-5 ${
                pathname.startsWith("/events")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Events
            </Link>
          </nav>
        </div>

        {/* Right: Profile & Auth Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2.5">
                <Image
                  src="/images/user.png"
                  alt={user?.name || "User Avatar"}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <span className="text-sm font-semibold text-slate-800 hidden sm:inline-block">
                  {user?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Logout
                <LogOut className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
