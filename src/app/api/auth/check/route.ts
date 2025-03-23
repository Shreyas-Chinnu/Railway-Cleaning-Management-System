import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value || '';
    const userRole = (await cookieStore).get('userRole')?.value || '';

    if (!token || !userRole) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated'
      });
    }

    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET) as JWTPayload;
      
      return NextResponse.json({
        authenticated: true,
        user: {
          email: decoded.email,
          role: userRole
        }
      });
    } catch (error) {
      // Token verification failed
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 