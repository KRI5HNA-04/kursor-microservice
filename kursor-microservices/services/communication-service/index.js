const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

console.log("📧 Initializing Communication Service...");

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "communication-service",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate request
    if (!name || !email || !message) {
      return res.status(400).json({
        error:
          "Missing required fields: name, email, and message are required.",
      });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // For demo purposes, if no real API key, just return success
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY.includes("your_actual_resend_api_key_here")
    ) {
      console.log("📧 Demo mode - Contact form received:", {
        name,
        email,
        message: message.substring(0, 50) + "...",
      });
      return res.json({
        success: true,
        messageId: "demo_" + Date.now(),
        message: "Your message has been received (demo mode)!",
      });
    }

    // Check for required environment variables
    if (!process.env.CONTACT_ADMIN_EMAIL) {
      console.error("Missing CONTACT_ADMIN_EMAIL environment variable");
      return res.status(500).json({
        error: "Server email configuration is missing",
      });
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Kursor Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_ADMIN_EMAIL],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #6366f1;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This email was sent from the Kursor contact form.
          </p>
        </div>
      `,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return res.status(500).json({
        error: "Failed to send message",
        details:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      });
    }

    console.log("Email sent successfully:", data);
    res.json({
      success: true,
      messageId: data?.id,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("/contact error:", error);
    res.status(500).json({
      error: "Failed to send message",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// Send notification endpoint (for future use)
app.post("/notify", async (req, res) => {
  try {
    const { to, subject, message, type = "notification" } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        error:
          "Missing required fields: to, subject, and message are required.",
      });
    }

    // Demo mode check
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY.includes("your_actual_resend_api_key_here")
    ) {
      console.log("📧 Demo mode - Notification would be sent:", {
        to,
        subject,
        type,
      });
      return res.json({
        success: true,
        messageId: "demo_notification_" + Date.now(),
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Kursor Notifications <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This is a ${type} from Kursor.
          </p>
        </div>
      `,
      text: message,
    });

    if (error) {
      console.error("Notification send error:", error);
      return res.status(500).json({
        error: "Failed to send notification",
        details:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      });
    }

    res.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("/notify error:", error);
    res.status(500).json({
      error: "Failed to send notification",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// Get service info
app.get("/info", (req, res) => {
  res.json({
    service: "communication-service",
    version: "1.0.0",
    features: ["contact-form", "notifications"],
    endpoints: ["GET /health", "POST /contact", "POST /notify", "GET /info"],
    environment: process.env.NODE_ENV || "development",
    hasResendKey: !!(
      process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.includes("your_actual_resend_api_key_here")
    ),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    requestedPath: req.originalUrl,
    availableEndpoints: [
      "GET /health",
      "POST /contact",
      "POST /notify",
      "GET /info",
    ],
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV !== "production" ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
  console.log(`📧 Communication Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`✉️  Contact endpoint: http://localhost:${PORT}/contact`);
  console.log(`🔧 Service info: http://localhost:${PORT}/info`);
});

module.exports = app;
