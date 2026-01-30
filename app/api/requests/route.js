import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('POST /api/requests called');
  
  try {
    const data = await request.json();
    console.log('Request data:', data);
    
    // Simple success response
    return NextResponse.json({
      success: true,
      message: 'Request received successfully',
      data: {
        ...data,
        id: 'test-' + Date.now(),
        status: 'PENDING',
        requestedAt: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  console.log('GET /api/requests called');
  return NextResponse.json([]);
}
