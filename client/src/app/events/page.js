"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import EventCard from "../../components/events/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/events");

        setEvents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load events. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Meetup Events</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}