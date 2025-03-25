import { type NextRequest } from 'next/server';
import { getWaitlistEntries } from '@/lib/db';

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
    
    // Get all waitlist entries
    const entries = getWaitlistEntries();
    
    // Return entries
    return Response.json({
      success: true,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    
    return Response.json(
      { 
        success: false, 
        message: 'Failed to fetch waitlist entries'
      },
      { status: 500 }
    );
  }
}

// Add a POST route to handle the response requests from the admin panel
export async function POST(request: NextRequest): Promise<Response> {
  // Forward to the proper respond route
  try {
    // Check URL to see if this is a respond request
    const url = new URL(request.url);
    
    if (url.pathname === '/api/admin/waitlist/respond') {
      // Forward this request to the respond route handler
      const respondRoute = await import('./respond/route');
      return respondRoute.POST(request);
    }
    
    // If it's not a respond request, return 404
    return Response.json(
      { success: false, message: 'Endpoint not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error forwarding request:', error);
    
    return Response.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to handle request'
      },
      { status: 500 }
    );
  }
} 