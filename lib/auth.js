// Super simple auth for development - always returns a user
export async function getCurrentUser(token) {
  console.log('Auth token received:', token ? 'Present' : 'Missing')
  
  // For development, always return a user regardless of token
  // Default to ADMIN for testing
  
  const role = localStorage.getItem('userRole') || 'ADMIN'
  
  return {
    id: 'dev-user-id',
    email: 'dev@material.com',
    name: 'Development User',
    role: role
  }
}
