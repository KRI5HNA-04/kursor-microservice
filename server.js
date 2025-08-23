const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Kursor Backend API is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Kursor Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// API endpoints
app.get("/api", (req, res) => {
  res.json({
    message: "Kursor API is working!",
    services: [
      "code-execution",
      "user-management",
      "code-snippets",
      "communication",
    ],
  });
});

// Code execution endpoint (mock for now)
app.post("/api/execute", (req, res) => {
  const { code, language } = req.body;

  // Mock response
  res.json({
    success: true,
    output: `Mock execution result for ${language} code`,
    execution_time: "0.123s",
    memory_used: "1.2MB",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Kursor Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
