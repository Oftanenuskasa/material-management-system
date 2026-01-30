import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Debug API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasPrisma: true
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
