#!/usr/bin/env node

// Fix Supabase Tables Script
// This script attempts to fix the schema of Supabase tables to match our application's expectations

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixSupabaseTables() {
  console.log('Starting Supabase table fix script...');
  
  // Check credentials
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found in environment variables');
    process.exit(1);
  }
  
  console.log('✓ Found Supabase credentials in environment variables');
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check the custom_emails table
  console.log('\nChecking custom_emails table structure...');
  const { data: emailsData, error: emailsError } = await supabase
    .from('custom_emails')
    .select('*')
    .limit(1);
  
  if (emailsError) {
    console.error('❌ Error accessing custom_emails table:', emailsError);
    return;
  }
  
  console.log('✓ Successfully accessed custom_emails table');
  
  // Test insertion with our application structure
  const testRecord = {
    id: `test_fix_${Date.now()}`,
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message content from fix script',
    created_at: new Date().toISOString(),
  };
  
  console.log('\nTrying to insert test record with message field...');
  const { data: insertData, error: insertError } = await supabase
    .from('custom_emails')
    .insert(testRecord)
    .select();
  
  if (insertError) {
    // If we get an error about the message column not existing, we need to add it
    if (insertError.message && insertError.message.includes("message")) {
      console.log('❌ Message column missing from custom_emails table');
      
      // Try to add the column using SQL
      console.log('\nAttempting to add message column to custom_emails table...');
      try {
        // Using RPC to execute SQL (requires appropriate permissions)
        const { data: alterResult, error: alterError } = await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE custom_emails ADD COLUMN IF NOT EXISTS message TEXT'
        });
        
        if (alterError) {
          console.error('❌ Error adding message column:', alterError);
          
          console.log('\n⚠️ Manual fix required:');
          console.log('Please execute the following SQL in your Supabase dashboard:');
          console.log('ALTER TABLE custom_emails ADD COLUMN IF NOT EXISTS message TEXT;');
        } else {
          console.log('✓ Successfully added message column to custom_emails table');
        }
      } catch (error) {
        console.error('❌ Error executing SQL:', error);
      }
    } else {
      console.error('❌ Error inserting test record:', insertError);
    }
  } else {
    console.log('✓ Test record inserted successfully with ID:', insertData[0].id);
    
    // Clean up the test record
    console.log('\nCleaning up test record...');
    const { error: deleteError } = await supabase
      .from('custom_emails')
      .delete()
      .eq('id', insertData[0].id);
    
    if (deleteError) {
      console.error('❌ Error deleting test record:', deleteError);
    } else {
      console.log('✓ Test record deleted successfully');
    }
  }
  
  console.log('\n✅ Supabase table fix script completed');
}

// Run the function
fixSupabaseTables().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 