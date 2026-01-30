const Role = {
  USER: 'USER',
  STAFF: 'STAFF', 
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN'
}

const roleHierarchy = {
  [Role.USER]: 1,
  [Role.STAFF]: 2,
  [Role.MANAGER]: 3,
  [Role.ADMIN]: 4
}

// Helper to check if user has required role
function hasRequiredRole(userRole, requiredRole) {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Route protection rules for Material Management
const routePermissions = {
  '/admin': Role.ADMIN,
  '/manager': Role.MANAGER,
  '/staff': Role.STAFF,
  '/dashboard': Role.USER,
  '/materials/add': Role.STAFF,
  '/materials/edit': Role.STAFF,
  '/materials/delete': Role.MANAGER,
  '/reports': Role.MANAGER,
  '/settings': Role.ADMIN,
  '/api/admin': Role.ADMIN,
  '/api/manager': Role.MANAGER,
  '/api/staff': Role.STAFF
}

// Permission mapping for Material Management
const rolePermissions = {
  [Role.USER]: ['VIEW_MATERIALS', 'CREATE_REQUEST'],
  [Role.STAFF]: ['VIEW_MATERIALS', 'CREATE_REQUEST', 'ADD_MATERIAL', 'EDIT_MATERIAL', 'VIEW_REPORTS'],
  [Role.MANAGER]: ['VIEW_MATERIALS', 'CREATE_REQUEST', 'ADD_MATERIAL', 'EDIT_MATERIAL', 'DELETE_MATERIAL', 'VIEW_REPORTS', 'APPROVE_REQUESTS', 'MANAGE_STAFF'],
  [Role.ADMIN]: ['VIEW_MATERIALS', 'CREATE_REQUEST', 'ADD_MATERIAL', 'EDIT_MATERIAL', 'DELETE_MATERIAL', 'VIEW_REPORTS', 'APPROVE_REQUESTS', 'MANAGE_STAFF', 'MANAGE_USERS', 'SYSTEM_SETTINGS']
}

function hasPermission(userRole, requiredPermission) {
  return rolePermissions[userRole]?.includes(requiredPermission) || false
}

module.exports = {
  Role,
  roleHierarchy,
  hasRequiredRole,
  routePermissions,
  rolePermissions,
  hasPermission
}
