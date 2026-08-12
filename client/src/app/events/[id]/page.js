"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Trash2, Calendar, MapPin, User } from "lucide-react";
import api from "../../../lib/api";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import AttendeeList from "../../../components/events/AttendeeList";
import RSVPSection from "../../../components/events/RSVPSection";
import ErrorMessage from "../../../components/ui/ErrorMessage";

const DEMO_EVENT_DETAILS = {
  id: "1",
  title: "Advanced CSS Grid Techniques",
  description:
    "Join us for an in-depth dive into Advanced CSS Grid techniques. Whether you're building complex dashboard layouts or simple responsive marketing pages, mastering CSS Grid will significantly streamline your workflow.\n\nWe'll cover subgrids, named template areas, and combining Grid with Flexbox for optimal component-level control. Bring your laptops, as the second half of the session will be an interactive workshop where we refactor a legacy layout together.",
  event_date: "2024-10-24T18:30:00",
  event_end_date: "2024-10-24T20:30:00",
  location: "Downtown Tech Hub\n123 Innovation Way, Suite 400",
  creator_name: "Sarah Jenkins",
  organizer_avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/events/${eventId}`);
        if (response.data?.data) {
          setEvent(response.data.data);
        } else {
          setEvent(DEMO_EVENT_DETAILS);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setEvent(DEMO_EVENT_DETAILS);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendees = async () => {
      try {
        setAttendeesLoading(true);
        const response = await api.get(`/events/${eventId}/rsvps`);
        if (response.data?.data) {
          setAttendees(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch attendees:", err);
      } finally {
        setAttendeesLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
      fetchAttendees();
    }
  }, [eventId]);

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  const currentEvent = event || DEMO_EVENT_DETAILS;

  // Split description into paragraphs for presentation
  const paragraphs = (currentEvent.description || "")
    .split("\n\n")
    .filter(Boolean);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 h-96 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Main Event Card */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-2xs space-y-6">
              {/* Header with Title and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentEvent.title}
                </h1>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Event
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                    <Calendar className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Date & Time
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      October 24, 2024
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      6:30 PM - 8:30 PM
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                    <MapPin className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Location
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      Downtown Tech Hub
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      123 Innovation Way, Suite 400
                    </p>
                  </div>
                </div>

                {/* Organized by */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Organized by
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Image
                        src="/images/user.png"
                        alt="Organizer"
                        width={24}
                        height={24}
                        unoptimized
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-sm font-bold text-slate-800">
                        {currentEvent.creator_name || "Sarah Jenkins"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-6" />

              {/* About this Event */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">
                  About this event
                </h2>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <RSVPSection eventId={eventId} />

              <AttendeeList
                attendees={attendees}
                loading={attendeesLoading}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}