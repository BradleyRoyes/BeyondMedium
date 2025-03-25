// Script to set up Supabase database tables using SQL API
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupSupabaseTables() {
  console.log('Setting up Supabase database tables via SQL API...');
  
  // Check if credentials are available
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found in environment variables');
    process.exit(1);
  }
  
  console.log('✓ Found Supabase credentials in environment variables');
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // SQL to create tables
  const createTablesSql = `
    -- Create waitlist entries table if it doesn't exist
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      responded BOOLEAN NOT NULL DEFAULT FALSE,
      conversations JSONB NOT NULL DEFAULT '[]'::jsonb
    );
    
    -- Create indexes for waitlist_entries table
    CREATE INDEX IF NOT EXISTS waitlist_entries_email_idx ON waitlist_entries (email);
    CREATE INDEX IF NOT EXISTS waitlist_entries_responded_idx ON waitlist_entries (responded);
    
    -- Create custom emails table if it doesn't exist
    CREATE TABLE IF NOT EXISTS custom_emails (
      id TEXT PRIMARY KEY,
      to TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL
    );
    
    -- Create index for custom_emails table
    CREATE INDEX IF NOT EXISTS custom_emails_to_idx ON custom_emails (to);
  `;
  
  try {
    // Execute the SQL
    console.log('Creating tables via SQL...');
    
    const { error } = await supabase.rpc('pgql', { query: createTablesSql });
    
    if (error) {
      console.error('❌ Error creating tables:', error);
      // Try an alternative approach if the first one fails
      console.log('Trying alternative approach...');
      
      // Split SQL into separate statements
      const statements = createTablesSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // Execute each statement separately
      for (const stmt of statements) {
        const { error } = await supabase.rpc('pgql', { query: stmt });
        if (error) {
          console.error(`❌ Error executing statement: ${stmt}`, error);
        } else {
          console.log(`✓ Executed: ${stmt.substring(0, 50)}...`);
        }
      }
    } else {
      console.log('✓ Tables created successfully');
    }
    
    // Test connection by inserting and retrieving a record
    console.log('\nTesting database connection...');
    
    // Test record ID
    const testId = 'test_connection';
    
    // Insert test record
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
            message: 'This is a test record',
            timestamp: new Date().toISOString()
          }
        ]
      });
    
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
    } else {
      console.log('✓ Test record inserted successfully');
      
      // Retrieve test record
      const { data, error: selectError } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (selectError) {
        console.error('❌ Error retrieving test record:', selectError);
      } else {
        console.log('✓ Test record retrieved successfully:', data.email);
        
        // Delete test record
        const { error: deleteError } = await supabase
          .from('waitlist_entries')
          .delete()
          .eq('id', testId);
        
        if (deleteError) {
          console.error('❌ Error deleting test record:', deleteError);
        } else {
          console.log('✓ Test record deleted successfully');
        }
      }
    }
    
    console.log('\n✅ Supabase setup complete!');
    console.log('You can now use the database in your application.');
    
  } catch (error) {
    console.error('❌ Error setting up Supabase tables:', error);
    process.exit(1);
  }
}

setupSupabaseTables().catch(console.error); 