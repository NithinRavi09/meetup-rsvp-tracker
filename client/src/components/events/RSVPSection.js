"use client";

import { useState } from "react";
import api from "../../lib/api";

export default function RSVPSection({ eventId }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRSVP = async (selectedStatus) => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      await api.post(`/events/${eventId}/rsvp`, {
        status: selectedStatus,
      });

      setStatus(selectedStatus);
      setMessage("Your RSVP has been updated.");
    } catch (error) {
      console.error("Failed to RSVP:", error);

      // Even if server call is mocked or fails during development, update local state
      setStatus(selectedStatus);
      setError(
        error.response?.data?.message ||
          "Failed to update RSVP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getButtonClass = (buttonStatus) => {
    const isSelected =
      status.toLowerCase() === buttonStatus.toLowerCase();

    const baseClass =
      "w-full p-3.5 rounded-lg flex items-center gap-3 transition-all cursor-pointer font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed";

    if (isSelected) {
      if (buttonStatus === "going") {
        return `${baseClass} border-2 border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs`;
      }
      if (buttonStatus === "maybe") {
        return `${baseClass} border-2 border-amber-500 bg-amber-50/70 text-amber-800 shadow-2xs`;
      }
      if (buttonStatus === "declined") {
        return `${baseClass} border-2 border-slate-500 bg-slate-100 text-slate-800 shadow-2xs`;
      }
    }

    return `${baseClass} border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Your RSVP</h2>

      <div className="space-y-3">
        {/* Going Option */}
        <button
          type="button"
          onClick={() => handleRSVP("going")}
          disabled={loading}
          className={getButtonClass("going")}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              status.toLowerCase() === "going"
                ? "bg-blue-600 text-white"
                : "border border-slate-300 text-slate-400"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span>Going</span>
        </button>

        {/* Maybe Option */}
        <button
          type="button"
          onClick={() => handleRSVP("maybe")}
          disabled={loading}
          className={getButtonClass("maybe")}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              status.toLowerCase() === "maybe"
                ? "bg-amber-500 text-white"
                : "border border-slate-300 text-slate-400"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093V14"
              />
            </svg>
          </div>
          <span>Maybe</span>
        </button>

        {/* Declined Option */}
        <button
          type="button"
          onClick={() => handleRSVP("declined")}
          disabled={loading}
          className={getButtonClass("declined")}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              status.toLowerCase() === "declined"
                ? "bg-slate-600 text-white"
                : "border border-slate-300 text-slate-400"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <span>Declined</span>
        </button>
      </div>

      {message && (
        <p className="text-xs text-emerald-600 font-medium pt-1">
          {message}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium pt-1">{error}</p>
      )}
    </div>
  );
}