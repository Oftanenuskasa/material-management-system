import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify JWT:', error)
    return null
  }
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ userId, role, expires })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<{ userId: string; role: string } | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) return null
  
  const payload = await decrypt(session)
  if (!payload) return null
  
  return {
    userId: payload.userId as string,
    role: payload.role as string
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
