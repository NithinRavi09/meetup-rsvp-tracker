"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import api from "../../lib/api";
import useAuth from "../../hooks/useAuth";
import { parseLocalDate } from "../../lib/date";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import EventList from "../../components/events/EventList";
import EventSearchFilter from "../../components/events/EventSearchFilter";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Pagination from "../../components/ui/Pagination";

/**
 * Main Events Directory Page component.
 * Handles event fetching, client-side title/location search, date sorting, and dynamic pagination.
 */
export default function EventsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("soonest");

  // Navigates unauthenticated users to login if they attempt to create a meetup
  const handleCreateClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  // Updates search term and resets pagination to page 1 to prevent empty out-of-range views
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setActivePage(1);
  };

  // Updates sorting option ('soonest' or 'latest') and resets pagination to page 1
  const handleSortChange = (option) => {
    setSortOption(option);
    setActivePage(1);
  };

  // Fetches upcoming meetups from backend API on initial page mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/events");
        const fetchedEvents = response.data?.data;

        if (Array.isArray(fetchedEvents)) {
          setEvents(fetchedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load meetups. Please try again."
        );
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const query = searchTerm.trim().toLowerCase();

  const getMatchRank = (event, queryStr) => {
    if (!queryStr) return 0;
    const title = (event.title || "").toLowerCase();
    const location = (event.location || "").toLowerCase();

    if (title.startsWith(queryStr)) return 1;
    if (title.includes(queryStr)) return 2;
    if (location.includes(queryStr)) return 3;
    return 4;
  };

  const getDateTimestamp = (event) => {
    const dateVal = event?.event_date || event?.eventDate;
    if (!dateVal) return 0;
    const parsed = parseLocalDate(dateVal);
    return parsed ? parsed.getTime() : 0;
  };

  // 1. Filter events matching query in title or location
  const filteredEvents = events.filter((event) => {
    if (!query) return true;
    const title = (event.title || "").toLowerCase();
    const location = (event.location || "").toLowerCase();
    return title.includes(query) || location.includes(query);
  });

  // 2. Sort filtered events (prioritizing title starts-with when query is present, then date)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (query) {
      const rankA = getMatchRank(a, query);
      const rankB = getMatchRank(b, query);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
    }

    const timeA = getDateTimestamp(a);
    const timeB = getDateTimestamp(b);

    if (sortOption === "latest") {
      return timeB - timeA;
    }
    return timeA - timeB;
  });

  // 3. Dynamic pagination calculation
  const eventsPerPage = 9;
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  useEffect(() => {
    if (activePage > totalPages && totalPages > 0) {
      setActivePage(1);
    }
  }, [totalPages, activePage]);

  const startIndex = (activePage - 1) * eventsPerPage;
  const currentEvents = sortedEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Discover and join local gatherings in your area.
            </p>
          </div>

          <Link
            href="/events/create"
            onClick={handleCreateClick}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Meetup
          </Link>
        </div>

        {/* Search & Sort Bar */}
        <EventSearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

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
          <EventList
            events={currentEvents}
            searchTerm={searchTerm}
            onClearSearch={() => handleSearchChange("")}
          />
        )}

        {/* Pagination Section */}
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setActivePage}
        />
      </main>

      <Footer />
    </div>
  );
}