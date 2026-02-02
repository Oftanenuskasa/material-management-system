import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler - NO AUTH
export async function GET() {
  try {
    console.log('GET /api/requests - No auth')
    
    const requests = await prisma.request.findMany({
      include: {
        material: {
          select: {
            name: true,
            sku: true,
            unit: true
          }
        },
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const formatted = requests.map(request => ({
      id: request.id,
      material: {
        name: request.material?.name || 'Unknown',
        sku: request.material?.sku || 'N/A',
        unit: request.material?.unit || 'units'
      },
      user: {
        name: request.user?.name || 'Unknown',
        role: request.user?.role || 'WORKER'
      },
      quantity: request.quantity,
      purpose: request.purpose,
      urgency: request.urgency || 'MEDIUM',
      requestedAt: request.createdAt.toISOString().split('T')[0],
      status: request.status
    }))
    
    return NextResponse.json({
      success: true,
      data: formatted
    }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST handler - NO AUTH
export async function POST(request) {
  try {
    console.log('POST /api/requests - No auth')
    
    const body = await request.json()
    console.log('Body:', body)
    
    const { materialId, quantity, purpose, urgency = 'MEDIUM' } = body
    
    if (!materialId || !quantity || !purpose) {
      return NextResponse.json({
        success: false,
        message: 'Missing fields'
      }, { status: 400 })
    }
    
    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid quantity'
      }, { status: 400 })
    }
    
    const material = await prisma.material.findUnique({
      where: { id: materialId }
    })
    
    if (!material) {
      return NextResponse.json({
        success: false,
        message: 'Material not found'
      }, { status: 404 })
    }
    
    // Get or create default user
    let user = await prisma.user.findFirst({
      where: { email: 'worker@material.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'worker@material.com',
          name: 'Worker',
          role: 'WORKER',
          password: 'worker123'
        }
      })
    }
    
    const newRequest = await prisma.request.create({
      data: {
        materialId,
        userId: user.id,
        quantity: quantityNum,
        purpose,
        urgency,
        status: 'PENDING'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Request created',
      data: {
        id: newRequest.id,
        material: {
          name: material.name,
          sku: material.sku,
          unit: material.unit
        },
        user: {
          name: user.name,
          role: user.role
        },
        quantity: newRequest.quantity,
        purpose: newRequest.purpose,
        urgency: newRequest.urgency,
        requestedAt: newRequest.createdAt.toISOString().split('T')[0],
        status: newRequest.status
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error: ' + error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
