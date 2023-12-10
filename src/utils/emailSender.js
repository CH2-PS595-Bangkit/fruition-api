// utils/emailSender.js

const { google } = require('googleapis');

// Konfigurasi kredensial OAuth2
const OAuth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'YOUR_REDIRECT_URL'
);

// Set kredensial OAuth2
OAuth2Client.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN',
});

// Fungsi untuk mengirim email
const sendEmail = async ({ to, subject, message }) => {
  try {
    const gmail = google.gmail({
      version: 'v1',
      auth: OAuth2Client,
    });

    const emailLines = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      `To: ${to}`,
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      `${message}`,
    ].join('\n');

    const encodedEmail = Buffer.from(emailLines).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
