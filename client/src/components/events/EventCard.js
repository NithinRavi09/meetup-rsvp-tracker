"use client";

import { useRouter } from "next/navigation";

export default function EventCard({ event }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <article>
      <h2>{event.title}</h2>

      <p>{event.description}</p>

      <p>
        <strong>Location:</strong> {event.location}
      </p>

      <p>
        <strong>Date:</strong> {event.event_date}
      </p>

      <button onClick={handleViewDetails}>
        View Details
      </button>
    </article>
  );
}