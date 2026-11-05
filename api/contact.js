import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, query } = req.body || {};

  if (!name || !query) {
    return res.status(400).json({ error: 'Please provide both your name and your query message.' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipient = process.env.RECIPIENT_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: recipient,
    replyTo: email || undefined,
    subject: `🚀 New Portfolio Message from ${name}`,
    text: `New Portfolio Message:

Name: ${name}
Email: ${email || 'Not specified'}
Phone: ${phone || 'Not specified'}

Query:
${query}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0e4f4a; color: #f1eee8; padding: 25px; border-radius: 12px; border: 1px solid rgba(241, 238, 232, 0.2);">
        <h2 style="color: #FF655E; margin-top: 0;">New Portfolio Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF655E;">${email || 'Not specified'}</a></p>
        <p><strong>Phone:</strong> ${phone || 'Not specified'}</p>
        <hr style="border: 0; border-top: 1px solid rgba(241, 238, 232, 0.2); margin: 15px 0;" />
        <h3 style="color: #f1eee8;">Message:</h3>
        <p style="white-space: pre-wrap; background: rgba(241, 238, 232, 0.1); padding: 15px; border-radius: 8px;">${query}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('SMTP Send Error:', error);
    return res.status(500).json({ error: 'Failed to send message via SMTP server', details: error.message });
  }
}
