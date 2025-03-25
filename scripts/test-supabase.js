// Script to test Supabase connection and operations
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Table names matching what you created in Supabase
const WAITLIST_TABLE = 'waitlist';
const CUSTOM_EMAILS_TABLE = 'custom_emails';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Check if credentials are available
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found in environment variables');
    process.exit(1);
  }
  
  console.log('✓ Found Supabase credentials in environment variables');
  console.log(`URL: ${supabaseUrl}`);
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test the waitlist table structure first
    console.log('\nGetting structure of waitlist table...');
    const { data: waitlistFields, error: waitlistError } = await supabase
      .from(WAITLIST_TABLE)
      .select('*')
      .limit(1);
    
    if (waitlistError) {
      console.error('❌ Error getting waitlist table structure:', waitlistError);
    } else {
      console.log('✓ Successfully queried waitlist table');
      // If we have data, show the column structure
      if (waitlistFields && waitlistFields.length > 0) {
        console.log('✓ Columns available:', Object.keys(waitlistFields[0]).join(', '));
      } else {
        console.log('ℹ️ No data in the table yet');
      }
    }
    
    // First try inserting with minimal data
    console.log('\nTrying minimal insert to waitlist table...');
    // Use a numeric ID since that seems to be the expected type based on previous error
    const testNumericId = Math.floor(Math.random() * 1000000);
    const minimalEntry = {
      created_at: new Date().toISOString(),
      email: 'test@example.com' // Include required email field
    };
    
    const { data: minInsertData, error: minInsertError } = await supabase
      .from(WAITLIST_TABLE)
      .insert(minimalEntry)
      .select();
    
    if (minInsertError) {
      console.error('❌ Error with minimal insert:', minInsertError);
      
      // Try insert without an ID (let it be auto-generated)
      console.log('Trying with no ID (auto-generated)...');
      const { data: autoIdData, error: autoIdError } = await supabase
        .from(WAITLIST_TABLE)
        .insert({ email: 'test@example.com' }) // Include required email field
        .select();
      
      if (autoIdError) {
        console.error('❌ Error with auto-generated ID insert:', autoIdError);
        console.log('RLS policies may be preventing inserts. Check your Supabase dashboard.');
      } else {
        console.log('✓ Insert with auto-generated ID successful!');
        console.log('Record:', autoIdData);
        
        if (autoIdData && autoIdData.length > 0) {
          // Try to delete the test record
          const { error: deleteError } = await supabase
            .from(WAITLIST_TABLE)
            .delete()
            .eq('id', autoIdData[0].id);
          
          if (deleteError) {
            console.error('❌ Error deleting test record:', deleteError);
          } else {
            console.log('✓ Test record deleted successfully');
          }
        }
      }
    } else {
      console.log('✓ Minimal insert successful!');
      console.log('Record:', minInsertData);
      
      if (minInsertData && minInsertData.length > 0) {
        // Try to delete the test record
        const { error: deleteError } = await supabase
          .from(WAITLIST_TABLE)
          .delete()
          .eq('id', minInsertData[0].id);
        
        if (deleteError) {
          console.error('❌ Error deleting test record:', deleteError);
        } else {
          console.log('✓ Test record deleted successfully');
        }
      }
    }
    
    // Check the custom_emails table structure
    console.log('\nGetting structure of custom_emails table...');
    const { data: emailsFields, error: emailsError } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .select('*')
      .limit(1);
    
    if (emailsError) {
      console.error('❌ Error getting custom_emails table structure:', emailsError);
    } else {
      console.log('✓ Successfully queried custom_emails table');
      // If we have data, show the column structure
      if (emailsFields && emailsFields.length > 0) {
        console.log('✓ Columns available:', Object.keys(emailsFields[0]).join(', '));
      } else {
        console.log('ℹ️ No data in the table yet');
      }
    }
    
    // First try inserting with minimal data
    console.log('\nTrying minimal insert to custom_emails table...');
    const minimalEmail = {
      created_at: new Date().toISOString(),
      email: 'test@example.com', // Include required email field
      subject: 'Test Subject'    // Include subject field
    };
    
    const { data: minEmailInsertData, error: minEmailInsertError } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .insert(minimalEmail)
      .select();
    
    if (minEmailInsertError) {
      console.error('❌ Error with minimal insert:', minEmailInsertError);
      
      // Try insert without an ID (let it be auto-generated)
      console.log('Trying with no ID (auto-generated)...');
      const { data: autoIdData, error: autoIdError } = await supabase
        .from(CUSTOM_EMAILS_TABLE)
        .insert({ 
          email: 'test@example.com', 
          subject: 'Test Subject' 
        })
        .select();
      
      if (autoIdError) {
        console.error('❌ Error with auto-generated ID insert:', autoIdError);
        console.log('RLS policies may be preventing inserts. Check your Supabase dashboard.');
      } else {
        console.log('✓ Insert with auto-generated ID successful!');
        console.log('Record:', autoIdData);
        
        if (autoIdData && autoIdData.length > 0) {
          // Try to delete the test record
          const { error: deleteError } = await supabase
            .from(CUSTOM_EMAILS_TABLE)
            .delete()
            .eq('id', autoIdData[0].id);
          
          if (deleteError) {
            console.error('❌ Error deleting test record:', deleteError);
          } else {
            console.log('✓ Test record deleted successfully');
          }
        }
      }
    } else {
      console.log('✓ Minimal insert successful!');
      console.log('Record:', minEmailInsertData);
      
      if (minEmailInsertData && minEmailInsertData.length > 0) {
        // Try to delete the test record
        const { error: deleteError } = await supabase
          .from(CUSTOM_EMAILS_TABLE)
          .delete()
          .eq('id', minEmailInsertData[0].id);
        
        if (deleteError) {
          console.error('❌ Error deleting test record:', deleteError);
        } else {
          console.log('✓ Test record deleted successfully');
        }
      }
    }
    
    console.log('\n✅ Supabase connection test complete!');
    console.log('If you encountered RLS errors, you need to set up the appropriate RLS policies in your Supabase dashboard.');
    
  } catch (error) {
    console.error('❌ Error testing Supabase connection:', error);
    process.exit(1);
  }
}

testSupabaseConnection().catch(console.error); 