# BeyondMedium Waitlist Email System

This document explains how to set up and use the waitlist email system for BeyondMedium. The system collects email addresses from users who want to join the waitlist and sends emails to both the subscriber and to connect@beyondmedium.com.

## How It Works

1. Users enter their email in the waitlist form on the website.
2. The form submits the email to the `/api/waitlist` endpoint.
3. The API endpoint sends:
   - A notification email to connect@beyondmedium.com with the subscriber's information
   - A branded confirmation email to the subscriber welcoming them to the waitlist
4. The user receives a success message on the website.

## Setup Instructions

### 1. Email Delivery Configuration

The system uses [Resend](https://resend.com) for sending emails, which is much simpler than configuring SMTP servers. You only need to add your Resend API key to the `.env.local` file:

```
# Demo mode - logs emails instead of sending
RESEND_API_KEY=demo

# Production mode - use your actual API key
# RESEND_API_KEY=re_123456789
```

### 2. Testing in Demo Mode

In development, you can use the "demo" mode which doesn't require any credentials. In this mode:

- No actual emails are sent
- The system logs what would have been sent to the console
- The API returns a success response as if the emails were sent

This allows for development and testing without needing to set up any email delivery service.

### 3. Production Setup

For production:

1. Sign up for a [Resend account](https://resend.com)
2. Verify your domain (connect@beyondmedium.com)
3. Create an API key
4. Add the API key to your `.env.local` file or environment variables

```
RESEND_API_KEY=re_your_actual_api_key
```

## Email Templates

The system includes two email templates:

1. **Notification Email**: Sent to connect@beyondmedium.com when someone joins the waitlist
2. **Confirmation Email**: Sent to the subscriber, welcoming them to the waitlist

The confirmation email is designed to match the BeyondMedium brand with:
- Minimalist black background
- Light text for readability
- Brand colors (#a4c2c2) for accents
- Light typography with appropriate spacing

## API Details

### Endpoint: `/api/waitlist`

**Method:** POST

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription successful"
}
```

## Troubleshooting

If emails are not being sent:

1. Check the server logs for any error messages
2. Verify that your Resend API key is correct in `.env.local`
3. Make sure your domain is verified in Resend for production use
4. Check if you're running in demo mode (RESEND_API_KEY=demo)
5. Ensure the endpoint is being called correctly from the frontend

## Security Considerations

- The `.env.local` file is excluded from git to protect your API key
- Resend handles email delivery security, reducing your operational burden
- Consider adding rate limiting to the API endpoint to prevent abuse 