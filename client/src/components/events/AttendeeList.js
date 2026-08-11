"use client";

export default function AttendeeList({ attendees }) {
  if (attendees.length === 0) {
    return <p>No attendees yet.</p>;
  }

  return (
    <section>
      <h2>Attendees</h2>

      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>
            <strong>{attendee.name}</strong>
            <span> — {attendee.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}