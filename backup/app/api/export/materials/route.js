import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    if (!materials || materials.length === 0) {
      return NextResponse.json(
        { error: 'No materials found' },
        { status: 404 }
      )
    }

    // Convert to CSV
    const headers = ['ID', 'Name', 'Description', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Supplier', 'Created At', 'Updated At', 'Total Value']
    
    const csvRows = materials.map(material => [
      material.id,
      `"${material.name.replace(/"/g, '""')}"`,
      `"${(material.description || '').replace(/"/g, '""')}"`,
      `"${material.category.replace(/"/g, '""')}"`,
      material.quantity,
      `"${material.unit}"`,
      material.unitPrice,
      `"${(material.supplier || '').replace(/"/g, '""')}"`,
      material.createdAt.toISOString(),
      material.updatedAt.toISOString(),
      (material.quantity * material.unitPrice).toFixed(2)
    ])

    const csv = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="materials_export.csv"',
      },
    })
  } catch (error) {
    console.error('Error exporting materials:', error)
    console.error('Error code:', error.code)
    
    // Handle specific Prisma errors
    if (error.code === 'P1001' || error.code === 'P1017') {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to export materials', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}
