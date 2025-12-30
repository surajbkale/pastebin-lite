import Link from "next/link";

export default function PasteNotFound() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 text-center">
        <div className="bg-slate-50 border-b border-slate-200 p-8 flex justify-center">
          <div className="h-20 w-20 bg-slate-200 rounded-full flex items-center justify-center">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            Paste Unavailable
          </h1>
          <p className="text-slate-500 mb-6 leading-relaxed">
            This paste is no longer accessible. It may have:
          </p>
          <ul className="text-left text-sm text-slate-600 space-y-3 bg-slate-50 p-4 rounded-lg mb-6">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              Reached its view limit
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-orange-400"></span>
              Expired due to time limit
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
              Never existed (Invalid ID)
            </li>
          </ul>

          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Create a New Paste
          </Link>
        </div>
      </div>

      <div className="mt-8 text-slate-400 text-sm">
        Error 404 • Resource Gone
      </div>
    </main>
  );
}
