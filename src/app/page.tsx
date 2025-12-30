"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: any = { content };
      if (ttl) {
        payload.ttl_seconds = parseInt(ttl);
      }
      if (maxViews) {
        payload.max_views = parseInt(maxViews);
      }

      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create paste");
      }

      const data = await res.json();
      router.push(`/p/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 px-8 py-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Pastebin-Lite
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Share text securely with auto-expiry logic.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Paste
              </label>
              <textarea
                required
                className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 font-mono text-sm resize-none shadow-inner"
                placeholder="Type or paste your code/text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Burn After (Seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
                  placeholder="e.g. 60"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Optional: Auto-delete after time
                </p>
              </div>

              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Max Views
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
                  placeholder="e.g. 5"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Optional: Delete after X visits
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg tracking-wide shadow-lg transform transition-all duration-200 
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Secure Paste"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
