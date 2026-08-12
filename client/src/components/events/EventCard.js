"use client";

import Link from "next/link";
import { Calendar, MapPin, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function EventCard({ event }) {
  const { isLoggedIn } = useAuth();
  const targetHref = isLoggedIn ? `/events/${event.id}` : "/login";

  // Helper to format date cleanly
  const formatDate = (dateString, endDateString) => {
    if (!dateString) return "Oct 24, 2024 • 6:30 PM - 8:30 PM";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (endDateString) {
        const endDate = new Date(endDateString);
        if (!isNaN(endDate.getTime())) {
          const endTime = endDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          return `${formattedDate} • ${formattedTime} - ${endTime}`;
        }
      }

      return `${formattedDate} • ${formattedTime}`;
    } catch {
      return dateString;
    }
  };

  const organizerName =
    event.organizer_name ||
    event.creator_name ||
    event.organizer ||
    event.created_by_name ||
    "Sarah Jenkins";

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
          {event.title}
        </h2>

        <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {event.description}
        </p>

        <div className="mt-5 space-y-2 text-xs text-slate-500 font-medium">
          {/* Date & Time */}
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">
              {formatDate(
                event.event_date || event.eventDate,
                event.event_end_date || event.eventEndDate
              )}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Organized by {organizerName}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="border-t border-slate-100 my-4 sm:my-5" />

        <Link
          href={targetHref}
          className="block w-full py-2.5 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm rounded-lg text-center transition-colors cursor-pointer"
        >
          Details
        </Link>
      </div>
    </article>
  );
}