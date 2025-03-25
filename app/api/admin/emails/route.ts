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
    
    // Get custom emails
    const emails = await getCustomEmails();
    
    // Return emails
    return Response.json(
      { success: true, data: emails },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching custom emails:', error);
    
    return Response.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch emails'
      },
      { status: 500 }
    );
  }
} 