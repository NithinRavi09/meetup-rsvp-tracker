"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    eventEndDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("End date and time must be after the start date and time.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/events", formData);

      const createdEvent = response.data.data;

      router.push(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error("Failed to create event:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create meetup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Create Meetup</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter meetup title"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your meetup"
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
            placeholder="Enter meetup location"
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Meetup"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}