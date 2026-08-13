"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";

/**
 * Responsive search and sort control bar for filtering meetups by title/location and sorting by date.
 */
export default function EventSearchFilter({
  searchTerm = "",
  onSearchChange,
  sortOption = "soonest",
  onSortChange,
}) {
  return (
    <div className="rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events by title or location..."
          className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <label
          htmlFor="sort-select"
          className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          Filter by:
        </label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white block px-3 py-2 cursor-pointer font-medium outline-none transition-colors"
        >
          <option value="soonest">Soonest first</option>
          <option value="latest">Latest first</option>
        </select>
      </div>
    </div>
  );
}
