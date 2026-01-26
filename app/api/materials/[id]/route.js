import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { materialSchema } from '@/schemas/material'

const prisma = new PrismaClient()

// Helper function to parse params
async function parseParams(request) {
  const url = new URL(request.url)
  const pathSegments = url.pathname.split('/')
  const id = pathSegments[pathSegments.length - 1]
  return { id }
}

export async function GET(request) {
  try {
    const { id } = await parseParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    const material = await prisma.material.findUnique({
      where: { id },
    })

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error fetching material:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { id } = await parseParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = materialSchema.parse(body)

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id },
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    const material = await prisma.material.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error updating material:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { id } = await parseParams(request)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id },
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    await prisma.material.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Material deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting material:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}
