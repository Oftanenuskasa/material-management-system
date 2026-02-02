import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler - NO AUTH AT ALL
export async function GET() {
  try {
    console.log('GET /api/materials - No auth required')
    
    const materials = await prisma.material.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        unit: true,
        category: true,
        supplier: true,
        description: true,
        location: true,
        unitPrice: true,
        minStockLevel: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: materials
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch materials'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST handler - NO AUTH AT ALL
export async function POST(request) {
  try {
    console.log('POST /api/materials - No auth required')
    
    const body = await request.json()
    console.log('Body:', body)
    
    const { 
      name, 
      sku, 
      description = '', 
      quantity = 0, 
      unit = 'pieces', 
      unitPrice = 0, 
      category = '', 
      supplier = '', 
      location = '', 
      minStockLevel = 10 
    } = body
    
    if (!name || !sku) {
      return NextResponse.json({
        success: false,
        message: 'Name and SKU are required'
      }, { status: 400 })
    }
    
    // Check if SKU exists
    const existing = await prisma.material.findUnique({
      where: { sku }
    })
    
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'SKU already exists'
      }, { status: 400 })
    }
    
    const newMaterial = await prisma.material.create({
      data: {
        name,
        sku,
        description,
        quantity: parseInt(quantity) || 0,
        unit,
        unitPrice: parseFloat(unitPrice) || 0,
        category,
        supplier,
        location,
        minStockLevel: parseInt(minStockLevel) || 10
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Material created',
      data: newMaterial
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({
      success: false,
      message: 'Error: ' + error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
