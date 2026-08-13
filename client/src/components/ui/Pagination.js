"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Dynamic pagination component displaying a maximum 3-page sliding window with bounds-safe controls.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Hide pagination controls if there are zero matching pages
  if (totalPages <= 0) return null;

  let startPage = 1;
  let endPage = 1;

  // Calculates a maximum 3-page visible window centered dynamically around the active page
  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  const pages = [];

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4 cursor-pointer" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full text-sm font-semibold cursor-pointer ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  );
}