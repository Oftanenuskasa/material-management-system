import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { materialSchema } from '@/schemas/material'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    // Return as array for compatibility
    return NextResponse.json(materials)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const validatedData = materialSchema.parse(body)

    const material = await prisma.material.create({
      data: validatedData,
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}
