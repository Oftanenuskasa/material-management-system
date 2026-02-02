import { NextResponse } from 'next/server'

export async function GET() {
  console.log('GET /api/test - Working!')
  return NextResponse.json({
    success: true,
    message: 'Test endpoint is working!',
    timestamp: new Date().toISOString(),
    note: 'No authentication required'
  })
}

export async function POST(request) {
  console.log('POST /api/test - Working!')
  const body = await request.json()
  return NextResponse.json({
    success: true,
    message: 'POST is working!',
    data: body,
    timestamp: new Date().toISOString()
  })
}
