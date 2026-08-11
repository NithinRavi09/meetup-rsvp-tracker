"use client";

const DEMO_ATTENDEES = [
  { id: 1, name: "Sarah Jenkins", initials: "SJ", color: "bg-blue-600", status: "GOING" },
  { id: 2, name: "Michael Ross", initials: "MR", color: "bg-slate-400", status: "GOING" },
  { id: 3, name: "Alex Lee", initials: "AL", color: "bg-amber-700", status: "MAYBE" },
];

export default function AttendeeList({ attendees = [] }) {
  const displayList =
    Array.isArray(attendees) && attendees.length > 0
      ? attendees
      : DEMO_ATTENDEES;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status) => {
    const s = (status || "GOING").toUpperCase();
    if (s === "GOING") {
      return (
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          GOING
        </span>
      );
    }
    if (s === "MAYBE") {
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          MAYBE
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        DECLINED
      </span>
    );
  };

  const getAvatarBg = (index) => {
    const colors = ["bg-blue-600", "bg-slate-400", "bg-amber-700", "bg-emerald-600", "bg-indigo-600"];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900">
        Attendees ({displayList.length})
      </h2>

      <div className="divide-y divide-slate-100">
        {displayList.map((attendee, index) => (
          <div
            key={attendee.id || index}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-full ${
                  attendee.color || getAvatarBg(index)
                } text-white font-bold text-xs flex items-center justify-center shadow-2xs`}
              >
                {attendee.initials || getInitials(attendee.name)}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {attendee.name || attendee.email}
              </span>
            </div>

            {getStatusBadge(attendee.status)}
          </div>
        ))}
      </div>
    </div>
  );
}