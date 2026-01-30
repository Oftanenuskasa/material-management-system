import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single material
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id }
    })
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(material)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    )
  }
}

// PUT - Update material
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        quantity: parseInt(body.quantity) || 0,
        unit: body.unit,
        unitPrice: parseFloat(body.unitPrice) || 0,
        category: body.category,
        supplier: body.supplier,
        location: body.location,
        minStockLevel: parseInt(body.minStockLevel) || 10
      }
    })
    
    return NextResponse.json(material)
  } catch (error: any) {
    console.error('PUT Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update material' },
      { status: 500 }
    )
  }
}

// DELETE - Delete material
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.material.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete material' },
      { status: 500 }
    )
  }
}
