"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminHelp() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-black p-6 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-light">BEYOND MEDIUM</h1>
            <p className="text-sm text-zinc-400">Admin Panel Help</p>
          </div>
        </div>
        <Link href="/admin">
          <Button 
            variant="outline" 
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-6 max-w-4xl">
        <h2 className="text-2xl font-light mb-6">Help & Documentation</h2>
        
        <div className="grid gap-6">
          {/* Email System Explanation */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>How the Email System Works</CardTitle>
              <CardDescription className="text-zinc-400">
                Understanding how emails are sent and received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Resend Email Service</h3>
                <p className="text-zinc-300">
                  Beyond Medium uses <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-mint-200 hover:underline">Resend</a> to handle email communications. Resend is a developer-friendly email API service that provides reliable delivery, analytics, and a simple API.
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300 space-y-1">
                  <li>Emails are sent from <code className="bg-zinc-800 px-1 py-0.5 rounded">connect@beyondmedium.com</code></li>
                  <li>Resend handles the delivery, bounce handling, and tracking</li>
                  <li>The API key is stored in <code className="bg-zinc-800 px-1 py-0.5 rounded">.env.local</code> as <code className="bg-zinc-800 px-1 py-0.5 rounded">RESEND_API_KEY</code></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Email Flow</h3>
                <p className="text-zinc-300">
                  Here's how emails flow through our system:
                </p>
                <ol className="list-decimal pl-6 mt-2 text-zinc-300 space-y-1">
                  <li>When someone joins the waitlist, two emails are sent:</li>
                  <ul className="list-disc pl-6 mt-1 mb-2">
                    <li>A confirmation email to the subscriber</li>
                    <li>A notification email to <code className="bg-zinc-800 px-1 py-0.5 rounded">connect@beyondmedium.com</code></li>
                  </ul>
                  <li>When you respond to a waitlist subscriber:</li>
                  <ul className="list-disc pl-6 mt-1">
                    <li>The email is sent directly to the subscriber</li>
                    <li>The conversation is saved in our database</li>
                    <li>The email appears to come from <code className="bg-zinc-800 px-1 py-0.5 rounded">connect@beyondmedium.com</code></li>
                  </ul>
                  <li>When you send a custom email to a new address:</li>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Click the "New Email" button in the top-right</li>
                    <li>Enter the recipient email, subject, and message</li>
                    <li>The email will be sent with the same Beyond Medium branding</li>
                    <li>These emails are not saved in the waitlist database</li>
                  </ul>
                </ol>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 mt-4">
                <h4 className="text-mint-200 font-medium mb-2">Important Note About External Emails</h4>
                <p className="text-zinc-300">
                  This admin panel can only manage waitlist subscriptions and responses. It is <strong>not</strong> a full email inbox.
                </p>
                <p className="text-zinc-300 mt-2">
                  Emails sent directly to <code className="bg-zinc-800 px-1 py-0.5 rounded">connect@beyondmedium.com</code> from external sources (not through our waitlist system) will go to your actual email inbox and won't appear in this admin panel.
                </p>
                <p className="text-zinc-300 mt-2">
                  To manage those emails, you need to access your email provider's interface.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Persistence Explanation */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Database & Persistence</CardTitle>
              <CardDescription className="text-zinc-400">
                How waitlist data is stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-300">
                The waitlist system uses a simple file-based database for persistence. All waitlist entries and conversation history are stored in:
              </p>
              <code className="block bg-zinc-800 p-2 rounded mt-2 text-mint-200">
                /data/waitlist.json
              </code>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Persistence Features</h3>
                <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                  <li>Data is stored in a JSON file on the server</li>
                  <li>Entries persist between server restarts</li>
                  <li>The system automatically reads from and writes to this file</li>
                  <li>For browser sessions, data is also cached in localStorage</li>
                </ul>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 mt-4">
                <h4 className="text-mint-200 font-medium mb-2">Data Backup Recommendation</h4>
                <p className="text-zinc-300">
                  While this system provides basic persistence, for production use it's recommended to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li>Regularly back up the <code className="bg-zinc-800 px-1 py-0.5 rounded">data/waitlist.json</code> file</li>
                  <li>Consider migrating to a proper database system as your subscriber list grows</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Panel Usage */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Using the Admin Panel</CardTitle>
              <CardDescription className="text-zinc-400">
                Tips for managing waitlist entries effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Admin Credentials</h3>
                <p className="text-zinc-300">
                  The admin panel is protected with basic authentication:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li>Username: <code className="bg-zinc-800 px-1 py-0.5 rounded">adnim</code></li>
                  <li>Password: <code className="bg-zinc-800 px-1 py-0.5 rounded">tillandbrad420</code></li>
                </ul>
                <p className="text-zinc-300 mt-2">
                  These credentials are hardcoded in <code className="bg-zinc-800 px-1 py-0.5 rounded">app/api/auth/route.ts</code> and should be changed for production use.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Managing Subscribers</h3>
                <p className="text-zinc-300">
                  You can filter subscribers by their status:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li><strong>All</strong>: Shows all subscribers</li>
                  <li><strong>Awaiting Response</strong>: Shows subscribers you haven't responded to yet</li>
                  <li><strong>Responded</strong>: Shows subscribers you've already responded to</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Responding to Subscribers</h3>
                <p className="text-zinc-300">
                  When composing responses:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li>Use clear and engaging subject lines</li>
                  <li>Your messages support basic formatting with line breaks</li>
                  <li>Emails will be styled with the Beyond Medium branding</li>
                  <li>A signature "The Beyond Medium Team" is automatically added</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Sending Custom Emails</h3>
                <p className="text-zinc-300">
                  The "New Email" feature allows you to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li>Send emails to anyone, even if they're not on your waitlist</li>
                  <li>Reach out to potential partners or collaborators</li>
                  <li>Send personalized replies to manual inquiries</li>
                  <li>All emails maintain the Beyond Medium branding consistency</li>
                </ul>
              </div>
              
              <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700 mt-4">
                <h4 className="text-mint-200 font-medium mb-2">Coming Soon</h4>
                <p className="text-zinc-300">
                  Future improvements planned for the admin panel:
                </p>
                <ul className="list-disc pl-6 mt-2 text-zinc-300">
                  <li>Search functionality for finding specific subscribers</li>
                  <li>Export functionality for backing up subscriber data</li>
                  <li>Response templates for common messages</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/admin">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Admin Panel
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
} 