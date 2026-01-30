'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  // Only 4 demo accounts
  const demoAccounts = [
    { role: 'ADMIN', email: 'admin@system.com', password: 'Admin123@', color: 'bg-purple-100 text-purple-800', icon: '👑' },
    { role: 'MANAGER', email: 'manager@system.com', password: 'Manager123@', color: 'bg-yellow-100 text-yellow-800', icon: '📊' },
    { role: 'STAFF', email: 'staff@system.com', password: 'Staff123@', color: 'bg-green-100 text-green-800', icon: '📦' },
    { role: 'USER', email: 'user@system.com', password: 'User123@', color: 'bg-blue-100 text-blue-800', icon: '👤' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-8">
        {/* Login Form */}
        <div className="lg:w-1/2 p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">🏗️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Material Management</h1>
            <p className="text-gray-600 mt-2">Sign in to access the system</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Click on any demo account to auto-fill the form
            </p>
          </div>
        </div>
        
        {/* Demo Accounts Panel */}
        <div className="lg:w-1/2">
          <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl text-white h-full">
            <h2 className="text-2xl font-bold mb-2">Demo Accounts</h2>
            <p className="text-gray-300 mb-6">
              Test the system with different user roles
            </p>
            
            <div className="space-y-4">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  onClick={() => fillDemoAccount(account)}
                  className="p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl cursor-pointer transition border border-gray-700 hover:border-gray-600 group"
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 ${account.color.replace('text-', '')}`}>
                      {account.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-white">{account.role}</h4>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300">{account.email}</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                        >
                          Use This
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Password: 
                          <code className="ml-2 bg-gray-900/50 px-2 py-1 rounded font-mono">
                            {account.password}
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold mb-3 text-lg">Role Permissions</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-900/20 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">👑</span>
                    <span className="font-medium">ADMIN</span>
                  </div>
                  <p className="text-purple-300 text-xs">Full system access</p>
                </div>
                <div className="bg-yellow-900/20 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">📊</span>
                    <span className="font-medium">MANAGER</span>
                  </div>
                  <p className="text-yellow-300 text-xs">Approve requests & reports</p>
                </div>
                <div className="bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">📦</span>
                    <span className="font-medium">STAFF</span>
                  </div>
                  <p className="text-green-300 text-xs">Manage inventory</p>
                </div>
                <div className="bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="mr-2">👤</span>
                    <span className="font-medium">USER</span>
                  </div>
                  <p className="text-blue-300 text-xs">Browse & request materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
