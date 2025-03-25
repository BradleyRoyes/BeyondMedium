import { EmailResponse } from './types';

/**
 * Subscribe an email to the waitlist and send notification to connect@beyondmedium.com
 * 
 * @param email - The email address to subscribe
 * @returns A Promise with the API response
 */
export const subscribeToWaitlist = async (email: string): Promise<EmailResponse> => {
  try {
    console.log('Subscribing to waitlist with email:', email);
    
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Waitlist API response status:', response.status);
    
    // Try to parse the response body
    let data;
    try {
      data = await response.json();
      console.log('Waitlist API response data:', data);
    } catch (parseError) {
      console.error('Error parsing response JSON:', parseError);
      throw new Error('Failed to parse server response');
    }
    
    if (!response.ok) {
      console.error('Non-OK response from waitlist API:', response.status, data);
      throw new Error(data?.message || `Server error: ${response.status}`);
    }
    
    return data as EmailResponse;
  } catch (error) {
    console.error('Waitlist subscription error:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error details:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}; 