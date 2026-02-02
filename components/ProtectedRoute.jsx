'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children, requiredRole }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (!token || !userData) {
        router.push('/auth/login')
        return
      }
      
      try {
        const user = JSON.parse(userData)
        setUserRole(user.role)
        
        if (requiredRole && user.role !== requiredRole) {
          router.push('/unauthorized')
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push('/auth/login')
      }
    }
    
    checkAuth()
  }, [router, requiredRole])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (requiredRole && userRole !== requiredRole) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
