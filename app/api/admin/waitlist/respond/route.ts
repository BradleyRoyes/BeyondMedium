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

// Use verified domain for email sending
const getSenderEmail = () => {
  return 'Beyond Medium <connect@updates.beyondmedium.com>';
};

// Contact email for users to reply to
const getReplyToEmail = () => {
  return 'connect@beyondmedium.com';
};

// Get appropriate recipient email based on environment
const getRecipientEmail = (email: string) => {
  // When testing, we can only send to the account owner's email when using Resend's free tier
  return process.env.NODE_ENV === 'production' 
    ? email 
    : 'bradroyes@gmail.com'; // The verified owner email
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
    const entry = await getWaitlistEntry(id);
    
    if (!entry) {
      return Response.json(
        { success: false, message: 'Waitlist entry not found' } as EmailResponse,
        { status: 404 }
      );
    }
    
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY || 'demo');
    
    // Get the sender email
    const senderEmail = getSenderEmail();
    const replyToEmail = getReplyToEmail();
    
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
          <div style="margin-top: 15px; padding: 10px; background-color: #111; border-radius: 5px; border: 1px solid #333;">
            <p style="font-size: 13px; color: #a4c2c2; margin: 0;">Questions? <strong>Do not reply to this email</strong>. Please contact us at <a href="mailto:${replyToEmail}" style="color: #a4c2c2; text-decoration: underline;">${replyToEmail}</a></p>
          </div>
        </div>
      </div>
    `;
    
    let emailResult;
    
    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log('⚠️ Running in DEMO mode. No actual emails will be sent.');
      console.log(`Would have sent waitlist response to: ${entry.email}`);
      console.log(`Subject: ${subject}`);
      emailResult = { data: { id: 'demo-mode' } };
    } else {
      try {
        // Send the actual response email through Resend
        emailResult = await resend.emails.send({
          from: senderEmail,
          reply_to: replyToEmail,
          to: [entry.email],
          subject,
          text: `${message}\n\n---\nQuestions? Do not reply to this email. Please contact us at ${replyToEmail}`,
          html: enhancedHtml,
          headers: {
            'X-Entity-Ref-ID': `waitlist-response-${id}-${Date.now()}`, // Helps avoid duplicate emails
          },
        });
        
        // Log more details about the response
        console.log(`Waitlist response sent to ${entry.email} with ID: ${emailResult?.data?.id || 'unknown'}`);
        if (!emailResult?.data?.id) {
          console.warn('Response email details:', JSON.stringify(emailResult));
        }
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
    const updatedEntry = await addResponseToEntry(id, subject, message);
    
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