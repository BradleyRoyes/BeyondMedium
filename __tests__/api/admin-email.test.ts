/**
 * @jest-environment node
 */

import { POST as customEmailPost } from '@/app/api/admin/email/send/route';
import { POST as waitlistRespondPost } from '@/app/api/admin/waitlist/respond/route';
import { recordCustomEmail, addResponseToEntry, getWaitlistEntry } from '@/lib/db';

// Mock the Resend service
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-email-id', status: 'success' }),
    },
  })),
}));

// Mock the db functions
jest.mock('@/lib/db', () => ({
  recordCustomEmail: jest.fn().mockImplementation((to, subject, message) => ({
    id: 'custom-email-123',
    to,
    subject,
    message,
    timestamp: new Date().toISOString()
  })),
  getWaitlistEntry: jest.fn().mockImplementation((id) => ({
    id,
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    responded: false,
    conversations: [{
      from: 'system',
      to: 'test@example.com',
      subject: 'Welcome to the BeyondMedium Waitlist',
      message: 'Thank you for joining our waitlist! We\'ll keep you updated on our progress.',
      timestamp: new Date().toISOString()
    }]
  })),
  addResponseToEntry: jest.fn().mockImplementation((id, subject, message) => ({
    id,
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    responded: true,
    conversations: [
      {
        from: 'system',
        to: 'test@example.com',
        subject: 'Welcome to the BeyondMedium Waitlist',
        message: 'Thank you for joining our waitlist! We\'ll keep you updated on our progress.',
        timestamp: new Date().toISOString()
      },
      {
        from: 'connect@beyondmedium.com',
        to: 'test@example.com',
        subject,
        message,
        timestamp: new Date().toISOString()
      }
    ]
  })),
}));

// Create a mock Request object with admin token
const createAdminRequest = (body: any) => {
  const headers = new Headers();
  // Base64 encode 'adnim:tillandbrad420'
  headers.append('Authorization', 'Bearer YWRuaW06dGlsbGFuZGJyYWQ0MjA=');
  
  return {
    json: () => Promise.resolve(body),
    headers,
  } as unknown as Request;
};

describe('Admin Email API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Email API', () => {
    it('successfully sends a custom email', async () => {
      const mockReq = createAdminRequest({ 
        to: 'recipient@example.com', 
        subject: 'Test Subject', 
        message: 'Test Message' 
      });
      
      const res = await customEmailPost(mockReq);
      const responseData = await res.json();
      
      expect(recordCustomEmail).toHaveBeenCalledWith(
        'recipient@example.com', 
        'Test Subject', 
        'Test Message'
      );
      expect(res.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it('returns an error when required fields are missing', async () => {
      const mockReq = createAdminRequest({ to: 'recipient@example.com' });
      const res = await customEmailPost(mockReq);
      const responseData = await res.json();
      
      expect(recordCustomEmail).not.toHaveBeenCalled();
      expect(res.status).toBe(400);
      expect(responseData.success).toBe(false);
    });
  });

  describe('Waitlist Response API', () => {
    it('successfully sends a response to a waitlist entry', async () => {
      const mockReq = createAdminRequest({ 
        id: 'wl_123', 
        subject: 'Response Subject', 
        message: 'Response Message' 
      });
      
      const res = await waitlistRespondPost(mockReq);
      const responseData = await res.json();
      
      expect(getWaitlistEntry).toHaveBeenCalledWith('wl_123');
      expect(addResponseToEntry).toHaveBeenCalledWith(
        'wl_123', 
        'Response Subject', 
        'Response Message'
      );
      expect(res.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it('returns an error when required fields are missing', async () => {
      const mockReq = createAdminRequest({ id: 'wl_123' });
      const res = await waitlistRespondPost(mockReq);
      const responseData = await res.json();
      
      expect(addResponseToEntry).not.toHaveBeenCalled();
      expect(res.status).toBe(400);
      expect(responseData.success).toBe(false);
    });

    it('returns an error when waitlist entry is not found', async () => {
      // Mock getWaitlistEntry to return null (entry not found)
      getWaitlistEntry.mockReturnValueOnce(null);
      
      const mockReq = createAdminRequest({ 
        id: 'nonexistent_id', 
        subject: 'Response Subject', 
        message: 'Response Message' 
      });
      
      const res = await waitlistRespondPost(mockReq);
      const responseData = await res.json();
      
      expect(getWaitlistEntry).toHaveBeenCalledWith('nonexistent_id');
      expect(addResponseToEntry).not.toHaveBeenCalled();
      expect(res.status).toBe(404);
      expect(responseData.success).toBe(false);
    });
  });
}); 