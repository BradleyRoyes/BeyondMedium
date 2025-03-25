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
      html: '<p>This is a test email from the Resend API test script</p><p>If you have questions, please reply to this email or contact connect@beyondmedium.com directly.</p>',
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