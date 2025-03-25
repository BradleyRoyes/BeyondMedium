// Script to check for entries in the Supabase waitlist table
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkWaitlistEntries() {
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
    console.log('\nQuerying waitlist table for recent entries...');
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error querying waitlist table:', error);
      process.exit(1);
    }
    
    console.log(`✓ Found ${data.length} entries in the waitlist table:`);
    data.forEach((entry, index) => {
      console.log(`\n--- Entry ${index + 1} ---`);
      console.log(`ID: ${entry.id}`);
      console.log(`Email: ${entry.email}`);
      console.log(`Created At: ${entry.created_at}`);
    });
    
    // Checking for test entry
    console.log('\nChecking for specific test entry...');
    const { data: testEntries, error: testError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', 'test-api@example.com');
    
    if (testError) {
      console.error('❌ Error checking for test entry:', testError);
    } else if (testEntries.length > 0) {
      console.log(`✓ Found ${testEntries.length} entries with email 'test-api@example.com'`);
      testEntries.forEach((entry, index) => {
        console.log(`\n--- Test Entry ${index + 1} ---`);
        console.log(`ID: ${entry.id}`);
        console.log(`Created At: ${entry.created_at}`);
      });
    } else {
      console.log('❌ No entries found with the test email');
    }
    
  } catch (error) {
    console.error('❌ Error checking waitlist entries:', error);
    process.exit(1);
  }
}

checkWaitlistEntries().catch(console.error); 