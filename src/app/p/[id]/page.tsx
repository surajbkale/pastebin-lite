import { notFound } from "next/navigation";
import { getAndTrackPaste } from "@/lib/pasteService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPastePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getAndTrackPaste(id);

  if (result.status !== "SUCCESS") {
    notFound();
  }

  const { content, remaining_views, expires_at } = result.data || {};

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-mono text-slate-500">
              ID: <span className="text-slate-800 font-bold">{id}</span>
            </span>
          </div>

          <div className="flex gap-3 text-xs font-semibold">
            {remaining_views !== null && remaining_views !== undefined && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                {remaining_views} views left
              </span>
            )}
            {expires_at ? (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                Expires soon
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                Never expires
              </span>
            )}
          </div>
        </div>

        <div className="p-0 bg-slate-900 overflow-hidden">
          <div className="w-full p-6 overflow-auto max-h-[70vh]">
            <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <a
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← Create New Paste
          </a>
          <button disabled className="text-xs text-slate-400 cursor-default">
            Read Only Mode
          </button>
        </div>
      </div>
    </main>
  );
}
