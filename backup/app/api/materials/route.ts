import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/materials called');
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(`✅ Found ${materials.length} materials`);
    return NextResponse.json(materials);
  } catch (error: any) {
    console.error('❌ GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔍 POST /api/materials called');
    
    // Parse the request body
    const data = await request.json();
    console.log('📦 Received data:', JSON.stringify(data, null, 2));
    
    // Basic validation
    if (!data.sku || !data.name) {
      console.log('❌ Validation failed: SKU or Name missing');
      return NextResponse.json(
        { error: 'SKU and Name are required' },
        { status: 400 }
      );
    }
    
    console.log('🔄 Creating material in database...');
    
    const material = await prisma.material.create({
      data: {
        sku: data.sku.toString().trim(),
        name: data.name.toString().trim(),
        description: data.description?.toString().trim() || null,
        quantity: parseInt(data.quantity) || 0,
        unit: data.unit?.toString().trim() || 'pieces',
        unitPrice: parseFloat(data.unitPrice) || 0,
        category: data.category?.toString().trim() || null,
        supplier: data.supplier?.toString().trim() || null,
        location: data.location?.toString().trim() || null,
        minStockLevel: parseInt(data.minStockLevel) || 10,
      },
    });
    
    console.log('✅ Material created successfully:', material.id);
    console.log('📊 Material details:', JSON.stringify(material, null, 2));
    
    return NextResponse.json(material, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ POST Error details:');
    console.error('  - Message:', error.message);
    console.error('  - Code:', error.code);
    console.error('  - Meta:', error.meta);
    console.error('  - Full error:', error);
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `SKU "${data?.sku}" already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create material',
        details: error.message,
        code: error.code,
        hint: 'Check server logs for more details'
      },
      { status: 500 }
    );
  }
}
