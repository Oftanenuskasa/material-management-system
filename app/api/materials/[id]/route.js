import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// Helper to get params properly in Next.js 14
async function getParams(request) {
  const url = new URL(request.url)
  const pathSegments = url.pathname.split('/')
  const id = pathSegments[pathSegments.length - 1]
  return { id }
}

// GET single material by ID
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await getParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching material with ID:', id)

    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        }
      }
    })

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: material
    })

  } catch (error) {
    console.error('❌ Material fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT update material (Admin only)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await getParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    console.log('✏️ Updating material with ID:', id)

    const data = await request.json()

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // If updating SKU, check if new SKU already exists
    if (data.sku && data.sku !== existingMaterial.sku) {
      const skuExists = await prisma.material.findUnique({
        where: { sku: data.sku }
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Update material
    const material = await prisma.material.update({
      where: { id },
      data: {
        ...data,
        quantity: data.quantity !== undefined ? parseInt(data.quantity) : undefined,
        minStockLevel: data.minStockLevel !== undefined ? parseInt(data.minStockLevel) : undefined,
        unitPrice: data.unitPrice !== undefined ? parseFloat(data.unitPrice) : undefined,
        updatedById: session.user.id
      },
      include: {
        updatedBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: material,
      message: 'Material updated successfully'
    })

  } catch (error) {
    console.error('❌ Material update error:', error)
    return NextResponse.json(
      { error: 'Failed to update material: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE material (Admin only)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await getParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting material with ID:', id)

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id }
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if material has requests
    const hasRequests = await prisma.materialRequest.count({
      where: { materialId: id }
    }) > 0

    if (hasRequests) {
      // Soft delete by changing status instead of hard delete
      await prisma.material.update({
        where: { id },
        data: { 
          status: 'DISCONTINUED',
          updatedById: session.user.id 
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Material marked as discontinued (has related requests)'
      })
    }

    // Hard delete if no requests
    await prisma.material.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    })

  } catch (error) {
    console.error('❌ Material delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete material: ' + error.message },
      { status: 500 }
    )
  }
}
