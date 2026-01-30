'use client'

import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  
  const isLoading = status === 'loading'
  const user = session?.user || null
  
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false
    
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
  
  const hasExactRole = (role) => {
    return user?.role === role
  }
  
  return {
    user,
    isLoading,
    hasRole,
    hasExactRole,
    isAuthenticated: !!user
  }
}
