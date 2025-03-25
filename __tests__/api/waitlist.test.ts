/**
 * @jest-environment node
 */

import { POST as waitlistPost } from '@/app/api/waitlist/route';
import { getWaitlistEntries, addWaitlistEntry } from '@/lib/db';

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
  getWaitlistEntries: jest.fn(),
  addWaitlistEntry: jest.fn().mockImplementation((email) => ({
    id: 'test-id',
    email,
    timestamp: new Date().toISOString(),
    responded: false,
    conversations: [{
      from: 'system',
      to: email,
      subject: 'Welcome to the BeyondMedium Waitlist',
      message: 'Thank you for joining our waitlist! We\'ll keep you updated on our progress.',
      timestamp: new Date().toISOString()
    }]
  })),
}));

// Create a mock Request object
const createMockRequest = (body: any) => {
  return {
    json: () => Promise.resolve(body),
    headers: new Headers(),
  } as unknown as Request;
};

describe('Waitlist API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully adds a new email to the waitlist', async () => {
    const mockReq = createMockRequest({ email: 'test@example.com' });
    const res = await waitlistPost(mockReq);
    const responseData = await res.json();
    
    expect(addWaitlistEntry).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toBe(200);
    expect(responseData.success).toBe(true);
  });

  it('returns an error when email is missing', async () => {
    const mockReq = createMockRequest({});
    const res = await waitlistPost(mockReq);
    const responseData = await res.json();
    
    expect(addWaitlistEntry).not.toHaveBeenCalled();
    expect(res.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Email is required');
  });

  it('handles server errors gracefully', async () => {
    // Mock an implementation error
    addWaitlistEntry.mockImplementationOnce(() => {
      throw new Error('Database error');
    });
    
    const mockReq = createMockRequest({ email: 'test@example.com' });
    const res = await waitlistPost(mockReq);
    const responseData = await res.json();
    
    expect(res.status).toBe(500);
    expect(responseData.success).toBe(false);
  });
}); 