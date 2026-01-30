import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('Materials API called');
    
    // First, return test data to ensure the API works
    const testMaterials = [
      {
        id: 'test-1',
        sku: 'TEST-001',
        name: 'Test Hammer',
        description: 'A test hammer',
        category: 'Tools',
        quantity: 25,
        unit: 'pieces',
        unitPrice: 15.99,
        supplier: 'Test Supplier',
        location: 'Warehouse A',
        minStockLevel: 5,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'test-2',
        name: 'Test Screwdriver',
        sku: 'TEST-002',
        description: 'A test screwdriver',
        category: 'Tools',
        quantity: 50,
        unit: 'pieces',
        unitPrice: 8.99,
        supplier: 'Test Supplier',
        location: 'Warehouse B',
        minStockLevel: 10,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Check query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let materials = testMaterials;
    
    if (status) {
      materials = materials.filter(m => m.status === status);
    }
    
    return NextResponse.json(materials);
    
  } catch (error) {
    console.error('Error in materials API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch materials', 
        details: error.message
      },
      { status: 500 }
    );
  }
}
