import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { materialUpdateSchema } from '@/lib/validations/material'

const prisma = new PrismaClient()

// GET single material by ID
export async function GET(request, { params }) {
  try {
    // Await the params Promise
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }
    
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
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
    console.error('Error fetching material:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update material
export async function PUT(request, { params }) {
  try {
    // Await the params Promise
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Validate update data
    const validatedData = materialUpdateSchema.parse(body)
    
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
    
    // If SKU is being updated, check if new SKU already exists (excluding current material)
    if (validatedData.sku && validatedData.sku !== existingMaterial.sku) {
      const skuExists = await prisma.material.findFirst({
        where: {
          sku: validatedData.sku,
          id: { not: id }
        }
      })
      
      if (skuExists) {
        return NextResponse.json(
          { error: 'Another material with this SKU already exists' },
          { status: 400 }
        )
      }
    }
    
    // Update material
    const updatedMaterial = await prisma.material.update({
      where: { id },
      data: validatedData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Material updated successfully',
      data: updatedMaterial
    })
    
  } catch (error) {
    console.error('Error updating material:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update material', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete material
export async function DELETE(request, { params }) {
  try {
    // Await the params Promise
    const { id } = await params
    console.log('Deleting material with ID:', id)
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }
    
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
    
    console.log('Found material to delete:', existingMaterial.name)
    
    // Delete material
    await prisma.material.delete({
      where: { id }
    })
    
    console.log('Material deleted successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material', details: error.message },
      { status: 500 }
    )
  }
}
