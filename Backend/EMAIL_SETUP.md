# Email Configuration Environment Variables

## Required for Email Functionality

Add these environment variables to your `.env` file to enable email confirmation for bookings:

```env
# Email Service Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM="Booking Platform <noreply@yourdomain.com>"
```

## Configuration Guide

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account Settings → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASSWORD`

### Other SMTP Providers

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM="Your Company <noreply@yourdomain.com>"
```

#### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM="Your Company <noreply@yourdomain.com>"
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM="Your Company <noreply@yourdomain.com>"
```

## Testing

To test the email functionality:

1. Configure the environment variables
2. Create a test booking
3. Complete the payment (via webhook)
4. Check the recipient's inbox for the confirmation email

## Troubleshooting

- **Emails not sending**: Check SMTP credentials and firewall settings
- **Emails going to spam**: Configure SPF, DKIM, and DMARC records for your domain
- **Connection timeout**: Verify EMAIL_HOST and EMAIL_PORT are correct
- **Authentication failed**: Ensure EMAIL_USER and EMAIL_PASSWORD are correct

## Email Recipients

The system sends confirmation emails to:

- **Hotel Bookings**: User + Hotel Owner
- **Event Bookings**: User + All Assigned Instructors
- **Session Bookings**: User + Instructor
- **Item Bookings**: User + Item Owners
