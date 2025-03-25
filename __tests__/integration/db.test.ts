/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { 
  addWaitlistEntry, 
  getWaitlistEntries, 
  getWaitlistEntry, 
  addResponseToEntry,
  recordCustomEmail,
  getCustomEmails
} from '@/lib/db';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue('[]'),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
}));

describe('Database Module', () => {
  const originalProcessCwd = process.cwd;
  const mockCwd = '/mock/cwd';

  beforeAll(() => {
    // Mock process.cwd()
    process.cwd = jest.fn().mockReturnValue(mockCwd);
  });

  afterAll(() => {
    // Restore process.cwd()
    process.cwd = originalProcessCwd;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the module state between tests
    jest.resetModules();
  });

  describe('Waitlist Entries', () => {
    it('adds a new waitlist entry', () => {
      const entry = addWaitlistEntry('test@example.com');
      
      expect(entry).toBeDefined();
      expect(entry.email).toBe('test@example.com');
      expect(entry.responded).toBe(false);
      expect(entry.conversations).toHaveLength(1);
      expect(entry.conversations[0].from).toBe('system');
      expect(entry.conversations[0].to).toBe('test@example.com');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('retrieves all waitlist entries', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'test-id-1',
          email: 'test1@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          responded: false,
          conversations: []
        },
        {
          id: 'test-id-2',
          email: 'test2@example.com',
          timestamp: '2023-01-02T00:00:00.000Z',
          responded: true,
          conversations: []
        }
      ]));
      
      const entries = getWaitlistEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].email).toBe('test1@example.com');
      expect(entries[1].email).toBe('test2@example.com');
    });

    it('retrieves a specific waitlist entry by ID', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'test-id-1',
          email: 'test1@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          responded: false,
          conversations: []
        },
        {
          id: 'test-id-2',
          email: 'test2@example.com',
          timestamp: '2023-01-02T00:00:00.000Z',
          responded: true,
          conversations: []
        }
      ]));
      
      const entry = getWaitlistEntry('test-id-2');
      expect(entry).toBeDefined();
      expect(entry?.id).toBe('test-id-2');
      expect(entry?.email).toBe('test2@example.com');
    });

    it('returns undefined for non-existent waitlist entry', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'test-id-1',
          email: 'test1@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          responded: false,
          conversations: []
        }
      ]));
      
      const entry = getWaitlistEntry('non-existent-id');
      expect(entry).toBeUndefined();
    });

    it('adds a response to a waitlist entry', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'test-id-1',
          email: 'test1@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          responded: false,
          conversations: [
            {
              from: 'system',
              to: 'test1@example.com',
              subject: 'Welcome',
              message: 'Welcome message',
              timestamp: '2023-01-01T00:00:00.000Z'
            }
          ]
        }
      ]));
      
      const updatedEntry = addResponseToEntry('test-id-1', 'Response Subject', 'Response Message');
      
      expect(updatedEntry).toBeDefined();
      expect(updatedEntry?.id).toBe('test-id-1');
      expect(updatedEntry?.responded).toBe(true);
      expect(updatedEntry?.conversations).toHaveLength(2);
      expect(updatedEntry?.conversations[1].from).toBe('connect@beyondmedium.com');
      expect(updatedEntry?.conversations[1].to).toBe('test1@example.com');
      expect(updatedEntry?.conversations[1].subject).toBe('Response Subject');
      expect(updatedEntry?.conversations[1].message).toBe('Response Message');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('returns null when adding a response to a non-existent entry', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'test-id-1',
          email: 'test1@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          responded: false,
          conversations: []
        }
      ]));
      
      const updatedEntry = addResponseToEntry('non-existent-id', 'Response Subject', 'Response Message');
      expect(updatedEntry).toBeNull();
      // writeFileSync should not be called since nothing was updated
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('Custom Emails', () => {
    it('records a custom email', () => {
      const email = recordCustomEmail('test@example.com', 'Custom Subject', 'Custom Message');
      
      expect(email).toBeDefined();
      expect(email.to).toBe('test@example.com');
      expect(email.subject).toBe('Custom Subject');
      expect(email.message).toBe('Custom Message');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('retrieves all custom emails', () => {
      // Mock readFileSync to return some test data
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([
        {
          id: 'email-id-1',
          to: 'test1@example.com',
          subject: 'Subject 1',
          message: 'Message 1',
          timestamp: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 'email-id-2',
          to: 'test2@example.com',
          subject: 'Subject 2',
          message: 'Message 2',
          timestamp: '2023-01-02T00:00:00.000Z'
        }
      ]));
      
      const emails = getCustomEmails();
      expect(emails).toHaveLength(2);
      expect(emails[0].to).toBe('test1@example.com');
      expect(emails[0].subject).toBe('Subject 1');
      expect(emails[1].to).toBe('test2@example.com');
      expect(emails[1].subject).toBe('Subject 2');
    });
  });
}); 