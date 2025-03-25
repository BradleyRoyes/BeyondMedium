import { type NextRequest } from 'next/server';
import { getCustomEmails } from '@/lib/db';

// Simple middleware to check admin token
// In production, use a proper auth middleware
const validateAdminToken = (request: NextRequest): boolean => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) return false;
  
  // Very basic validation - in production use proper JWT validation
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [username] = decoded.split(':');
    return username === 'adnim';
  } catch {
    return false;
  }
};

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Validate admin token
    if (!validateAdminToken(request)) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get all custom emails
    const emails = getCustomEmails();
    
    // Return emails
    return Response.json({
      success: true,
      data: emails
    });
  } catch (error) {
    console.error('Error fetching custom emails:', error);
    
    return Response.json(
      { 
        success: false, 
        message: 'Failed to fetch custom emails'
      },
      { status: 500 }
    );
  }
} 