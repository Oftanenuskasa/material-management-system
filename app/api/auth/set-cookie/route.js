import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Create response with success message
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cookie set successfully' 
    })

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Set cookie error:', error)
    return NextResponse.json(
      { error: 'Failed to set cookie' },
      { status: 500 }
    )
  }
}
