import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-change-this'

export async function getSession() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader) return null

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    
    return decoded
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}
