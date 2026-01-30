'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session', { method: 'GET' })
      const data = await res.json()
      setUser(data?.user ?? null)
    } catch (err) {
      console.error('Session check failed:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data?.error || 'Login failed' }
      }

      // Session cookie is set server-side by setSession()
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // even if request fails, clear client state
      console.error('Logout request failed:', e)
    } finally {
      setUser(null)
      router.push('/auth/login')
    }
  }

  // Role hierarchy for RBAC
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false

    const roleHierarchy = {
      USER: 1,
      STAFF: 2,
      MANAGER: 3,
      ADMIN: 4,
    }

    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0

    return userLevel >= requiredLevel
  }

  // Check specific permissions
  const hasPermission = (permission) => {
    if (!user || !user.role) return false

    const rolePermissions = {
      USER: ['VIEW_MATERIALS', 'CREATE_REQUEST'],
      STAFF: ['VIEW_MATERIALS', 'CREATE_REQUEST', 'ADD_MATERIAL', 'EDIT_MATERIAL', 'VIEW_REPORTS'],
      MANAGER: [
        'VIEW_MATERIALS',
        'CREATE_REQUEST',
        'ADD_MATERIAL',
        'EDIT_MATERIAL',
        'DELETE_MATERIAL',
        'VIEW_REPORTS',
        'APPROVE_REQUESTS',
        'MANAGE_STAFF',
      ],
      ADMIN: [
        'VIEW_MATERIALS',
        'CREATE_REQUEST',
        'ADD_MATERIAL',
        'EDIT_MATERIAL',
        'DELETE_MATERIAL',
        'VIEW_REPORTS',
        'APPROVE_REQUESTS',
        'MANAGE_STAFF',
        'MANAGE_USERS',
        'SYSTEM_SETTINGS',
      ],
    }

    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}