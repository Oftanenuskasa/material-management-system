import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  
  return NextResponse.json(
    { 
      error: error || 'Authentication error',
      message: 'Please check your credentials and try again.'
    },
    { status: 400 }
  );
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  
  return NextResponse.json(
    { 
      error: body.error || 'Authentication failed',
      message: 'Please check your credentials and try again.'
    },
    { status: 400 }
  );
}
