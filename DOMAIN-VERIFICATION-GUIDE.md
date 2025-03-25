# Domain Verification Guide for Resend

## Overview
The error message you received (`The beyondmedium.com domain is not verified`) indicates that you need to verify domain ownership before you can send emails from `connect@beyondmedium.com`.

## Steps to Verify Your Domain

1. **Login to Resend**: Visit [https://resend.com/domains](https://resend.com/domains) and login to your account.

2. **Add Your Domain**: 
   - Click on "Add Domain"
   - Enter `beyondmedium.com` as your domain
   - Click "Add"

3. **Configure DNS Records**: Resend will provide you with specific DNS records to add to your domain provider. These typically include:
   - A TXT record for domain verification
   - DKIM records for email authentication
   - An optional MX record for handling replies
   - An optional SPF record

4. **Add the DNS Records to Your Domain Provider**:
   - Login to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains)
   - Navigate to DNS settings or DNS management
   - Add all the records provided by Resend
   - Save the changes

5. **Verify Your Domain in Resend**:
   - After adding the DNS records, go back to Resend
   - Click "Verify" or "Check DNS" for your domain
   - DNS changes can take 24-48 hours to propagate, but often they are much faster (minutes to a few hours)

6. **Test Sending Emails**:
   - Once verified, test sending an email to confirm everything is working

## Common DNS Record Types

### TXT Record for Domain Verification
Example:
- Name/Host: `_resend` or `@`
- Value: `resend-verification=yourverificationcode`
- TTL: Default or 3600

### DKIM Records
Example:
- Name/Host: `selector._domainkey` (Resend will specify the exact selector)
- Value: A long string provided by Resend
- TTL: Default or 3600

### SPF Record (Optional but Recommended)
Example:
- Name/Host: `@`
- Value: `v=spf1 include:spf.resend.com ~all`
- TTL: Default or 3600

## Temporary Workaround

While you're waiting for domain verification, you can use a verified sender from Resend's shared domains:

1. In your `.env.local` file, keep your API key
2. In your email sending code (app/api/waitlist/route.ts), temporarily change:
   ```javascript
   from: 'Beyond Medium <connect@beyondmedium.com>'
   ```
   
   To a Resend-provided address:
   ```javascript
   from: 'Beyond Medium <onboarding@resend.dev>'
   ```

3. Once your domain is verified, switch back to your own domain email.

## Support

If you encounter any issues with domain verification, Resend's support documentation is available at [https://resend.com/docs/dashboard/domains/introduction](https://resend.com/docs/dashboard/domains/introduction). 