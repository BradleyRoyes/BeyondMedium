import { EmailResponse } from './types';

/**
 * Subscribe an email to the waitlist and send notification to connect@beyondmedium.com
 * 
 * @param email - The email address to subscribe
 * @returns A Promise with the API response
 */
export const subscribeToWaitlist = async (email: string): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to subscribe to waitlist');
    }
    
    return data as EmailResponse;
  } catch (error) {
    console.error('Waitlist subscription error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}; 