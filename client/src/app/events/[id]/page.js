"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Trash2, Calendar, MapPin, User, CalendarX } from "lucide-react";
import api from "../../../lib/api";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import AttendeeList from "../../../components/events/AttendeeList";
import RSVPSection from "../../../components/events/RSVPSection";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Button from "../../../components/ui/Button";
import useAuth from "../../../hooks/useAuth";
import { formatEventDetailsDate } from "../../../lib/date";

/**
 * Protected Event Details Page component.
 * Displays full event details, attendee list, interactive RSVP controls, and owner-only edit/delete modal.
 */
export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetches event details and attendee RSVPs in parallel on page load
  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      if (!eventId) return;

      setLoading(true);
      setAttendeesLoading(true);
      setError("");

      const eventPromise = api
        .get(`/events/${eventId}`)
        .then((response) => {
          if (response.data?.data) {
            setEvent(response.data.data);
          } else {
            setEvent(null);
            setError("Event not found");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch event:", err);
          setError(
            err.response?.data?.message ||
              "The requested meetup could not be found."
          );
          setEvent(null);
        })
        .finally(() => {
          setLoading(false);
        });

      const attendeesPromise = api
        .get(`/events/${eventId}/rsvps`)
        .then((response) => {
          if (response.data?.data) {
            setAttendees(response.data.data);
          } else {
            setAttendees([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch attendees:", err);
          setAttendees([]);
        })
        .finally(() => {
          setAttendeesLoading(false);
        });

      await Promise.all([eventPromise, attendeesPromise]);
    };

    fetchEventAndAttendees();
  }, [eventId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDeleteModalOpen && !isDeleting) {
        setIsDeleteModalOpen(false);
        setDeleteError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteModalOpen, isDeleting]);

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleOpenDeleteModal = () => {
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || !eventId) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await api.delete(`/events/${eventId}`);
      router.push("/events");
    } catch (err) {
      console.error("Failed to delete event:", err);
      const apiMessage = err.response?.data?.message;
      setDeleteError(
        apiMessage || "Failed to delete meetup. Please try again."
      );
      setIsDeleting(false);
    }
  };

  const currentEvent = event;

  // Split description into paragraphs for presentation
  const paragraphs = (currentEvent?.description || "")
    .split("\n\n")
    .filter(Boolean);

  const { formattedDate, formattedStartTime, formattedEndTime } =
    formatEventDetailsDate(
      currentEvent?.event_date || currentEvent?.eventDate,
      currentEvent?.event_end_date || currentEvent?.eventEndDate
    );

  const { user } = useAuth();

  const isOwner =
    user?.id != null &&
    currentEvent?.created_by != null &&
    Number(user.id) === Number(currentEvent.created_by);

  const currentUserRsvp = attendees.find(
    (attendee) =>
      Number(attendee.user_id) === Number(user?.id) ||
      Number(attendee.id) === Number(user?.id)
  );

  const handleRsvpUpdated = (newStatus) => {
    if (!user?.id) return;

    setAttendees((previousAttendees) => {
      const list = Array.isArray(previousAttendees) ? previousAttendees : [];
      const existingIndex = list.findIndex(
        (attendee) =>
          Number(attendee.user_id) === Number(user.id) ||
          Number(attendee.id) === Number(user.id)
      );

      if (existingIndex !== -1) {
        return list.map((attendee, index) =>
          index === existingIndex
            ? { ...attendee, status: newStatus }
            : attendee
        );
      } else {
        const newAttendee = {
          id: user.id,
          user_id: user.id,
          name:
            user.name ||
            user.username ||
            user.user_name ||
            user.full_name ||
            user.email ||
            "You",
          email: user.email,
          status: newStatus,
        };
        return [...list, newAttendee];
      }
    });
  };


  const organizerName =
    currentEvent?.creator_name ||
    currentEvent?.organizer_name ||
    currentEvent?.organizer ||
    currentEvent?.created_by_name;

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

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 h-96 animate-pulse" />
          ) : !currentEvent ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8 sm:my-12 shadow-2xs space-y-4">
              <div className="p-3 rounded-full bg-slate-100 text-slate-400 w-12 h-12 mx-auto flex items-center justify-center">
                <CalendarX className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Event Not Found
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {error ||
                  "The meetup you are looking for does not exist or has been removed."}
              </p>
              <div className="pt-2">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Main Event Card */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-2xs space-y-6">
                {/* Header with Title and Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {currentEvent.title}
                  </h1>

                  {isOwner && (
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
                        onClick={handleOpenDeleteModal}
                        className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
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
                        {formattedDate}
                      </p>
                      {formattedStartTime && (
                        <p className="text-xs text-slate-500 font-medium">
                          {formattedStartTime}
                          {formattedEndTime ? ` - ${formattedEndTime}` : ""}
                        </p>
                      )}
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

                      {currentEvent.location ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            currentEvent.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline mt-0.5 inline-block"
                        >
                          {currentEvent.location}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          Location unavailable
                        </p>
                      )}
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
                          {organizerName || "Organizer information unavailable"}
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
                    {paragraphs.length > 0 ? (
                      paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">
                        No description provided for this event.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <RSVPSection
                  eventId={eventId}
                  currentRsvp={currentUserRsvp?.status || ""}
                  onRsvpUpdated={handleRsvpUpdated}
                />

                <AttendeeList
                  attendees={attendees}
                  loading={attendeesLoading}
                />
              </div>
            </div>
          )}
        </main>

        <Footer />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) {
                handleCloseDeleteModal();
              }
            }}
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-50 text-red-600 shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3
                    id="delete-modal-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Delete Meetup?
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to delete this meetup? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              {deleteError && <ErrorMessage message={deleteError} />}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCloseDeleteModal}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmDelete}
                  loading={isDeleting}
                  disabled={isDeleting}
                  icon={<Trash2 className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}