"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import api from "../../../lib/api";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";

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
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Banner */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Meetup
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                Fill in the details below to organize a new event for the community.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Title */}
                <Input
                  id="title"
                  name="title"
                  type="text"
                  label="Event Title *"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Weekend Tech Mixer"
                  required
                />

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this meetup about?"
                    rows={4}
                    className="w-full py-2.5 px-3.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Location with Pin Icon */}
                <Input
                  id="location"
                  name="location"
                  type="text"
                  label="Location *"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Address or Venue Name"
                  required
                  icon={<MapPin className="w-5 h-5 text-slate-400" />}
                />

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="datetime-local"
                    label="Start Date/Time *"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    id="eventEndDate"
                    name="eventEndDate"
                    type="datetime-local"
                    label="End Date/Time *"
                    value={formData.eventEndDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <ErrorMessage message={error} />

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                  >
                    Create Meetup
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}