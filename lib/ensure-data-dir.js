const fs = require('fs');
const path = require('path');

// This script ensures the data directory exists at build time
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory for file-based database...');
    fs.mkdirSync(dataDir, { recursive: true });
  } else {
    console.log('Data directory already exists.');
  }
  
  // Create an empty waitlist.json file if it doesn't exist
  const dbFile = path.join(dataDir, 'waitlist.json');
  if (!fs.existsSync(dbFile)) {
    console.log('Creating empty waitlist.json file...');
    fs.writeFileSync(dbFile, '[]', 'utf-8');
  } else {
    console.log('waitlist.json already exists.');
  }
};

// Run the function
ensureDataDir(); 