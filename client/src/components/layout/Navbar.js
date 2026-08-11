"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/events"
            className="text-xl font-extrabold text-blue-600 tracking-tight hover:opacity-90 transition-opacity"
          >
            Local Meetup
          </Link>
          <nav className="flex items-center space-x-6">
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
        <div className="flex items-center space-x-5">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2.5">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Johnson"
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <span className="text-sm font-semibold text-slate-800 hidden sm:inline-block">
                  Alex Johnson
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Logout
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
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
