import { type NextRequest } from 'next/server';

// Simple hardcoded credentials for demo
// In production, you would use a proper auth system and store these securely
const ADMIN_USERNAME = 'adnim'; // 'admin' backwards as specified
const ADMIN_PASSWORD = 'tillandbrad420';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a simple token - in production, use a proper JWT
      const token = Buffer.from(`${username}:${new Date().getTime()}`).toString('base64');
      
      return Response.json({
        success: true,
        token
      });
    }

    // Return error for invalid credentials
    return Response.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    
    return Response.json(
      { 
        success: false, 
        message: 'Authentication failed'
      },
      { status: 500 }
    );
  }
} 