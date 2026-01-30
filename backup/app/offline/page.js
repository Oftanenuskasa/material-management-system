'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📶</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          Please check your internet connection and try again.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
          <a
            href="/"
            className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 text-center"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
