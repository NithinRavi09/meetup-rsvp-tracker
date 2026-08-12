"use client";

import { Calendar } from "lucide-react";
import EventCard from "./EventCard";

export default function EventList({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 sm:my-12 shadow-2xs">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          No upcoming events
        </h3>
        <p className="text-slate-500 text-sm">
          Be the first to organize a meetup in your community!
        </p>
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
