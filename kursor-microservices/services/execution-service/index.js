const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Language mapping for Judge0 API
const languageMap = {
  javascript: 93,
  python: 71,
  cpp: 54,
  java: 62,
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "execution-service",
    timestamp: new Date().toISOString(),
  });
});

// Code execution endpoint
app.post("/execute", async (req, res) => {
  try {
    const { code, language, input = "" } = req.body;

    // Validate request
    if (!code || !language) {
      return res.status(400).json({
        error: "Missing required fields: code and language",
      });
    }

    if (!languageMap[language]) {
      return res.status(400).json({
        error: `Unsupported language: ${language}. Supported: ${Object.keys(
          languageMap
        ).join(", ")}`,
      });
    }

    // Check for Judge0 API key
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({
        error: "Server configuration error: Missing API key",
      });
    }

    // Submit code to Judge0
    const submissionResponse = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: languageMap[language],
          source_code: code,
          stdin: input,
          encode: true,
        }),
      }
    );

    if (!submissionResponse.ok) {
      const errorText = await submissionResponse.text();
      console.error("Judge0 submission error:", errorText);
      return res.status(500).json({
        error: `Code execution service error: ${submissionResponse.status}`,
        details: process.env.NODE_ENV !== "production" ? errorText : undefined,
      });
    }

    const submissionData = await submissionResponse.json();
    const { token } = submissionData;

    // Return token for status checking
    res.json({
      token,
      message: "Code submitted for execution",
      checkStatusUrl: `/status/${token}`,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// Check execution status endpoint
app.get("/status/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({
        error: "Server configuration error: Missing API key",
      });
    }

    const resultResponse = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (!resultResponse.ok) {
      const errorText = await resultResponse.text();
      console.error("Judge0 result error:", errorText);
      return res.status(500).json({
        error: `Code execution service error: ${resultResponse.status}`,
        details: process.env.NODE_ENV !== "production" ? errorText : undefined,
      });
    }

    const data = await resultResponse.json();

    // Check if execution is still in progress
    if (data.status && data.status.id <= 2) {
      return res.json({
        status: "processing",
        message: "Code is still executing...",
        statusId: data.status.id,
        description: data.status.description,
      });
    }

    // Decode output
    let output = "No output";
    if (data.stdout) {
      output = Buffer.from(data.stdout, "base64").toString();
    } else if (data.compile_output) {
      output = Buffer.from(data.compile_output, "base64").toString();
    } else if (data.stderr) {
      output = Buffer.from(data.stderr, "base64").toString();
    }

    res.json({
      status: "completed",
      output,
      executionTime: data.time,
      memory: data.memory,
      statusId: data.status ? data.status.id : null,
      description: data.status ? data.status.description : null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// Get supported languages
app.get("/languages", (req, res) => {
  res.json({
    languages: Object.keys(languageMap),
    languageMap,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /health",
      "POST /execute",
      "GET /status/:token",
      "GET /languages",
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
app.listen(PORT, () => {
  console.log(`🚀 Execution Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Supported languages: ${Object.keys(languageMap).join(", ")}`);
});

module.exports = app;
