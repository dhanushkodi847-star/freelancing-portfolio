// ==============================
// Portfolio Contact Form - Backend Server
// ==============================

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ── Initialize Express App ──
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors()); // Allow frontend requests from any origin
app.use(express.json()); // Parse incoming JSON data

// ── Create Nodemailer Transporter (Gmail SMTP) ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Verify Email Connection on Startup ──
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error.message);
    console.error("   Make sure your EMAIL_USER and EMAIL_PASS are correct in .env");
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// ── Health Check Route ──
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    message: "Portfolio Contact Form API",
  });
});

// ══════════════════════════════════════
//  POST /contact — Handle Contact Form
// ══════════════════════════════════════
app.post("/contact", async (req, res) => {
  // 1. Extract data from request body
  const { name, email, message } = req.body;

  // 2. Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required (name, email, message)",
    });
  }

  // 3. Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address",
    });
  }

  // 4. Configure the email
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    replyTo: email, // So you can reply directly to the sender
    subject: "New Contact Form Message",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6c5ce7, #a855f7); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Someone reached out via your portfolio!</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px;">
          
          <!-- Sender Name -->
          <div style="margin-bottom: 20px; padding: 16px; background: #12121a; border-radius: 8px; border-left: 4px solid #6c5ce7;">
            <p style="color: #888; margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
            <p style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">${name}</p>
          </div>
          
          <!-- Sender Email -->
          <div style="margin-bottom: 20px; padding: 16px; background: #12121a; border-radius: 8px; border-left: 4px solid #a855f7;">
            <p style="color: #888; margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
            <p style="color: #ffffff; margin: 0; font-size: 16px;">
              <a href="mailto:${email}" style="color: #a855f7; text-decoration: none;">${email}</a>
            </p>
          </div>
          
          <!-- Message -->
          <div style="margin-bottom: 20px; padding: 16px; background: #12121a; border-radius: 8px; border-left: 4px solid #6c5ce7;">
            <p style="color: #888; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="color: #e0e0e0; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <!-- Reply Button -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${email}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6c5ce7, #a855f7); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Reply to ${name}
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 16px 30px; background: #08080d; text-align: center; border-top: 1px solid #1a1a2e;">
          <p style="color: #555; margin: 0; font-size: 12px;">Sent from your Portfolio Contact Form</p>
        </div>
      </div>
    `,
  };

  // 5. Send the email
  try {
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent from ${name} (${email})`);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📬 Contact endpoint: POST http://localhost:${PORT}/contact\n`);
});
