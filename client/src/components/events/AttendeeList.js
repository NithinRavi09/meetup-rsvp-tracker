"use client";

import { Users } from "lucide-react";

/**
 * Component rendering the list of meetup attendees with status badges and initials avatars.
 */
export default function AttendeeList({ attendees = [], loading = false }) {
  const displayList = Array.isArray(attendees) ? attendees : [];

  /**
   * Generates uppercase 1-2 letter initials from a display name.
   */
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  /**
   * Returns styled status badge pills for GOING, MAYBE, or DECLINED status.
   */
  const getStatusBadge = (status) => {
    const s = (status || "GOING").toUpperCase();
    if (s === "GOING") {
      return (
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          GOING
        </span>
      );
    }
    if (s === "MAYBE") {
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          MAYBE
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        DECLINED
      </span>
    );
  };

  /**
   * Deterministic avatar background color based on list index.
   */
  const getAvatarBg = (index) => {
    const colors = [
      "bg-blue-600",
      "bg-slate-400",
      "bg-amber-700",
      "bg-emerald-600",
      "bg-indigo-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded w-full"></div>
          <div className="h-10 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900">
        Attendees ({displayList.length})
      </h2>

      {displayList.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            No attendees yet
          </p>
          <p className="text-xs text-slate-500">
            Be the first to RSVP for this meetup.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {displayList.map((attendee, index) => {
            const displayName =
              attendee.name ||
              attendee.user_name ||
              attendee.username ||
              attendee.email ||
              "Anonymous";

            return (
              <div
                key={attendee.id || attendee.user_id || index}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-full ${
                      attendee.color || getAvatarBg(index)
                    } text-white font-bold text-xs flex items-center justify-center shadow-2xs`}
                  >
                    {attendee.initials || getInitials(displayName)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {displayName}
                  </span>
                </div>

                {getStatusBadge(attendee.status)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}