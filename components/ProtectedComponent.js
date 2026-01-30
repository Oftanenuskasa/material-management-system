'use client'

import { useAuth } from './AuthProvider'

export default function ProtectedComponent({ requiredRole, children }) {
  const { user, hasRole } = useAuth()
  
  if (!hasRole(requiredRole)) {
    return null
  }
  
  return children
}

// Example usage:
// <ProtectedComponent requiredRole="ADMIN">
//   <button>Admin Button</button>
// </ProtectedComponent>
