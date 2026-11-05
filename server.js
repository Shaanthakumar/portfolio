import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// =========================================================================
// SMTP CONFIGURATION & PLACEHOLDERS
// Fill these in directly or configure via .env file
// =========================================================================
const SMTP_CONFIG = {
  // Common SMTP hosts:
  // - Gmail: 'smtp.gmail.com'
  // - Outlook / Hotmail: 'smtp-mail.outlook.com'
  // - Brevo (Sendinblue): 'smtp-relay.brevo.com'
  // - Mailgun: 'smtp.mailgun.org'
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10), // 587 for TLS, 465 for SSL
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || 'YOUR_EMAIL@gmail.com', // <-- [PLACEHOLDER] Your email address
    pass: process.env.SMTP_PASS || 'YOUR_APP_PASSWORD',     // <-- [PLACEHOLDER] Your 16-character App Password
  },
};

// =========================================================================
// RECIPIENT INBOX (Where inquiries will be sent)
// =========================================================================
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'YOUR_INBOX_EMAIL@gmail.com'; // <-- [PLACEHOLDER] Your inbox email

// Initialize Transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Test SMTP connection on server startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('\n[!] SMTP Connection Notice:');
    console.warn('    Could not verify SMTP credentials yet. Please update the placeholders in .env or server.js');
    console.warn(`    Details: ${error.message}\n`);
  } else {
    console.log('\n[+] SMTP Server is verified and ready to send emails to your inbox!\n');
  }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, query } = req.body;

  if (!name || !query) {
    return res.status(400).json({ 
      error: 'Please provide both your name and your query message.' 
    });
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${SMTP_CONFIG.auth.user}>`,
    to: RECIPIENT_EMAIL,
    replyTo: email || undefined,
    subject: `🚀 New Portfolio Message from ${name}`,
    text: `You received a new inquiry from your portfolio website:

Name: ${name}
Email: ${email || 'Not specified'}
Phone: ${phone || 'Not specified'}

Query / Message:
${query}
`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0e4f4a; color: #f1eee8; padding: 30px; border-radius: 16px; border: 1px solid rgba(241, 238, 232, 0.2);">
        <h2 style="color: #FF655E; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">New Portfolio Inquiry</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #f1eee8;">You have received a new contact submission from your portfolio website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(241, 238, 232, 0.05); border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; width: 30%; border-bottom: 1px solid rgba(241, 238, 232, 0.1);">Name:</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid rgba(241, 238, 232, 0.1);">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid rgba(241, 238, 232, 0.1);">Email:</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid rgba(241, 238, 232, 0.1);"><a href="mailto:${email}" style="color: #FF655E; text-decoration: none;">${email || 'Not specified'}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid rgba(241, 238, 232, 0.1);">Phone:</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid rgba(241, 238, 232, 0.1);">${phone || 'Not specified'}</td>
          </tr>
        </table>

        <div style="background: rgba(241, 238, 232, 0.1); padding: 18px; border-radius: 8px; margin-top: 20px;">
          <h4 style="margin-top: 0; color: #FF655E; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">Message / Query:</h4>
          <p style="white-space: pre-wrap; margin-bottom: 0; font-size: 15px; line-height: 1.6;">${query}</p>
        </div>

        <p style="font-size: 12px; opacity: 0.6; margin-top: 30px; text-align: center;">
          Sent automatically via Shaanthakumar Portfolio SMTP Service
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[+] Email successfully sent for ${name} [Message ID: ${info.messageId}]`);
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('[-] Error sending email via SMTP:', error);
    return res.status(500).json({ 
      error: 'Failed to send message via SMTP server. Check server logs.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'portfolio-smtp-server' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Portfolio SMTP Server is running on http://localhost:${PORT}`);
  console.log(`   POST endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`=======================================================`);
});
