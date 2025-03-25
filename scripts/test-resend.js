// Simple script to test Resend API integration
const { Resend } = require('resend');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testResendIntegration() {
  console.log('Starting Resend API test...');
  
  // Check if API key is available
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  console.log('✓ Found RESEND_API_KEY in environment variables');
  
  // Initialize Resend
  const resend = new Resend(apiKey);
  
  try {
    // Using verified domain
    console.log('Using verified domain updates.beyondmedium.com for testing');
    
    // Test sending an email
    console.log('Sending test email...');
    const testEmail = await resend.emails.send({
      from: 'Beyond Medium <connect@updates.beyondmedium.com>',
      reply_to: 'connect@beyondmedium.com',
      to: ['bradroyes@gmail.com'],
      subject: 'Resend API Test',
      text: 'This is a test email from the Resend API test script\n\n---\nIf you have questions, please reply to this email or contact connect@beyondmedium.com directly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #e0e0e0; background-color: #000; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; font-weight: 300; margin-bottom: 5px; font-size: 28px;">BEYOND</h1>
            <h2 style="color: white; font-weight: 300; margin-top: 0; font-size: 22px;">MEDIUM</h2>
          </div>
          
          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 5px; border: 1px solid #333;">
            <h2 style="color: #a4c2c2; font-weight: 300; margin-top: 0; text-align: center; font-size: 24px;">Resend API Test</h2>
            
            <div style="color: #e0e0e0; font-weight: 300; line-height: 1.6; font-size: 16px;">
              <p>This is a test email from the Resend API test script</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p style="color: #666;">© ${new Date().getFullYear()} BeyondMedium. All rights reserved.</p>
            <p style="color: #666;">Berlin, Germany</p>
            <div style="margin-top: 15px; padding: 10px; background-color: #111; border-radius: 5px; border: 1px solid #333;">
              <p style="font-size: 13px; color: #a4c2c2; margin: 0;">Questions? <strong>Reply directly to this email</strong> or contact us at <a href="mailto:connect@beyondmedium.com" style="color: #a4c2c2; text-decoration: underline;">connect@beyondmedium.com</a></p>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log('Test email result:', JSON.stringify(testEmail, null, 2));
    
    if (testEmail?.data?.id) {
      console.log('✅ Test successful! Email sent with ID:', testEmail.data.id);
    } else {
      console.error('❌ Test failed - no email ID returned');
    }
  } catch (error) {
    console.error('❌ Error during Resend API test:', error);
    process.exit(1);
  }
}

testResendIntegration().catch(console.error); 