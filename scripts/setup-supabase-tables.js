// Script to set up Supabase database tables
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupSupabaseTables() {
  console.log('Setting up Supabase database tables...');
  
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
    // Create waitlist_entries table (checking if it exists first)
    console.log('Creating waitlist_entries table...');
    
    const { data: waitlistCheck, error: waitlistCheckError } = await supabase
      .from('waitlist_entries')
      .select('id')
      .limit(1);
    
    if (waitlistCheckError && waitlistCheckError.code === '42P01') {
      // Table doesn't exist, so create it using SQL
      console.log('waitlist_entries table does not exist, creating...');
      
      // Using REST API to create the table
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS waitlist_entries (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL,
              timestamp TIMESTAMPTZ NOT NULL,
              responded BOOLEAN NOT NULL DEFAULT FALSE,
              conversations JSONB NOT NULL DEFAULT '[]'::jsonb
            );
            
            CREATE INDEX IF NOT EXISTS waitlist_entries_email_idx ON waitlist_entries (email);
            CREATE INDEX IF NOT EXISTS waitlist_entries_responded_idx ON waitlist_entries (responded);
          `
        })
      });
      
      if (response.ok) {
        console.log('✓ waitlist_entries table created successfully');
      } else {
        console.error('❌ Error creating waitlist_entries table:', await response.text());
      }
    } else {
      console.log('✓ waitlist_entries table already exists');
    }
    
    // Create custom_emails table (checking if it exists first)
    console.log('Creating custom_emails table...');
    
    const { data: emailsCheck, error: emailsCheckError } = await supabase
      .from('custom_emails')
      .select('id')
      .limit(1);
    
    if (emailsCheckError && emailsCheckError.code === '42P01') {
      // Table doesn't exist, so create it using SQL
      console.log('custom_emails table does not exist, creating...');
      
      // Using REST API to create the table
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS custom_emails (
              id TEXT PRIMARY KEY,
              to TEXT NOT NULL,
              subject TEXT NOT NULL,
              message TEXT NOT NULL,
              timestamp TIMESTAMPTZ NOT NULL
            );
            
            CREATE INDEX IF NOT EXISTS custom_emails_to_idx ON custom_emails (to);
          `
        })
      });
      
      if (response.ok) {
        console.log('✓ custom_emails table created successfully');
      } else {
        console.error('❌ Error creating custom_emails table:', await response.text());
      }
    } else {
      console.log('✓ custom_emails table already exists');
    }
    
    // List available tables
    console.log('Listing available tables...');
    
    // Using the REST API to check tables
    const listTablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      })
    });
    
    if (listTablesResponse.ok) {
      const tables = await listTablesResponse.json();
      console.log('Tables in database:', tables.map(t => t.table_name).join(', '));
    } else {
      console.warn('Could not list tables:', await listTablesResponse.text());
    }
    
    console.log('✅ Supabase setup complete!');
    console.log('You can now use the database in your application.');
    
    // Try to check if connection is working by inserting and retrieving a test record
    console.log('\nTesting database connection...');
    
    // Use upsert to avoid duplicate key error on repeated runs
    const testId = 'test_connection_record';
    const { error: insertError } = await supabase
      .from('waitlist_entries')
      .upsert({
        id: testId,
        email: 'test@example.com',
        timestamp: new Date().toISOString(),
        responded: false,
        conversations: [
          {
            from: 'system',
            to: 'test@example.com',
            subject: 'Test Connection',
            message: 'This is a test record to verify database connection',
            timestamp: new Date().toISOString()
          }
        ]
      });
    
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
    } else {
      console.log('✓ Test record inserted successfully');
      
      // Retrieve the test record
      const { data: testRecord, error: retrieveError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (retrieveError) {
        console.error('❌ Error retrieving test record:', retrieveError);
      } else {
        console.log('✓ Test record retrieved successfully:', testRecord.email);
        
        // Clean up test record
        const { error: deleteError } = await supabase
          .from('waitlist_entries')
          .delete()
          .eq('id', testId);
        
        if (deleteError) {
          console.warn('Warning: Could not delete test record:', deleteError);
        } else {
          console.log('✓ Test record deleted successfully');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error setting up Supabase tables:', error);
    process.exit(1);
  }
}

setupSupabaseTables().catch(console.error); 