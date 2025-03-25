"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { MailPlus } from 'lucide-react';

import { WaitlistEntry, CustomEmail, getCustomEmails } from '@/lib/db';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const responseFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Define a new form schema for the new email form
const newEmailFormSchema = z.object({
  to: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function AdminPanel() {
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [customEmails, setCustomEmails] = useState<CustomEmail[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseStatus, setResponseStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [newEmailDialogOpen, setNewEmailDialogOpen] = useState(false);
  const [newEmailStatus, setNewEmailStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const responseForm = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const newEmailForm = useForm<z.infer<typeof newEmailFormSchema>>({
    resolver: zodResolver(newEmailFormSchema),
    defaultValues: {
      to: "",
      subject: "",
      message: "",
    },
  });

  // Check for authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // Fetch waitlist entries
    fetchEntries();
  }, [router]);
  
  // Fetch waitlist entries
  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch waitlist entries
      const response = await fetch('/api/admin/waitlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (response.status === 401) {
          // Unauthorized, redirect to login
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        
        setError(data.message || 'Failed to fetch entries');
        return;
      }
      
      setEntries(data.data);
      
      // Fetch custom emails
      const emailsResponse = await fetch('/api/admin/emails', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const emailsData = await emailsResponse.json();
      
      if (emailsResponse.ok && emailsData.success) {
        setCustomEmails(emailsData.data);
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };
  
  // Handle response submission
  const handleResponse = async (values: z.infer<typeof responseFormSchema>) => {
    setResponseStatus(null);
    
    if (!selectedEntry) {
      setResponseStatus({
        success: false,
        message: 'No entry selected',
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/waitlist/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedEntry.id,
          subject: values.subject,
          message: values.message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setResponseStatus({
          success: false,
          message: data.message || 'Failed to send response',
        });
        return;
      }
      
      // Update entries list
      await fetchEntries();
      
      setResponseStatus({
        success: true,
        message: 'Response sent successfully',
      });
      
      // Close dialog after successful response
      setTimeout(() => {
        setResponseDialogOpen(false);
        responseForm.reset();
      }, 1500);
    } catch (err) {
      setResponseStatus({
        success: false,
        message: 'An error occurred while sending response',
      });
      console.error('Response error:', err);
    }
  };
  
  // Handle sending email to a new address
  const handleSendNewEmail = async (values: z.infer<typeof newEmailFormSchema>) => {
    setNewEmailStatus(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setNewEmailStatus({
          success: false,
          message: data.message || 'Failed to send email',
        });
        return;
      }
      
      setNewEmailStatus({
        success: true,
        message: 'Email sent successfully',
      });
      
      // Close dialog after successful email
      setTimeout(() => {
        setNewEmailDialogOpen(false);
        newEmailForm.reset();
      }, 1500);
    } catch (err) {
      setNewEmailStatus({
        success: false,
        message: 'An error occurred while sending email',
      });
      console.error('Email send error:', err);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - HH:mm');
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-black p-6 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-light">BEYOND MEDIUM</h1>
            <p className="text-sm text-zinc-400">Admin Panel</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center"
            onClick={() => setNewEmailDialogOpen(true)}
          >
            <MailPlus className="h-4 w-4 mr-2" />
            New Email
          </Button>
          <Link href="/admin/help">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Help
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Logout
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-light mb-6">Waitlist Management</h2>
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-zinc-400 text-sm">Total Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-light">{entries.length}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-zinc-400 text-sm">Awaiting Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-light">{entries.filter(e => !e.responded).length}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-zinc-400 text-sm">Responded</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-light">{entries.filter(e => e.responded).length}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-zinc-400 text-sm">Custom Emails Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-light">{customEmails.length}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tabs for different content sections */}
              <Tabs defaultValue="waitlist" className="mb-6">
                <TabsList className="bg-zinc-800 border-zinc-700">
                  <TabsTrigger value="waitlist">Waitlist Subscribers</TabsTrigger>
                  <TabsTrigger value="custom-emails">Custom Emails</TabsTrigger>
                </TabsList>
                
                {/* Waitlist Tab Content */}
                <TabsContent value="waitlist">
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                      <CardTitle>Waitlist Subscribers</CardTitle>
                      <CardDescription className="text-zinc-400">
                        All subscribers to your waitlist
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="all">
                        <TabsList className="bg-zinc-800 border-zinc-700">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="pending">Awaiting Response</TabsTrigger>
                          <TabsTrigger value="responded">Responded</TabsTrigger>
                        </TabsList>
                        
                        {['all', 'pending', 'responded'].map((tab) => (
                          <TabsContent key={tab} value={tab} className="mt-4">
                            <div className="space-y-4">
                              {entries
                                .filter(entry => 
                                  tab === 'all' || 
                                  (tab === 'pending' && !entry.responded) || 
                                  (tab === 'responded' && entry.responded)
                                )
                                .map((entry) => (
                                  <Card 
                                    key={entry.id} 
                                    className={`bg-zinc-800 border ${
                                      entry.responded ? 'border-green-800' : 'border-amber-800'
                                    }`}
                                  >
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <CardTitle className="text-lg">{entry.email}</CardTitle>
                                          <CardDescription className="text-zinc-400">
                                            Joined {formatDate(entry.timestamp)}
                                          </CardDescription>
                                        </div>
                                        <div>
                                          <Dialog open={responseDialogOpen && selectedEntry?.id === entry.id} onOpenChange={(open) => {
                                            if (open) {
                                              setSelectedEntry(entry);
                                            }
                                            setResponseDialogOpen(open);
                                            setResponseStatus(null);
                                            if (!open) {
                                              responseForm.reset();
                                            }
                                          }}>
                                            <DialogTrigger asChild>
                                              <Button 
                                                variant="outline" 
                                                className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700"
                                              >
                                                {entry.responded ? 'Send Another' : 'Respond'}
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                              <DialogHeader>
                                                <DialogTitle>Respond to {entry.email}</DialogTitle>
                                                <DialogDescription className="text-zinc-400">
                                                  Send a personalized email to this subscriber.
                                                </DialogDescription>
                                              </DialogHeader>
                                              
                                              {responseStatus && (
                                                <Alert
                                                  variant={responseStatus.success ? "default" : "destructive"}
                                                  className={responseStatus.success ? "bg-green-900 border-green-800" : ""}
                                                >
                                                  <AlertDescription>{responseStatus.message}</AlertDescription>
                                                </Alert>
                                              )}
                                              
                                              <Form {...responseForm}>
                                                <form onSubmit={responseForm.handleSubmit(handleResponse)} className="space-y-4">
                                                  <FormField
                                                    control={responseForm.control}
                                                    name="subject"
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormLabel className="text-zinc-300">Subject</FormLabel>
                                                        <FormControl>
                                                          <Input 
                                                            placeholder="Email subject" 
                                                            {...field} 
                                                            className="bg-zinc-800 border-zinc-700 text-white"
                                                          />
                                                        </FormControl>
                                                        <FormMessage />
                                                      </FormItem>
                                                    )}
                                                  />
                                                  
                                                  <FormField
                                                    control={responseForm.control}
                                                    name="message"
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormLabel className="text-zinc-300">Message</FormLabel>
                                                        <FormControl>
                                                          <Textarea 
                                                            placeholder="Your message" 
                                                            rows={6}
                                                            {...field} 
                                                            className="bg-zinc-800 border-zinc-700 text-white resize-none"
                                                          />
                                                        </FormControl>
                                                        <FormMessage />
                                                      </FormItem>
                                                    )}
                                                  />
                                                  
                                                  <DialogFooter className="pt-4">
                                                    <Button 
                                                      type="submit" 
                                                      className="bg-gradient-to-r from-[#7e9a9a] to-[#a4c2c2] text-zinc-800 hover:text-white hover:from-[#7e9a9a] hover:to-[#8aa3a3] border-none"
                                                      disabled={responseForm.formState.isSubmitting}
                                                    >
                                                      {responseForm.formState.isSubmitting ? (
                                                        <span className="flex items-center">
                                                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                          </svg>
                                                          Sending...
                                                        </span>
                                                      ) : "Send Email"}
                                                    </Button>
                                                  </DialogFooter>
                                                </form>
                                              </Form>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-zinc-400">Conversation History:</h4>
                                        {entry.conversations.map((conv, idx) => (
                                          <div key={idx} className="bg-zinc-900 p-3 rounded-md border border-zinc-800">
                                            <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                              <span>{conv.from === 'system' ? 'System' : 'You'} → {conv.to}</span>
                                              <span>{formatDate(conv.timestamp)}</span>
                                            </div>
                                            <p className="text-sm font-medium mb-1">{conv.subject}</p>
                                            <p className="text-sm text-zinc-300 whitespace-pre-line">{conv.message}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              
                              {entries.filter(entry => 
                                tab === 'all' || 
                                (tab === 'pending' && !entry.responded) || 
                                (tab === 'responded' && entry.responded)
                              ).length === 0 && (
                                <div className="text-center py-8 text-zinc-500">
                                  <p>No {tab === 'all' ? 'entries' : tab === 'pending' ? 'pending entries' : 'responded entries'} found.</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Custom Emails Tab Content */}
                <TabsContent value="custom-emails">
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                      <CardTitle>Custom Emails</CardTitle>
                      <CardDescription className="text-zinc-400">
                        History of emails sent to non-waitlist recipients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {customEmails.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                          <p>No custom emails have been sent yet.</p>
                          <p className="mt-2">
                            Use the "New Email" button to send emails to addresses outside your waitlist.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {customEmails
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((email) => (
                              <Card 
                                key={email.id} 
                                className="bg-zinc-800 border border-green-800"
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-lg">{email.to}</CardTitle>
                                      <CardDescription className="text-zinc-400">
                                        Sent {formatDate(email.timestamp)}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="bg-zinc-900 p-3 rounded-md border border-zinc-800">
                                      <div className="text-xs text-zinc-500 mb-1">
                                        From: connect@beyondmedium.com
                                      </div>
                                      <p className="text-sm font-medium mb-1">{email.subject}</p>
                                      <p className="text-sm text-zinc-300 whitespace-pre-line">{email.message}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </motion.div>
      </main>
      
      {/* New Email Dialog */}
      <Dialog 
        open={newEmailDialogOpen} 
        onOpenChange={(open) => {
          setNewEmailDialogOpen(open);
          setNewEmailStatus(null);
          if (!open) {
            newEmailForm.reset();
          }
        }}
      >
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Send New Email</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Send an email to any address from BeyondMedium.
            </DialogDescription>
          </DialogHeader>
          
          {newEmailStatus && (
            <Alert
              variant={newEmailStatus.success ? "default" : "destructive"}
              className={newEmailStatus.success ? "bg-green-900 border-green-800" : ""}
            >
              <AlertDescription>{newEmailStatus.message}</AlertDescription>
            </Alert>
          )}
          
          <Form {...newEmailForm}>
            <form onSubmit={newEmailForm.handleSubmit(handleSendNewEmail)} className="space-y-4">
              <FormField
                control={newEmailForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Recipient Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com" 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newEmailForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Email subject" 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newEmailForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your message" 
                        rows={6}
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#7e9a9a] to-[#a4c2c2] text-zinc-800 hover:text-white hover:from-[#7e9a9a] hover:to-[#8aa3a3] border-none"
                  disabled={newEmailForm.formState.isSubmitting}
                >
                  {newEmailForm.formState.isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Email"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 