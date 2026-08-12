"use client";

import Link from "next/link";
import { CalendarX, Plus } from "lucide-react";
import EventCard from "./EventCard";
import useAuth from "../../hooks/useAuth";

export default function EventList({ events = [] }) {
  const { isLoggedIn } = useAuth();

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 sm:my-12 shadow-2xs space-y-4">
        <div className="p-3 rounded-full bg-slate-100 text-slate-400 w-12 h-12 mx-auto flex items-center justify-center">
          <CalendarX className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No meetups found
          </h3>
          <p className="text-slate-500 text-sm">
            There are no meetups available right now.
          </p>
        </div>

        {isLoggedIn && (
          <div className="pt-2">
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Meetup
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

