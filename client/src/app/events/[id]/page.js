"use client";

import AttendeeList from "../../../components/events/AttendeeList";
import RSVPSection from "../../../components/events/RSVPSection";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(true);
  const [attendeesError, setAttendeesError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/events/${eventId}`);

        setEvent(response.data.data);
      } catch (error) {
        console.error("Failed to fetch event:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendees = async () => {
      try {
        setAttendeesLoading(true);
        setAttendeesError("");

        const response = await api.get(`/events/${eventId}/rsvps`);

        setAttendees(response.data.data);
      } catch (error) {
        console.error("Failed to fetch attendees:", error);

        setAttendeesError(
          error.response?.data?.message ||
            "Failed to load attendees."
        );
      } finally {
        setAttendeesLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
      fetchAttendees();
    }
  }, [eventId]);

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <main>
      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <p>
        <strong>Location:</strong> {event.location}
      </p>

      <p>
        <strong>Date:</strong> {event.event_date}
      </p>

      <p>
        <strong>Created by:</strong> {event.creator_name}
      </p>

      {attendeesLoading && <p>Loading attendees...</p>}

      {attendeesError && <p>{attendeesError}</p>}

      {!attendeesLoading && !attendeesError && (
        <AttendeeList attendees={attendees} />
      )}

      <RSVPSection eventId={eventId} />
    </main>
  );
}