import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

const roleHierarchy = { USER: 1, STAFF: 2, MANAGER: 3, ADMIN: 4 }
const hasRoleAtLeast = (userRole, requiredRole) =>
  (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)

async function requireManagerOrAdmin() {
  const session = await getSession()
  if (!session) return { ok: false, res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  // assuming session contains role from setSession(userId, role)
  const role = session.role
  if (!hasRoleAtLeast(role, 'MANAGER')) {
    return { ok: false, res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { ok: true, session }
}

// GET user by ID
export async function GET(request, { params }) {
  const auth = await requireManagerOrAdmin()
  if (!auth.ok) return auth.res

  const { id } = params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}

// UPDATE user
export async function PUT(request, { params }) {
  const auth = await requireManagerOrAdmin()
  if (!auth.ok) return auth.res

  const { id } = params
  const body = await request.json()

  try {
    // prevent duplicate emails
    if (body.email) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } })
      if (existing && existing.id !== id) {
        return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 })
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        department: body.department,
        phone: body.phone,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updated,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}

// TOGGLE active status
export async function DELETE(request, { params }) {
  const auth = await requireManagerOrAdmin()
  if (!auth.ok) return auth.res

  const { id } = params

  try {
    const current = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    })

    if (!current) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const newStatus = !current.isActive

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: newStatus },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updated,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ success: false, error: 'Failed to update user status' }, { status: 500 })
  }
}