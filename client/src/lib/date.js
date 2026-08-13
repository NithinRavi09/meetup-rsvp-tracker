/**
 * Parses a date string or Date object into a local Date instance
 * preserving local wall-clock components (year, month, day, hours, minutes).
 */
export function parseLocalDate(dateString) {
  if (!dateString) return null;

  if (dateString instanceof Date) {
    return isNaN(dateString.getTime()) ? null : dateString;
  }

  if (typeof dateString === "string") {
    // Match YYYY-MM-DD THH:mm:ss or YYYY-MM-DD HH:mm:ss or YYYY-MM-DDTHH:mm
    const match = dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hours = parseInt(match[4], 10);
      const minutes = parseInt(match[5], 10);
      const seconds = match[6] ? parseInt(match[6], 10) : 0;

      return new Date(year, month, day, hours, minutes, seconds);
    }
  }

  const fallbackDate = new Date(dateString);
  return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

/**
 * Formats start and end dates cleanly for Event Card displays.
 * Example (same day): "Aug 20, 2026 • 10:00 AM - 1:00 PM"
 * Example (across midnight): "Aug 20, 2026 10:00 PM - Aug 21, 2026 2:00 AM"
 */
export function formatEventCardDate(dateString, endDateString) {
  if (!dateString) return "Date not available";

  try {
    const startDate = parseLocalDate(dateString);
    if (!startDate) return String(dateString);

    const endDate = endDateString ? parseLocalDate(endDateString) : null;

    const formattedStartDate = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedStartTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (endDate) {
      const formattedEndDate = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const formattedEndTime = endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Same day event
      if (formattedStartDate === formattedEndDate) {
        return `${formattedStartDate} • ${formattedStartTime} - ${formattedEndTime}`;
      }

      // Midnight-crossing or multi-day event
      return `${formattedStartDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`;
    }

    return `${formattedStartDate} • ${formattedStartTime}`;
  } catch {
    return String(dateString);
  }
}

/**
 * Formats start and end dates for Event Details display.
 */
export function formatEventDetailsDate(dateString, endDateString) {
  const startDate = parseLocalDate(dateString);
  const endDate = endDateString ? parseLocalDate(endDateString) : null;

  if (!startDate) {
    return {
      formattedDate: "Date unavailable",
      formattedStartTime: "",
      formattedEndTime: "",
    };
  }

  const formattedDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let formattedEndTime = "";

  if (endDate) {
    const startDayStr = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const endDayStr = endDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const endTimeStr = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (startDayStr === endDayStr) {
      formattedEndTime = endTimeStr;
    } else {
      const endMonthDay = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      formattedEndTime = `${endTimeStr} (${endMonthDay})`;
    }
  }

  return {
    formattedDate,
    formattedStartTime,
    formattedEndTime,
  };
}

/**
 * Formats a date string for HTML <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
 */
export function formatDateTimeInput(value) {
  if (!value) return "";

  const date = parseLocalDate(value);
  if (!date) return String(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
