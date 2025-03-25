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
    // Skip domain verification check since we're using a restricted API key
    console.log('Using Resend\'s verified domain for testing');
    
    // Test sending an email to the verified owner email
    console.log('Sending test email...');
    const testEmail = await resend.emails.send({
      from: 'Beyond Medium <onboarding@resend.dev>',
      to: ['bradroyes@gmail.com'], // The verified owner email
      subject: 'Resend API Test',
      html: '<p>This is a test email from the Resend API test script</p>',
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