// Simple database implementation with Vercel KV for production and fallback to file/localStorage for dev
// In a more robust production app, you might use a full database like MongoDB, PostgreSQL, etc.
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

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

// Keys for KV storage
const KV_WAITLIST_KEY = 'waitlist_entries';
const KV_CUSTOM_EMAILS_KEY = 'custom_emails';

// File paths for local development fallback
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'waitlist.json');
const CUSTOM_EMAILS_FILE_PATH = path.join(process.cwd(), 'data', 'custom-emails.json');

// In-memory storage
let waitlistEntries: WaitlistEntry[] = [];
let customEmails: CustomEmail[] = [];

// Check if running in Vercel production environment
const isVercelProduction = process.env.VERCEL === '1';

// Ensure data directory exists (for local development)
const ensureDataDir = () => {
  if (isVercelProduction) return; // Skip in Vercel production
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load entries from various storage options
const loadWaitlistEntries = async (): Promise<WaitlistEntry[]> => {
  try {
    // Try to load from Vercel KV first
    if (isVercelProduction) {
      const kvData = await kv.get<WaitlistEntry[]>(KV_WAITLIST_KEY);
      if (kvData) return kvData;
      return [];
    }
    
    // Fallback to file storage for development
    ensureDataDir();
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load waitlist entries:', error);
  }
  return [];
};

// Load custom emails from storage
const loadCustomEmails = async (): Promise<CustomEmail[]> => {
  try {
    // Try to load from Vercel KV first
    if (isVercelProduction) {
      const kvData = await kv.get<CustomEmail[]>(KV_CUSTOM_EMAILS_KEY);
      if (kvData) return kvData;
      return [];
    }
    
    // Fallback to file storage for development
    ensureDataDir();
    if (fs.existsSync(CUSTOM_EMAILS_FILE_PATH)) {
      const data = fs.readFileSync(CUSTOM_EMAILS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load custom emails:', error);
  }
  return [];
};

// Initialize database (called lazily when needed instead of at module load)
const initializeDatabase = async () => {
  // Server-side: Load from storage
  if (typeof window === 'undefined') {
    waitlistEntries = await loadWaitlistEntries();
    customEmails = await loadCustomEmails();
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

// Initialize database if not already initialized
const ensureDatabaseInitialized = async () => {
  // Only initialize if arrays are empty
  if (waitlistEntries.length === 0 && customEmails.length === 0) {
    await initializeDatabase();
  }
};

// Save waitlist entries to persistent storage
const saveWaitlistEntries = async () => {
  // Save to Vercel KV (production)
  if (typeof window === 'undefined' && isVercelProduction) {
    try {
      await kv.set(KV_WAITLIST_KEY, waitlistEntries);
      return;
    } catch (error) {
      console.error('Failed to save waitlist entries to KV storage:', error);
    }
  }
  
  // Save to file system (server-side development)
  if (typeof window === 'undefined' && !isVercelProduction) {
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
const saveCustomEmails = async () => {
  // Save to Vercel KV (production)
  if (typeof window === 'undefined' && isVercelProduction) {
    try {
      await kv.set(KV_CUSTOM_EMAILS_KEY, customEmails);
      return;
    } catch (error) {
      console.error('Failed to save custom emails to KV storage:', error);
    }
  }
  
  // Save to file system (server-side development)
  if (typeof window === 'undefined' && !isVercelProduction) {
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
export const addWaitlistEntry = async (email: string): Promise<WaitlistEntry> => {
  await ensureDatabaseInitialized();
  
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
  await saveWaitlistEntries();
  
  return entry;
};

// Record a custom email sent
export const recordCustomEmail = async (to: string, subject: string, message: string): Promise<CustomEmail> => {
  await ensureDatabaseInitialized();
  
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
  await saveCustomEmails();
  
  return email;
};

// Get all waitlist entries
export const getWaitlistEntries = async (): Promise<WaitlistEntry[]> => {
  await ensureDatabaseInitialized();
  
  // Refresh data from storage
  if (typeof window === 'undefined') {
    waitlistEntries = await loadWaitlistEntries();
  }
  
  return [...waitlistEntries];
};

// Get all custom emails
export const getCustomEmails = async (): Promise<CustomEmail[]> => {
  await ensureDatabaseInitialized();
  
  // Refresh data from storage
  if (typeof window === 'undefined') {
    customEmails = await loadCustomEmails();
  }
  
  return [...customEmails];
};

// Get a specific waitlist entry
export const getWaitlistEntry = async (id: string): Promise<WaitlistEntry | undefined> => {
  await ensureDatabaseInitialized();
  
  // Refresh data from storage
  if (typeof window === 'undefined') {
    waitlistEntries = await loadWaitlistEntries();
  }
  
  return waitlistEntries.find(entry => entry.id === id);
};

// Add a response to a waitlist entry
export const addResponseToEntry = async (
  id: string, 
  subject: string, 
  message: string
): Promise<WaitlistEntry | null> => {
  await ensureDatabaseInitialized();
  
  // Refresh data from storage
  if (typeof window === 'undefined') {
    waitlistEntries = await loadWaitlistEntries();
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
  await saveWaitlistEntries();
  
  return entry;
}; 