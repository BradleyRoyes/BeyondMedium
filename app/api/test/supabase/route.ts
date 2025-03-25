import { type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Test basic connectivity
    console.log('Testing Supabase connection...');
    
    // Check if we can access the custom_emails table
    const { data: emailData, error: emailError } = await supabase
      .from('custom_emails')
      .select('*')
      .limit(5);
    
    if (emailError) {
      console.error('Error accessing custom_emails table:', emailError);
      return Response.json({ 
        success: false, 
        message: 'Error accessing custom_emails table',
        error: emailError
      }, { status: 500 });
    }
    
    // Get table structure information
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { tablename: 'custom_emails' })
      .select('*');
    
    // Try inserting a test record
    const testEmail = {
      email: 'test@example.com',
      subject: 'Test Subject',
      created_at: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('custom_emails')
      .insert(testEmail)
      .select();
    
    // If insert succeeded, delete the test record
    let deleteResult = null;
    let deleteError = null;
    
    if (insertData && insertData.length > 0) {
      const { data: deleteData, error: delError } = await supabase
        .from('custom_emails')
        .delete()
        .eq('id', insertData[0].id)
        .select();
      
      deleteResult = deleteData;
      deleteError = delError;
    }
    
    return Response.json({
      success: true,
      message: 'Supabase diagnostics completed',
      emailData,
      tableInfo: tableInfo || { note: 'RPC function not available or error', error: tableError },
      testInsert: {
        success: !insertError,
        data: insertData,
        error: insertError
      },
      testDelete: {
        success: !deleteError,
        data: deleteResult,
        error: deleteError
      }
    });
  } catch (error) {
    console.error('Error in Supabase test endpoint:', error);
    return Response.json({ 
      success: false, 
      message: 'Error in Supabase test',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 