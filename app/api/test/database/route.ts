import { type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCustomEmails, recordCustomEmail } from '@/lib/db';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Check the structure of the custom_emails table in Supabase
    const { data: customEmailsStructure, error: customEmailsError } = await supabase
      .from('custom_emails')
      .select('*')
      .limit(1);
    
    // Attempt to add a test email to local storage and Supabase
    const testEmail = recordCustomEmail(
      'test@example.com',
      'Test Email from Diagnostic API',
      'This is a test message sent via the diagnostic API.'
    );
    
    // Fetch all emails from both local storage and Supabase
    const allEmails = await getCustomEmails();
    
    // Return diagnostic information
    return Response.json({
      success: true,
      customEmailsTable: {
        structure: customEmailsStructure,
        error: customEmailsError
      },
      testEmail: testEmail,
      allEmails: allEmails,
      supabaseConfigured: process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? true : false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in database test endpoint:', error);
    return Response.json({ 
      success: false, 
      message: 'Error in database test',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 