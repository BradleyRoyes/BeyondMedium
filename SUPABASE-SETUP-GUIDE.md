# Supabase Setup Guide for Beyond Medium

This guide will help you set up Supabase as a reliable database backend for your Beyond Medium application, ensuring that your data persists in production deployments on Vercel.

## Why Supabase?

Vercel's serverless functions don't maintain file system state between executions, which means that our local file-based database doesn't work reliably in production. Supabase provides:

- A PostgreSQL database with a generous free tier
- Simple setup and configuration
- Reliable persistent storage across function invocations
- API that works seamlessly with Next.js applications

## Setup Steps

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com/) and sign up for a free account
2. After signing in, create a new project:
   - Choose a name (e.g., "beyondmedium")
   - Set a secure database password (save this for later)
   - Choose the region closest to your users
   - Create the project

### 2. Create Database Tables

After your project is created, you'll need to set up the database tables:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL commands to create the necessary tables:

```sql
-- Create waitlist entries table
CREATE TABLE waitlist_entries (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  responded BOOLEAN NOT NULL DEFAULT FALSE,
  conversations JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create custom emails table
CREATE TABLE custom_emails (
  id TEXT PRIMARY KEY,
  to TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

-- Create indexes for better performance
CREATE INDEX waitlist_entries_email_idx ON waitlist_entries (email);
CREATE INDEX waitlist_entries_responded_idx ON waitlist_entries (responded);
CREATE INDEX custom_emails_to_idx ON custom_emails (to);
```

### 3. Get Your API Keys

1. In your Supabase dashboard, go to Project Settings > API
2. Find the "Project URL" and "anon public" key - you'll need these for the next step

### 4. Configure Environment Variables in Vercel

Add these environment variables to your Vercel project:

1. Go to your Vercel dashboard, select your project
2. Navigate to Settings > Environment Variables
3. Add the following variables:
   - `SUPABASE_URL`: Your Project URL from Supabase
   - `SUPABASE_ANON_KEY`: Your "anon public" key from Supabase

### 5. Test Locally

To test the Supabase integration locally:

1. Create a `.env.local` file in your project root (if it doesn't already exist)
2. Add the same environment variables:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
3. Restart your development server

## How It Works

The application is now set up with a hybrid storage approach:

- When Supabase credentials are provided, the app will use Supabase as the primary database
- If Supabase is not configured or unavailable, it falls back to the local file-based storage
- This ensures your app works both in development and production environments

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Verify your Supabase project is active and the database is online
3. Look for errors in the Vercel function logs or your local development console
4. Make sure your IP is not being rate-limited by Supabase

## Data Migration

If you have existing data in your local database, you can migrate it to Supabase:

1. Export your data from the local JSON files in the `/data` directory
2. Format it appropriately for the Supabase tables
3. Use the Supabase dashboard to import the data or use the API to programmatically add each entry

Need more help? Reach out to your developer for assistance with this setup. 