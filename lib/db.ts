// Simple database with file-based persistence
// In a production app, you would use a real database like MongoDB, PostgreSQL, etc.
import fs from 'fs';
import path from 'path';
import { WaitlistEntry, CustomEmail, Conversation } from './types';
import { 
  addWaitlistEntryToSupabase, 
  addCustomEmailToSupabase, 
  getWaitlistEntriesFromSupabase, 
  getCustomEmailsFromSupabase,
  updateWaitlistEntryInSupabase,
  isSupabaseConfigured 
} from './supabase';

export interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: string;
  responded: boolean;
  conversations: Array<{
    from: string;
    to: string;
    subject: string;
    message: string;
    timestamp: string;
  }>;
}

export interface CustomEmail {
  id: string;
  to: string;
  subject: string;
  message: string;
  timestamp: string;
}

// File paths for data storage
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'waitlist.json');
const CUSTOM_EMAILS_FILE_PATH = path.join(process.cwd(), 'data', 'custom-emails.json');

// In-memory storage
let waitlistEntries: WaitlistEntry[] = [];
let customEmails: CustomEmail[] = [];

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load entries from file system for server-side persistence
const loadEntriesFromFile = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load waitlist entries from file:', error);
  }
  return [];
};

// Load custom emails from file system
const loadCustomEmailsFromFile = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(CUSTOM_EMAILS_FILE_PATH)) {
      const data = fs.readFileSync(CUSTOM_EMAILS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load custom emails from file:', error);
  }
  return [];
};

// Initialize data from file system (server-side) or localStorage (client-side)
const initializeDatabase = () => {
  // Server-side: Load from file system
  if (typeof window === 'undefined') {
    waitlistEntries = loadEntriesFromFile();
    customEmails = loadCustomEmailsFromFile();
    return;
  }
  
  // Client-side: Try to load from localStorage
  try {
    const savedEntries = localStorage.getItem('waitlistEntries');
    if (savedEntries) {
      waitlistEntries = JSON.parse(savedEntries);
    }
    
    const savedCustomEmails = localStorage.getItem('customEmails');
    if (savedCustomEmails) {
      customEmails = JSON.parse(savedCustomEmails);
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
};

// Initialize on module load
initializeDatabase();

// Save entries to persistent storage
const saveEntries = () => {
  // Save to file system (server-side)
  if (typeof window === 'undefined') {
    try {
      ensureDataDir();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(waitlistEntries, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save waitlist entries to file:', error);
    }
    return;
  }
  
  // Save to localStorage (client-side)
  try {
    localStorage.setItem('waitlistEntries', JSON.stringify(waitlistEntries));
  } catch (error) {
    console.error('Failed to save waitlist entries to localStorage:', error);
  }
};

// Save custom emails to persistent storage
const saveCustomEmails = () => {
  // Save to file system (server-side)
  if (typeof window === 'undefined') {
    try {
      ensureDataDir();
      fs.writeFileSync(CUSTOM_EMAILS_FILE_PATH, JSON.stringify(customEmails, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save custom emails to file:', error);
    }
    return;
  }
  
  // Save to localStorage (client-side)
  try {
    localStorage.setItem('customEmails', JSON.stringify(customEmails));
  } catch (error) {
    console.error('Failed to save custom emails to localStorage:', error);
  }
};

// Add a new waitlist entry
export const addWaitlistEntry = (email: string): WaitlistEntry => {
  try {
    console.log('Adding waitlist entry for email:', email);
    
    const id = `wl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const entry: WaitlistEntry = {
      id,
      email,
      timestamp,
      responded: false,
      conversations: [{
        from: 'system',
        to: email,
        subject: 'Welcome to the BeyondMedium Waitlist',
        message: 'Thank you for joining our waitlist! We\'ll keep you updated on our progress.',
        timestamp
      }]
    };
    
    // Add to local storage
    waitlistEntries.push(entry);
    saveEntries();
    
    // Try to add to Supabase if configured, but don't wait for it
    if (isSupabaseConfigured()) {
      try {
        // Use Promise to handle this asynchronously without waiting
        addWaitlistEntryToSupabase(entry)
          .then(success => {
            if (!success) {
              console.warn('Failed to add waitlist entry to Supabase, but saved locally');
            } else {
              console.log('Successfully added waitlist entry to Supabase');
            }
          })
          .catch(error => {
            console.error('Error adding waitlist entry to Supabase (non-blocking):', error);
          });
      } catch (supabaseError) {
        // Catch and log any immediate errors, but don't block the function
        console.error('Error initiating Supabase add operation:', supabaseError);
      }
    } else {
      console.log('Supabase not configured, using local storage only');
    }
    
    return entry;
  } catch (error) {
    console.error('Error in addWaitlistEntry:', error);
    
    // Create a fallback entry even if something fails
    const fallbackEntry: WaitlistEntry = {
      id: `wl_fallback_${Date.now()}`,
      email,
      timestamp: new Date().toISOString(),
      responded: false,
      conversations: []
    };
    
    // Add even the fallback to local storage
    try {
      waitlistEntries.push(fallbackEntry);
      saveEntries();
    } catch (saveError) {
      console.error('Error even saving fallback entry:', saveError);
    }
    
    return fallbackEntry;
  }
};

// Record a custom email sent
export const recordCustomEmail = (to: string, subject: string, message: string): CustomEmail => {
  try {
    const id = `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const email: CustomEmail = {
      id,
      to,
      subject,
      message,
      timestamp
    };
    
    // Add to local storage
    customEmails.push(email);
    saveCustomEmails();
    
    // Try to add to Supabase if configured, but don't wait for it
    if (isSupabaseConfigured()) {
      try {
        // Use Promise to handle this asynchronously without waiting
        addCustomEmailToSupabase(email)
          .then(success => {
            if (!success) {
              console.warn('Failed to add custom email to Supabase, but saved locally');
            } else {
              console.log('Successfully added custom email to Supabase');
            }
          })
          .catch(error => {
            console.error('Error adding custom email to Supabase (non-blocking):', error);
          });
      } catch (supabaseError) {
        // Catch and log any immediate errors, but don't block the function
        console.error('Error initiating Supabase add operation for email:', supabaseError);
      }
    } else {
      console.log('Supabase not configured, using local storage only for custom email');
    }
    
    return email;
  } catch (error) {
    console.error('Error in recordCustomEmail:', error);
    
    // Create a fallback email record even if something fails
    const fallbackEmail: CustomEmail = {
      id: `email_fallback_${Date.now()}`,
      to,
      subject,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Add even the fallback to local storage
    try {
      customEmails.push(fallbackEmail);
      saveCustomEmails();
    } catch (saveError) {
      console.error('Error even saving fallback email:', saveError);
    }
    
    return fallbackEmail;
  }
};

// Get all waitlist entries
export const getWaitlistEntries = async (): Promise<WaitlistEntry[]> => {
  try {
    // Try to get from Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabaseEntries = await getWaitlistEntriesFromSupabase();
        if (supabaseEntries.length > 0) {
          // Update local cache
          waitlistEntries = supabaseEntries;
          saveEntries();
          return supabaseEntries;
        }
      } catch (error) {
        console.error('Error fetching waitlist entries from Supabase:', error);
        // Continue to local storage fallback
      }
    }
    
    // Fall back to local storage
    if (typeof window === 'undefined') {
      waitlistEntries = loadEntriesFromFile();
    }
    return [...waitlistEntries];
  } catch (error) {
    console.error('Error in getWaitlistEntries:', error);
    return []; // Return empty array on error
  }
};

// Get all custom emails
export const getCustomEmails = async (): Promise<CustomEmail[]> => {
  try {
    // Try to get from Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabaseEmails = await getCustomEmailsFromSupabase();
        if (supabaseEmails.length > 0) {
          // Update local cache
          customEmails = supabaseEmails;
          saveCustomEmails();
          return supabaseEmails;
        }
      } catch (error) {
        console.error('Error fetching custom emails from Supabase:', error);
        // Continue to local storage fallback
      }
    }
    
    // Fall back to local storage
    if (typeof window === 'undefined') {
      customEmails = loadCustomEmailsFromFile();
    }
    return [...customEmails];
  } catch (error) {
    console.error('Error in getCustomEmails:', error);
    return []; // Return empty array on error
  }
};

// Get a specific waitlist entry
export const getWaitlistEntry = async (id: string): Promise<WaitlistEntry | undefined> => {
  try {
    // Refresh entries to ensure latest data
    const entries = await getWaitlistEntries();
    return entries.find(entry => entry.id === id);
  } catch (error) {
    console.error('Error in getWaitlistEntry:', error);
    return undefined;
  }
};

// Add a response to a waitlist entry
export const addResponseToEntry = async (
  id: string, 
  subject: string, 
  message: string
): Promise<WaitlistEntry | null> => {
  try {
    // Refresh entries to ensure latest data
    const entries = await getWaitlistEntries();
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) return null;
    
    const entry = entries[entryIndex];
    
    const newConversation: Conversation = {
      from: 'connect@beyondmedium.com',
      to: entry.email,
      subject,
      message,
      timestamp: new Date().toISOString()
    };
    
    entry.conversations.push(newConversation);
    entry.responded = true;
    
    // Update in local storage
    waitlistEntries[entryIndex] = entry;
    saveEntries();
    
    // Try to update in Supabase if configured, but don't block execution
    if (isSupabaseConfigured()) {
      try {
        updateWaitlistEntryInSupabase(entry)
          .then(success => {
            if (!success) {
              console.warn('Failed to update waitlist entry in Supabase, but saved locally');
            } else {
              console.log('Successfully updated waitlist entry in Supabase');
            }
          })
          .catch(error => {
            console.error('Error updating waitlist entry in Supabase (non-blocking):', error);
          });
      } catch (supabaseError) {
        console.error('Error initiating Supabase update operation:', supabaseError);
      }
    }
    
    return entry;
  } catch (error) {
    console.error('Error in addResponseToEntry:', error);
    return null;
  }
}; 