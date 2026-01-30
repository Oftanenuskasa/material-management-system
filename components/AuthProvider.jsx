'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check session on initial load
    checkSession()
    
    // Also check on route changes
    const handleRouteChange = () => checkSession()
    router.events?.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || 'USER'
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Session check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!user) return false
    
    const roleHierarchy = {
      'USER': 0,
      'STAFF': 1,
      'MANAGER': 2,
      'ADMIN': 3
    }
    
    const userRoleLevel = roleHierarchy[user.role] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0
    
    return userRoleLevel >= requiredRoleLevel
  }

  // Check if user has exact role
  const hasExactRole = (role) => {
    return user?.role === role
  }

  // Login function
  const login = async (email, password) => {
    try {
      const result = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          redirect: false,
          callbackUrl: '/dashboard'
        })
      })
      
      const data = await result.json()
      
      if (result.ok) {
        await checkSession()
        router.push('/dashboard')
        router.refresh()
        return { success: true }
      } else {
        return { 
          success: false, 
          error: data?.error || 'Login failed' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: 'Network error' 
      }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { 
        method: 'POST' 
      })
      setUser(null)
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    isLoading,
    hasRole,
    hasExactRole,
    login,
    logout,
    refreshSession: checkSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
