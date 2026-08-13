"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, CalendarX } from "lucide-react";
import api from "../../../../lib/api";
import Navbar from "../../../../components/layout/Navbar";
import Footer from "../../../../components/layout/Footer";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import ErrorMessage from "../../../../components/ui/ErrorMessage";
import { formatDateTimeInput } from "../../../../lib/date";

/**
 * Protected Edit Event Page component allowing event creators to update meetup details.
 */
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
  const [eventNotFound, setEventNotFound] = useState(false);

  // Prefills existing event details into form on component mount
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
            eventDate: formatDateTimeInput(event.event_date || event.eventDate),
            eventEndDate: formatDateTimeInput(
              event.event_end_date || event.eventEndDate
            ),
          });
        } else {
          setEventNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setError(
          error.response?.data?.message ||
            "Event not found or failed to load event details."
        );
        setEventNotFound(true);
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Form Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6">
              {/* Back link & Card Header */}
              <div>
                <Link
                  href={`/events/${eventId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Event
                </Link>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Edit Meetup
                </h1>
                {formData.title && (
                  <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                    Update the details for &quot;{formData.title}&quot;.
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 my-4" />

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-10 bg-slate-100 rounded w-full"></div>
                  <div className="h-28 bg-slate-100 rounded w-full"></div>
                  <div className="h-10 bg-slate-100 rounded w-full"></div>
                </div>
              ) : eventNotFound ? (
                <div className="py-8 text-center space-y-4">
                  <div className="p-3 rounded-full bg-slate-100 text-slate-400 w-12 h-12 mx-auto flex items-center justify-center">
                    <CalendarX className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm font-medium">
                    {error || "Event not found."}
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                  </Link>
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
                      icon={<MapPin className="w-5 h-5 text-slate-400" />}
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