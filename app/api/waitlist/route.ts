import { type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { EmailResponse } from '@/lib/types';
import { addWaitlistEntry } from '@/lib/db';

// Create a simple guard for demo mode
const isDemoMode = () => {
  return !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'demo';
};

// Use verified domain for email sending
const getSenderEmail = () => {
  return 'Beyond Medium <connect@updates.beyondmedium.com>';
};

// Admin notification email
const getAdminEmail = () => {
  return 'connect@beyondmedium.com';
};

// Contact email for users to reply to
const getReplyToEmail = () => {
  return 'connect@beyondmedium.com';
};

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required' } as EmailResponse,
        { status: 400 }
      );
    }

    // Store this submission in our database
    const entry = await addWaitlistEntry(email);

    // Initialize Resend with API key (or dummy key for demo mode)
    const resend = new Resend(process.env.RESEND_API_KEY || 'demo');
    
    // Handle different modes
    if (isDemoMode()) {
      console.log('⚠️ Running in DEMO mode. No actual emails will be sent.');
      console.log(`Would have sent welcome email to: ${email}`);
      console.log(`Would have sent notification email to: ${getAdminEmail()}`);
      
      // Return success response
      return Response.json(
        { success: true, message: 'Subscription successful (demo mode)' } as EmailResponse,
        { status: 200 }
      );
    }
    
    try {
      // Get the sender email
      const senderEmail = getSenderEmail();
      const replyToEmail = getReplyToEmail();
      
      // HTML template for subscriber confirmation
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #e0e0e0; background-color: #000; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; font-weight: 300; margin-bottom: 5px; font-size: 28px;">BEYOND</h1>
            <h2 style="color: white; font-weight: 300; margin-top: 0; font-size: 22px;">MEDIUM</h2>
          </div>
          
          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 5px; border: 1px solid #333;">
            <h2 style="color: #a4c2c2; font-weight: 300; margin-top: 0; text-align: center; font-size: 24px;">Welcome to the Waitlist</h2>
            
            <div style="color: #e0e0e0; font-weight: 300; line-height: 1.6; font-size: 16px;">
              <p>Thank you for joining the BeyondMedium waitlist!</p>
              <p>We're excited to have you on board. We'll keep you updated on our progress and let you know when we're ready to launch.</p>
              <p>Stay tuned for more information coming soon.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p style="color: #666;">© ${new Date().getFullYear()} BeyondMedium. All rights reserved.</p>
            <p style="color: #666;">Berlin, Germany</p>
            <div style="margin-top: 15px; padding: 10px; background-color: #111; border-radius: 5px; border: 1px solid #333;">
              <p style="font-size: 13px; color: #a4c2c2; margin: 0;">Questions? <strong>Reply directly to this email</strong> or contact us at <a href="mailto:${replyToEmail}" style="color: #a4c2c2; text-decoration: underline;">${replyToEmail}</a></p>
            </div>
          </div>
        </div>
      `;
      
      // HTML template for admin notification
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Waitlist Signup</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>ID:</strong> ${entry.id}</p>
          </div>
          
          <div style="margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated notification from BeyondMedium.</p>
          </div>
        </div>
      `;
      
      // Send confirmation email to the user
      const userResult = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [email],
        subject: 'Welcome to the BeyondMedium Waitlist',
        text: `Thank you for joining the BeyondMedium waitlist!\n\nWe're excited to have you on board. We'll keep you updated on our progress and let you know when we're ready to launch.\n\nStay tuned for more information coming soon.\n\n---\nQuestions? Reply directly to this email or contact us at ${replyToEmail}`,
        html: userHtml,
        headers: {
          'X-Entity-Ref-ID': `waitlist-welcome-${entry.id}`, // Helps avoid duplicate emails
        },
      });
      
      // Log more details about the response
      console.log(`Welcome email sent to ${email} with ID: ${userResult?.data?.id || 'unknown'}`);
      if (!userResult?.data?.id) {
        console.warn('User email response details:', JSON.stringify(userResult));
      }
      
      // Send notification email to admin
      const adminResult = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [getAdminEmail()],
        subject: 'New BeyondMedium Waitlist Signup',
        html: adminHtml,
        headers: {
          'X-Entity-Ref-ID': `waitlist-notification-${entry.id}`, // Helps avoid duplicate emails
        },
      });
      
      // Log more details about the response
      console.log(`Notification email sent to admin with ID: ${adminResult?.data?.id || 'unknown'}`);
      if (!adminResult?.data?.id) {
        console.warn('Admin email response details:', JSON.stringify(adminResult));
      }
      
      // Return success response
      return Response.json(
        { success: true, message: 'Subscription successful' } as EmailResponse,
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Resend API Error:', emailError);
      
      // Even though email sending failed, the user was added to the waitlist
      return Response.json(
        { 
          success: true, 
          message: 'You have been added to the waitlist, but there was an issue sending confirmation emails.'
        } as EmailResponse,
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    return Response.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to join waitlist'
      } as EmailResponse,
      { status: 500 }
    );
  }
} 