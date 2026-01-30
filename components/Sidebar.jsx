'use client'

import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', allowed: ['USER', 'STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Materials', href: '/materials', icon: '📦', allowed: ['USER', 'STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Requests', href: '/requests', icon: '📋', allowed: ['USER', 'STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Inventory', href: '/inventory', icon: '📊', allowed: ['STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Suppliers', href: '/suppliers', icon: '🏢', allowed: ['STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Reports', href: '/reports', icon: '📈', allowed: ['MANAGER', 'ADMIN'] },
  { name: 'Users', href: '/admin/users', icon: '👥', allowed: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: '⚙️', allowed: ['ADMIN'] },
]

export default function Sidebar() {
  const { hasExactRole } = useAuth()
  const pathname = usePathname()

  const filteredNavigation = navigation.filter(item => {
    return item.allowed.some(role => hasExactRole(role))
  })

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
      <nav className="px-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
