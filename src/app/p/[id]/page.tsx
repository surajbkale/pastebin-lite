"use server";

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

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-50-200">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-sm font-mono text-gray-500">Paste ID: {id}</h1>
          <span className="text-xs bg-blue-100 text-blue-800 px2 py-1 rounded-full">
            Read-only
          </span>
        </div>
        <div className="p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-100 overflow-auto max-h-[70vh]">
            {result.data?.content}
          </pre>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
          <a href="/" className="text-sm text-blue-600 hover:underline">
            Create your own paste
          </a>
        </div>
      </div>
    </main>
  );
}
