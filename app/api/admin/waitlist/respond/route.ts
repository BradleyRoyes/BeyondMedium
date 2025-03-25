import { type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { addResponseToEntry, getWaitlistEntry } from '@/lib/db';
import { EmailResponse } from '@/lib/types';

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

// Create a simple guard for demo mode
const isDemoMode = () => {
  return !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'demo';
};

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Validate admin token
    if (!validateAdminToken(request)) {
      return Response.json(
        { success: false, message: 'Unauthorized' } as EmailResponse,
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { id, subject, message } = body;
    
    if (!id || !subject || !message) {
      return Response.json(
        { success: false, message: 'ID, subject and message are required' } as EmailResponse,
        { status: 400 }
      );
    }
    
    // Get the waitlist entry
    const entry = getWaitlistEntry(id);
    
    if (!entry) {
      return Response.json(
        { success: false, message: 'Waitlist entry not found' } as EmailResponse,
        { status: 404 }
      );
    }
    
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY || 'demo');
    
    // Enhanced HTML template for admin responses with improved styling
    const enhancedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #e0e0e0; background-color: #000; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; font-weight: 300; margin-bottom: 5px; font-size: 28px;">BEYOND</h1>
          <h2 style="color: white; font-weight: 300; margin-top: 0; font-size: 22px;">MEDIUM</h2>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 25px; border-radius: 5px; border: 1px solid #333;">
          <h2 style="color: #a4c2c2; font-weight: 300; margin-top: 0; text-align: center; font-size: 24px;">${subject}</h2>
          
          <div style="color: #e0e0e0; font-weight: 300; line-height: 1.6; font-size: 16px;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #a4c2c2; font-style: italic;">The Beyond Medium Team</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p style="color: #666;">© ${new Date().getFullYear()} BeyondMedium. All rights reserved.</p>
          <p style="color: #666;">Berlin, Germany</p>
          <p style="margin-top: 15px; font-size: 11px; color: #555;">This email was sent in response to your waitlist sign-up</p>
        </div>
      </div>
    `;
    
    let emailResult;
    
    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log('⚠️ Running in DEMO mode. No actual emails will be sent.');
      console.log(`Would have sent waitlist response to: ${entry.email}`);
      console.log(`Subject: ${subject}`);
      emailResult = { id: 'demo-mode' };
    } else {
      try {
        // Send the actual response email through Resend
        emailResult = await resend.emails.send({
          from: 'Beyond Medium <connect@beyondmedium.com>',
          to: [entry.email],
          subject,
          text: message,
          html: enhancedHtml,
        });
        console.log(`Waitlist response sent to ${entry.email} from admin panel`);
      } catch (emailError) {
        console.error('Resend API Error:', emailError);
        return Response.json(
          { 
            success: false, 
            message: emailError instanceof Error ? 
              `Email sending failed: ${emailError.message}` : 
              'Failed to send email through Resend API'
          } as EmailResponse,
          { status: 500 }
        );
      }
    }
    
    // Add the response to the entry in our database
    const updatedEntry = addResponseToEntry(id, subject, message);
    
    if (!updatedEntry) {
      return Response.json(
        { 
          success: false, 
          message: 'Failed to update entry in database' 
        } as EmailResponse,
        { status: 500 }
      );
    }
    
    // Return success response
    return Response.json({
      success: true,
      message: 'Response sent successfully',
      data: {
        entry: updatedEntry,
        emailResult
      }
    });
  } catch (error) {
    console.error('Error sending response:', error);
    
    return Response.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send response'
      } as EmailResponse,
      { status: 500 }
    );
  }
} 