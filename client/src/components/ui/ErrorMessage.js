import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2.5 shadow-xs">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
