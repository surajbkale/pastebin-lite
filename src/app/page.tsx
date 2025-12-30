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
      if (ttl) payload.ttl_seconds = parseInt(ttl);
      if (maxViews) payload.max_views = parseInt(maxViews);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Pastebin-Lite</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              required
              className="w-full h-40 p-3 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TTL (Seconds){" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 text-gray-900 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 60"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Views{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 text-gray-900 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 5"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Creating..." : "Create Paste"}
          </button>
        </form>
      </div>
    </main>
  );
}
