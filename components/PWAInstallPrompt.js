'use client'

import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Store dismissal in localStorage to not show again for some time
    localStorage.setItem('pwaPromptDismissed', Date.now())
  }

  if (!showInstallPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl">📱</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Install Material Management App
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Install this app on your device for quick access and offline functionality.
            </p>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
