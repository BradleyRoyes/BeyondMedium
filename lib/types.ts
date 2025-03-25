export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface Conversation {
  from: string;
  to: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: string;
  responded: boolean;
  conversations: Conversation[];
}

export interface CustomEmail {
  id: string;
  to: string;
  subject: string;
  message: string;
  timestamp: string;
} 