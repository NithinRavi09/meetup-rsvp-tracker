export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2.5 shadow-xs">
      <svg
        className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
