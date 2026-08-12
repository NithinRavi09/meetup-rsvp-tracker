import { Loader2 } from "lucide-react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <p className="text-sm font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  );
}
