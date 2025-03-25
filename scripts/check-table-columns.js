// Simple script to check Supabase table structure
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkTables() {
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
    // Try a simple query on each table
    console.log('\nAttempting to query the waitlist table...');
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1);
    
    if (waitlistError) {
      console.error('❌ Error querying waitlist table:', waitlistError);
    } else {
      console.log('✓ Successfully queried waitlist table');
      
      if (waitlistData && waitlistData.length > 0) {
        console.log('✓ Sample record from waitlist:');
        console.log(waitlistData[0]);
        console.log('✓ Columns available:', Object.keys(waitlistData[0]).join(', '));
      } else {
        console.log('ℹ️ No records found in waitlist table');
        
        // Try to insert a test record
        console.log('\nAttempting to insert a test record in waitlist...');
        
        const testRecord = {
          // Typical default columns for Supabase:
          created_at: new Date().toISOString(),
          id: Math.floor(Math.random() * 1000000).toString(),
          email: 'test@example.com'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('waitlist')
          .insert(testRecord)
          .select();
        
        if (insertError) {
          console.error('❌ Error inserting test record:', insertError);
          
          // Try with just id
          console.log('Trying with just id...');
          const { data: idOnlyData, error: idOnlyError } = await supabase
            .from('waitlist')
            .insert({ id: Math.floor(Math.random() * 1000000).toString() })
            .select();
            
          if (idOnlyError) {
            console.error('❌ Error inserting with just id:', idOnlyError);
          } else {
            console.log('✓ Success with minimal record');
            console.log('✓ Columns in table:', Object.keys(idOnlyData[0]).join(', '));
          }
        } else {
          console.log('✓ Test record inserted successfully!');
          console.log('✓ Columns in table:', Object.keys(insertData[0]).join(', '));
        }
      }
    }
    
    // Check custom_emails table
    console.log('\nAttempting to query the custom_emails table...');
    const { data: emailsData, error: emailsError } = await supabase
      .from('custom_emails')
      .select('*')
      .limit(1);
    
    if (emailsError) {
      console.error('❌ Error querying custom_emails table:', emailsError);
    } else {
      console.log('✓ Successfully queried custom_emails table');
      
      if (emailsData && emailsData.length > 0) {
        console.log('✓ Sample record from custom_emails:');
        console.log(emailsData[0]);
        console.log('✓ Columns available:', Object.keys(emailsData[0]).join(', '));
      } else {
        console.log('ℹ️ No records found in custom_emails table');
        
        // Try to insert a test record
        console.log('\nAttempting to insert a test record in custom_emails...');
        
        const testEmail = {
          // Typical default columns for Supabase:
          created_at: new Date().toISOString(),
          id: Math.floor(Math.random() * 1000000).toString(),
          email: 'test@example.com',
          subject: 'Test Subject'
        };
        
        const { data: insertEmailData, error: insertEmailError } = await supabase
          .from('custom_emails')
          .insert(testEmail)
          .select();
        
        if (insertEmailError) {
          console.error('❌ Error inserting test email record:', insertEmailError);
          
          // Try with just id
          console.log('Trying with just id...');
          const { data: idOnlyData, error: idOnlyError } = await supabase
            .from('custom_emails')
            .insert({ id: Math.floor(Math.random() * 1000000).toString() })
            .select();
            
          if (idOnlyError) {
            console.error('❌ Error inserting with just id:', idOnlyError);
          } else {
            console.log('✓ Success with minimal record');
            console.log('✓ Columns in table:', Object.keys(idOnlyData[0]).join(', '));
          }
        } else {
          console.log('✓ Test email record inserted successfully!');
          console.log('✓ Columns in table:', Object.keys(insertEmailData[0]).join(', '));
        }
      }
    }
  } catch (error) {
    console.error('General error:', error);
  }
}

checkTables(); 