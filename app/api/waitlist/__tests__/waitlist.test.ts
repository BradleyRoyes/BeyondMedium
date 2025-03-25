import { NextRequest } from 'next/server';
import { POST } from '../route';
import { Resend } from 'resend';

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: jest.fn().mockResolvedValue({
            id: 'email_123456789',
            from: 'connect@beyondmedium.com',
            to: ['test@example.com'],
            created_at: new Date().toISOString(),
          }),
        },
      };
    }),
  };
});

describe('Waitlist API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set environment to test mode
    process.env.RESEND_API_KEY = 'test_api_key';
  });

  it('should return 400 if email is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      message: 'Email is required',
    });
  });

  it('should send both notification and confirmation emails and return success response', async () => {
    const testEmail = 'test@example.com';
    const request = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Check that Resend was initialized with API key
    expect(Resend).toHaveBeenCalledWith('test_api_key');
    
    // Get the mock instance
    const resendInstance = new Resend();
    
    // Should be called twice: once for notification, once for confirmation
    expect(resendInstance.emails.send).toHaveBeenCalledTimes(2);
    
    // Verify notification email (to connect@beyondmedium.com)
    expect(resendInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['connect@beyondmedium.com'],
        subject: 'New Waitlist Subscription',
      })
    );
    
    // Verify confirmation email (to subscriber)
    expect(resendInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [testEmail],
        subject: 'Welcome to the BeyondMedium Waitlist',
      })
    );

    // Check response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: 'Subscription successful',
    });
  });

  it('should handle demo mode correctly without sending actual emails', async () => {
    // Set demo mode
    process.env.RESEND_API_KEY = 'demo';
    
    const testEmail = 'test@example.com';
    const request = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Check demo mode indicator in response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: 'Subscription successful (demo mode)',
    });
    
    // Get the mock instance
    const resendInstance = new Resend();
    
    // Should not call send in demo mode
    expect(resendInstance.emails.send).not.toHaveBeenCalled();
  });
}); 