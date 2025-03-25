const fs = require('fs');
const path = require('path');

/**
 * Test Setup Script
 * This script prepares the environment for running tests by:
 * 1. Ensuring the data directory exists
 * 2. Creating empty test data files if they don't exist
 */

// Define paths
const dataDir = path.join(process.cwd(), 'data');
const waitlistFile = path.join(dataDir, 'waitlist.json');
const customEmailsFile = path.join(dataDir, 'custom-emails.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
} else {
  console.log('Data directory already exists.');
}

// Create waitlist.json if it doesn't exist
if (!fs.existsSync(waitlistFile)) {
  console.log('Creating empty waitlist.json file...');
  fs.writeFileSync(waitlistFile, JSON.stringify([]));
} else {
  console.log('waitlist.json already exists.');
}

// Create custom-emails.json if it doesn't exist
if (!fs.existsSync(customEmailsFile)) {
  console.log('Creating empty custom-emails.json file...');
  fs.writeFileSync(customEmailsFile, JSON.stringify([]));
} else {
  console.log('custom-emails.json already exists.');
}

console.log('Test environment prepared successfully!'); 