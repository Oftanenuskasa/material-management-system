// app/api/chat/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json()
    
    // Get userId from request body
    const userId = body.userId
    
    // Check if userId exists in the request
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId in request body' },
        { status: 400 }
      )
    }
    
    // Now you can process the chat with the userId from the request body
    const { message } = body
    
    // Check if message exists
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Your chat processing logic here
    // For example, save to database or process with AI
    
    // Simulate processing
    const processedMessage = {
      id: Date.now(),
      userId: userId,
      message: message,
      timestamp: new Date().toISOString(),
      response: `Received your message: "${message}"`
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: processedMessage,
      message: 'Chat message processed successfully'
    }, { status: 200 })
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONAL: Add GET method if needed
export async function GET(req) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      )
    }
    
    // Return chat history for the user
    return NextResponse.json({
      success: true,
      userId: userId,
      messages: [],
      message: 'Chat history retrieved'
    }, { status: 200 })
    
  } catch (error) {
    console.error('GET Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}