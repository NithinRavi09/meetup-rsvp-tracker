"use client";

import { useRouter } from "next/navigation";

export default function EventCard({ event }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };

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
    <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
          {event.title}
        </h2>

        <p className="text-slate-600 text-sm mt-2.5 leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {event.description}
        </p>

        <div className="mt-5 space-y-2 text-xs text-slate-500 font-medium">
          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">
              {formatDate(
                event.event_date || event.eventDate,
                event.event_end_date || event.eventEndDate
              )}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate">Organized by {organizerName}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="border-t border-slate-100 my-5" />

        <button
          onClick={handleViewDetails}
          className="w-full py-2.5 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm rounded-lg text-center transition-colors cursor-pointer"
        >
          Details
        </button>
      </div>
    </article>
  );
}