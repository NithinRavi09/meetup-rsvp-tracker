"use client";

import { useState } from "react";
import api from "../../lib/api";

export default function RSVPSection({ eventId }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRSVP = async (selectedStatus) => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      await api.post(`/events/${eventId}/rsvp`, {
        status: selectedStatus,
      });

      setStatus(selectedStatus);
      setMessage("Your RSVP has been updated.");
    } catch (error) {
      console.error("Failed to RSVP:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update RSVP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>RSVP</h2>

      <div>
        <button
          type="button"
          onClick={() => handleRSVP("going")}
          disabled={loading}
        >
          Going
        </button>

        <button
          type="button"
          onClick={() => handleRSVP("maybe")}
          disabled={loading}
        >
          Maybe
        </button>

        <button
          type="button"
          onClick={() => handleRSVP("declined")}
          disabled={loading}
        >
          Declined
        </button>
      </div>

      {status && <p>Your response: {status}</p>}

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}
    </section>
  );
}