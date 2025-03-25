import { createClient } from '@supabase/supabase-js';
import { WaitlistEntry, CustomEmail } from './types';

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

// Waitlist table functions
export const getWaitlistEntriesFromSupabase = async (): Promise<WaitlistEntry[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist entries from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWaitlistEntriesFromSupabase:', error);
    return [];
  }
};

export const addWaitlistEntryToSupabase = async (entry: WaitlistEntry): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('waitlist_entries')
      .insert([entry]);

    if (error) {
      console.error('Error adding waitlist entry to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addWaitlistEntryToSupabase:', error);
    return false;
  }
};

export const updateWaitlistEntryInSupabase = async (entry: WaitlistEntry): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('waitlist_entries')
      .update(entry)
      .eq('id', entry.id);

    if (error) {
      console.error('Error updating waitlist entry in Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateWaitlistEntryInSupabase:', error);
    return false;
  }
};

// Custom emails table functions
export const getCustomEmailsFromSupabase = async (): Promise<CustomEmail[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('custom_emails')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching custom emails from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCustomEmailsFromSupabase:', error);
    return [];
  }
};

export const addCustomEmailToSupabase = async (email: CustomEmail): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('custom_emails')
      .insert([email]);

    if (error) {
      console.error('Error adding custom email to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addCustomEmailToSupabase:', error);
    return false;
  }
}; 