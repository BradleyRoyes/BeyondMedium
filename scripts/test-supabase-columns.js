// Script to check the column structure of Supabase tables
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Table names
const WAITLIST_TABLE = 'waitlist';
const CUSTOM_EMAILS_TABLE = 'custom_emails';

async function checkTableColumns() {
  console.log('Checking Supabase table columns...');
  
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
  
  try {
    // Query PostgreSQL information schema to get column information
    console.log(`\nChecking columns for table '${WAITLIST_TABLE}'...`);
    const { data: waitlistColumns, error: waitlistError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', WAITLIST_TABLE)
      .eq('table_schema', 'public');
    
    if (waitlistError) {
      console.error(`❌ Error getting columns for '${WAITLIST_TABLE}':`, waitlistError);
    } else if (!waitlistColumns || waitlistColumns.length === 0) {
      console.log(`Table '${WAITLIST_TABLE}' might not exist or has no columns`);
    } else {
      console.log(`✓ Found ${waitlistColumns.length} columns in '${WAITLIST_TABLE}':`);
      waitlistColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    }
    
    // Check if we can do a simple select on the table
    console.log(`\nAttempting to select from '${WAITLIST_TABLE}'...`);
    const { data: waitlistData, error: waitlistSelectError } = await supabase
      .from(WAITLIST_TABLE)
      .select('*')
      .limit(1);
    
    if (waitlistSelectError) {
      console.error(`❌ Error selecting from '${WAITLIST_TABLE}':`, waitlistSelectError);
    } else {
      console.log(`✓ Successfully queried '${WAITLIST_TABLE}'`);
      if (waitlistData && waitlistData.length > 0) {
        console.log('  Sample record structure:', Object.keys(waitlistData[0]).join(', '));
      } else {
        console.log('  No records found in the table');
      }
    }
    
    // Try with the custom emails table too
    console.log(`\nChecking columns for table '${CUSTOM_EMAILS_TABLE}'...`);
    const { data: emailsColumns, error: emailsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', CUSTOM_EMAILS_TABLE)
      .eq('table_schema', 'public');
    
    if (emailsError) {
      console.error(`❌ Error getting columns for '${CUSTOM_EMAILS_TABLE}':`, emailsError);
    } else if (!emailsColumns || emailsColumns.length === 0) {
      console.log(`Table '${CUSTOM_EMAILS_TABLE}' might not exist or has no columns`);
    } else {
      console.log(`✓ Found ${emailsColumns.length} columns in '${CUSTOM_EMAILS_TABLE}':`);
      emailsColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    }
    
    // Check if we can do a simple select on the emails table
    console.log(`\nAttempting to select from '${CUSTOM_EMAILS_TABLE}'...`);
    const { data: emailsData, error: emailsSelectError } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .select('*')
      .limit(1);
    
    if (emailsSelectError) {
      console.error(`❌ Error selecting from '${CUSTOM_EMAILS_TABLE}':`, emailsSelectError);
    } else {
      console.log(`✓ Successfully queried '${CUSTOM_EMAILS_TABLE}'`);
      if (emailsData && emailsData.length > 0) {
        console.log('  Sample record structure:', Object.keys(emailsData[0]).join(', '));
      } else {
        console.log('  No records found in the table');
      }
    }
    
    // Try to insert minimal records with only the required fields
    console.log('\nTesting minimal insert to waitlist table...');
    const minimalEntry = {
      email: 'test@example.com',
      created_at: new Date().toISOString()
    };
    
    const { data: minInsertData, error: minInsertError } = await supabase
      .from(WAITLIST_TABLE)
      .insert(minimalEntry)
      .select();
    
    if (minInsertError) {
      console.error('❌ Error with minimal insert to waitlist table:', minInsertError);
    } else {
      console.log('✓ Successfully inserted minimal record into waitlist table');
      console.log('  Record:', minInsertData);
    }
    
    console.log('\nTesting minimal insert to custom_emails table...');
    const minimalEmail = {
      email: 'test@example.com',
      subject: 'Test Subject',
      created_at: new Date().toISOString()
    };
    
    const { data: minEmailInsertData, error: minEmailInsertError } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .insert(minimalEmail)
      .select();
    
    if (minEmailInsertError) {
      console.error('❌ Error with minimal insert to custom_emails table:', minEmailInsertError);
    } else {
      console.log('✓ Successfully inserted minimal record into custom_emails table');
      console.log('  Record:', minEmailInsertData);
    }
    
    console.log('\n✅ Table column check complete');
    
  } catch (error) {
    console.error('❌ Error checking table columns:', error);
    process.exit(1);
  }
}

checkTableColumns().catch(console.error); 