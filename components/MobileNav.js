'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl p-2"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50 border-t">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              href="/"
              className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              href="/materials"
              className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              📦 Materials
            </Link>
            <Link
              href="/materials/create"
              className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              ➕ Add New
            </Link>
            <div className="border-t pt-3 mt-3">
              <button
                onClick={() => {
                  if (window.deferredPrompt) {
                    window.deferredPrompt.prompt()
                  }
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                📱 Install App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
