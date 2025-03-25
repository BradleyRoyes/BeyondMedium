import { createClient } from '@supabase/supabase-js';
import { WaitlistEntry, CustomEmail } from './types';
import { v4 as uuidv4 } from 'uuid';

// Create a single supabase client for interacting with the database
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Falling back to local storage.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Simple check to see if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Update table names to match what you've created in Supabase
const WAITLIST_TABLE = 'waitlist';
const CUSTOM_EMAILS_TABLE = 'custom_emails';

// Flag to track if we've checked Supabase table access
let supabaseAccessChecked = false;
let canAccessSupabase = false;

// Function to check if we can actually access Supabase tables
export const checkSupabaseAccess = async (): Promise<boolean> => {
  if (supabaseAccessChecked) return canAccessSupabase;
  if (!isSupabaseConfigured()) return false;

  try {
    // Try to read from the waitlist table
    const { data, error } = await supabase
      .from(WAITLIST_TABLE)
      .select('*')
      .limit(1);
    
    // If we can read without error, mark as accessible
    if (!error) {
      console.log('✓ Successfully connected to Supabase and can read from tables');
      supabaseAccessChecked = true;
      canAccessSupabase = true;
      return true;
    }
    
    console.warn('⚠️ Supabase is configured but access check failed:', error);
    supabaseAccessChecked = true;
    canAccessSupabase = false;
    return false;
  } catch (error) {
    console.error('Error checking Supabase access:', error);
    supabaseAccessChecked = true;
    canAccessSupabase = false;
    return false;
  }
};

// Waitlist table functions
export const getWaitlistEntriesFromSupabase = async (): Promise<WaitlistEntry[]> => {
  // Check if we can access Supabase
  const canAccess = await checkSupabaseAccess();
  if (!canAccess) return [];

  try {
    console.log('Fetching waitlist entries from Supabase...');
    const { data, error } = await supabase
      .from(WAITLIST_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist entries from Supabase:', error);
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} waitlist entries from Supabase`);
    
    // Map the Supabase data structure to our application's data structure
    const entries: WaitlistEntry[] = data?.map(item => ({
      id: item.id ? String(item.id) : `wl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: item.email || '',
      timestamp: item.created_at || new Date().toISOString(),
      responded: Boolean(item.responded),
      conversations: item.conversations || []
    })) || [];
    
    return entries;
  } catch (error) {
    console.error('Error in getWaitlistEntriesFromSupabase:', error);
    return [];
  }
};

export const addWaitlistEntryToSupabase = async (entry: WaitlistEntry): Promise<boolean> => {
  // Check if we can access Supabase
  const canAccess = await checkSupabaseAccess();
  if (!canAccess) {
    console.log('Skipping Supabase insert due to access restrictions');
    return false;
  }

  try {
    console.log('Adding waitlist entry to Supabase:', entry.email);
    
    // Adapt our data structure to match Supabase's expected structure
    const supabaseEntry = {
      email: entry.email,
      created_at: entry.timestamp || new Date().toISOString()
    };
    
    const { error } = await supabase
      .from(WAITLIST_TABLE)
      .insert(supabaseEntry);

    if (error) {
      // Handle Row-Level Security (RLS) errors
      if (error.code === '42501') {
        console.warn('Row-Level Security (RLS) prevented insert. Using local storage only.');
        return false;
      }
      
      console.error('Error adding waitlist entry to Supabase:', error);
      return false;
    }

    console.log('Successfully added waitlist entry to Supabase');
    return true;
  } catch (error) {
    console.error('Error in addWaitlistEntryToSupabase:', error);
    return false;
  }
};

export const updateWaitlistEntryInSupabase = async (entry: WaitlistEntry): Promise<boolean> => {
  // Check if we can access Supabase
  const canAccess = await checkSupabaseAccess();
  if (!canAccess) {
    console.log('Skipping Supabase update due to access restrictions');
    return false;
  }

  try {
    console.log('Updating waitlist entry in Supabase for email:', entry.email);
    
    // Try to find the entry by email
    const { data } = await supabase
      .from(WAITLIST_TABLE)
      .select('id')
      .eq('email', entry.email)
      .maybeSingle();
    
    if (!data) {
      console.warn('No existing entry found for email:', entry.email);
      return false;
    }
    
    // Adapt our data structure to match Supabase's expected structure
    const supabaseEntry = {
      // Only update fields that we're confident exist
      email: entry.email
      // We'll skip 'responded' for now as we're not sure if it exists in your table
    };
    
    const { error } = await supabase
      .from(WAITLIST_TABLE)
      .update(supabaseEntry)
      .eq('id', data.id);

    if (error) {
      // Handle Row-Level Security (RLS) errors
      if (error.code === '42501') {
        console.warn('Row-Level Security (RLS) prevented update. Using local storage only.');
        return false;
      }
      
      console.error('Error updating waitlist entry in Supabase:', error);
      return false;
    }

    console.log('Successfully updated waitlist entry in Supabase');
    return true;
  } catch (error) {
    console.error('Error in updateWaitlistEntryInSupabase:', error);
    return false;
  }
};

// Custom emails table functions
export const getCustomEmailsFromSupabase = async (): Promise<CustomEmail[]> => {
  // Check if we can access Supabase
  const canAccess = await checkSupabaseAccess();
  if (!canAccess) return [];

  try {
    console.log('Fetching custom emails from Supabase...');
    const { data, error } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom emails from Supabase:', error);
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} custom emails from Supabase`);
    
    // Map the Supabase data structure to our application's data structure
    const emails: CustomEmail[] = data?.map(item => ({
      id: item.id ? String(item.id) : `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      to: item.email || '',
      subject: item.subject || '',
      message: item.message || '', // Handle case where message field might be missing
      timestamp: item.created_at || new Date().toISOString()
    })) || [];
    
    return emails;
  } catch (error) {
    console.error('Error in getCustomEmailsFromSupabase:', error);
    return [];
  }
};

export const addCustomEmailToSupabase = async (email: CustomEmail): Promise<boolean> => {
  // Check if we can access Supabase
  const canAccess = await checkSupabaseAccess();
  if (!canAccess) {
    console.log('Skipping Supabase insert due to access restrictions');
    return false;
  }

  try {
    console.log('Adding custom email to Supabase:', email.to);
    
    // Adapt our data structure to match Supabase's expected structure
    const supabaseEmail = {
      email: email.to,
      subject: email.subject,
      message: email.message, // Include message field, but Supabase might ignore it if column doesn't exist
      created_at: email.timestamp || new Date().toISOString()
    };
    
    const { error } = await supabase
      .from(CUSTOM_EMAILS_TABLE)
      .insert(supabaseEmail);

    if (error) {
      // Message field might be missing, try without it
      if (error.message && error.message.includes('message')) {
        console.warn('Message field not found in Supabase table, trying without it');
        const { email: to, subject, created_at } = supabaseEmail;
        const { error: fallbackError } = await supabase
          .from(CUSTOM_EMAILS_TABLE)
          .insert({ email: to, subject, created_at });
        
        if (fallbackError) {
          console.error('Error adding custom email to Supabase (fallback):', fallbackError);
          return false;
        }
        return true;
      }
      
      // Handle Row-Level Security (RLS) errors
      if (error.code === '42501') {
        console.warn('Row-Level Security (RLS) prevented insert. Using local storage only.');
        return false;
      }
      
      console.error('Error adding custom email to Supabase:', error);
      return false;
    }

    console.log('Successfully added custom email to Supabase');
    return true;
  } catch (error) {
    console.error('Error in addCustomEmailToSupabase:', error);
    return false;
  }
}; 