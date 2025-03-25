// Simple database with file-based persistence
// In a production app, you would use a real database like MongoDB, PostgreSQL, etc.
import fs from 'fs';
import path from 'path';

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
  
  waitlistEntries.push(entry);
  saveEntries();
  
  return entry;
};

// Record a custom email sent
export const recordCustomEmail = (to: string, subject: string, message: string): CustomEmail => {
  const id = `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  const email: CustomEmail = {
    id,
    to,
    subject,
    message,
    timestamp
  };
  
  customEmails.push(email);
  saveCustomEmails();
  
  return email;
};

// Get all waitlist entries
export const getWaitlistEntries = (): WaitlistEntry[] => {
  // Refresh from file system for server-side to ensure latest data
  if (typeof window === 'undefined') {
    waitlistEntries = loadEntriesFromFile();
  }
  return [...waitlistEntries];
};

// Get all custom emails
export const getCustomEmails = (): CustomEmail[] => {
  // Refresh from file system for server-side to ensure latest data
  if (typeof window === 'undefined') {
    customEmails = loadCustomEmailsFromFile();
  }
  return [...customEmails];
};

// Get a specific waitlist entry
export const getWaitlistEntry = (id: string): WaitlistEntry | undefined => {
  // Refresh from file system for server-side to ensure latest data
  if (typeof window === 'undefined') {
    waitlistEntries = loadEntriesFromFile();
  }
  return waitlistEntries.find(entry => entry.id === id);
};

// Add a response to a waitlist entry
export const addResponseToEntry = (
  id: string, 
  subject: string, 
  message: string
): WaitlistEntry | null => {
  // Refresh from file system for server-side to ensure latest data
  if (typeof window === 'undefined') {
    waitlistEntries = loadEntriesFromFile();
  }
  
  const entry = waitlistEntries.find(entry => entry.id === id);
  
  if (!entry) return null;
  
  entry.conversations.push({
    from: 'connect@beyondmedium.com',
    to: entry.email,
    subject,
    message,
    timestamp: new Date().toISOString()
  });
  
  entry.responded = true;
  saveEntries();
  
  return entry;
}; 