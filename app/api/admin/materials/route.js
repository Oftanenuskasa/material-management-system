import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler - NO AUTH
export async function GET() {
  try {
    console.log('GET /api/admin/materials - No auth')
    
    const materials = await prisma.material.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: materials
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
    console.log('POST /api/admin/materials - No auth')
    
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
        message: 'Name and SKU required'
      }, { status: 400 })
    }
    
    const existing = await prisma.material.findUnique({
      where: { sku }
    })
    
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'SKU exists'
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
      message: 'Created',
      data: newMaterial
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
