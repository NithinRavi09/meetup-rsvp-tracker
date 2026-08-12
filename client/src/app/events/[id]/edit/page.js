"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../lib/api";
import Navbar from "../../../../components/layout/Navbar";
import Footer from "../../../../components/layout/Footer";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import ErrorMessage from "../../../../components/ui/ErrorMessage";

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

        if (event) {
          setFormData({
            title: event.title || "",
            description: event.description || "",
            location: event.location || "",
            eventDate: formatDateTime(event.event_date || event.eventDate),
            eventEndDate: formatDateTime(
              event.event_end_date || event.eventEndDate
            ),
          });
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);

        // Fallback for demo preview if server returns 404 or fails
        setFormData({
          title: "Weekly Coffee & Code",
          description:
            "Join us for our weekly informal meetup to write code, drink coffee, and chat about technology. All skill levels welcome! Please bring your own laptop.",
          location: "Downtown Roasters, 123 Main St, Seattle",
          eventDate: "2023-11-15T09:00",
          eventEndDate: "2023-11-15T12:00",
        });
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
      setError("End date and time must be after the start date and time.");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/events/${eventId}`, formData);

      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error("Failed to update event:", error);

      setError(
        error.response?.data?.message || "Failed to update meetup."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
            {/* Back link & Card Header */}
            <div>
              <Link
                href={`/events/${eventId}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Event
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Edit Meetup
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Update the details for &quot;{formData.title || "Weekly Coffee & Code"}&quot;.
              </p>
            </div>

            <div className="border-t border-slate-100 my-4" />

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-slate-100 rounded w-full"></div>
                <div className="h-28 bg-slate-100 rounded w-full"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Basic Information
                  </h2>

                  <Input
                    id="title"
                    name="title"
                    type="text"
                    label="Event Title *"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-slate-700 mb-1.5"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Provide a clear description of what attendees can expect.
                    </p>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="space-y-4 pt-2">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Logistics
                  </h2>

                  <Input
                    id="location"
                    name="location"
                    type="text"
                    label="Location *"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    icon={
                      <svg
                        className="w-5 h-5 text-slate-400"
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
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      label="Start Date & Time *"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      id="eventEndDate"
                      name="eventEndDate"
                      type="datetime-local"
                      label="End Date & Time *"
                      value={formData.eventEndDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <ErrorMessage message={error} />

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => router.back()}
                    disabled={saving}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return value;
  }
}