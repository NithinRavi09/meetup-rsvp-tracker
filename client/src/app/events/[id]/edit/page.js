"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    eventEndDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/events/${eventId}`);

        const event = response.data.data;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          eventDate: formatDateTime(event.event_date),
          eventEndDate: formatDateTime(event.event_end_date),
        });
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

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.eventDate ||
      !formData.eventEndDate
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.eventEndDate <= formData.eventDate) {
      setError(
        "End date and time must be after the start date and time."
      );
      return;
    }

    try {
      setSaving(true);

      await api.put(`/events/${eventId}`, formData);

      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error("Failed to update event:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update meetup."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading event...</p>;
  }

  return (
    <main>
      <h1>Edit Meetup</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Event Title</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="eventDate">Start Date/Time</label>

          <input
            id="eventDate"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="eventEndDate">End Date/Time</label>

          <input
            id="eventEndDate"
            name="eventEndDate"
            type="datetime-local"
            value={formData.eventEndDate}
            onChange={handleChange}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}