import { NextResponse } from 'next/server'

// Import or share the users array - we'll use a shared approach
// For simplicity, we'll duplicate it but in real app you'd use a shared module

// Initial users
const initialUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'System Admin',
    role: 'ADMIN',
    department: 'IT',
    phone: '+1234567890',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Warehouse Manager',
    role: 'MANAGER',
    department: 'Operations',
    phone: '+1234567891',
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'staff@example.com',
    name: 'Inventory Staff',
    role: 'STAFF',
    department: 'Warehouse',
    phone: '+1234567892',
    isActive: true,
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'USER',
    department: 'Engineering',
    phone: '+1234567893',
    isActive: true,
    createdAt: '2024-01-04T00:00:00.000Z'
  }
]

// In-memory storage (for demo)
let users = [...initialUsers]

export async function GET(request) {
  try {
    console.log('GET /api/users - Current users count:', users.length)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const isActive = searchParams.get('isActive')

    // Filter users
    let filteredUsers = [...users]
    
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    
    if (isActive !== null && isActive !== '') {
      const active = isActive === 'true'
      filteredUsers = filteredUsers.filter(user => user.isActive === active)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    console.log('Returning:', paginatedUsers.length, 'users')
    
    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Create new user
export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('Creating user with data:', body)
    
    // Validation
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Email, name, and role are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const emailExists = users.some(user => user.email === body.email)
    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create new user ID (simple increment for demo)
    const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString()
    
    // Create new user
    const newUser = {
      id: newId,
      email: body.email,
      name: body.name,
      role: body.role.toUpperCase(),
      department: body.department || '',
      phone: body.phone || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString()
    }

    // Add to users array
    users.push(newUser)
    console.log('User created. Total users now:', users.length, 'New ID:', newId)

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
