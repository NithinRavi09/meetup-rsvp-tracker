"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import EventList from "../../components/events/EventList";
import ErrorMessage from "../../components/ui/ErrorMessage";

const DEMO_EVENTS = [
  {
    id: 1,
    title: "Frontend Developers Monthly Mixer",
    description:
      "Join local frontend developers for our monthly networking event. We'll be discussing the latest in React, Vue, and CSS architecture over coffee and snacks.",
    event_date: "2024-10-24T18:30:00",
    event_end_date: "2024-10-24T20:30:00",
    location: "Downtown Co-work Space, Room B",
    organizer_name: "Sarah Jenkins",
  },
  {
    id: 2,
    title: "Weekend Urban Hike & Picnic",
    description:
      "Explore the hidden trails of the city park followed by a shared potluck picnic. A great way to get some fresh air and meet new people in the community.",
    event_date: "2024-10-26T10:00:00",
    event_end_date: "2024-10-26T13:00:00",
    location: "Centennial Park, West Entrance",
    organizer_name: "Mark T.",
  },
  {
    id: 3,
    title: "Beginner's Pottery Workshop",
    description:
      "A hands-on introduction to wheel throwing and hand-building techniques. All materials are provided. Limited spaces available for personalized instruction.",
    event_date: "2024-11-02T14:00:00",
    event_end_date: "2024-11-02T17:00:00",
    location: "Clay & Kiln Studio, 4th Ave",
    organizer_name: "Elena R.",
  },
];

export default function EventsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(1);

  const handleCreateClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/events");
        const fetchedEvents = response.data?.data;

        if (Array.isArray(fetchedEvents) && fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        } else {
          setEvents(DEMO_EVENTS);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Fallback to demo events if server fails or is empty during preview
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Discover and join local gatherings in your area.
            </p>
          </div>

          <Link
            href="/events/create"
            onClick={handleCreateClick}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
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
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Meetup
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-200 rounded-xl p-6 h-64 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <EventList events={events} />
        )}

        {/* Pagination Section */}
        {!loading && events.length > 0 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <button
              onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              &lt;
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setActivePage((prev) => Math.min(prev + 1, 3))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              &gt;
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}