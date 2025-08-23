console.log("🔄 Starting Communication Service...");

const express = require("express");
console.log("✅ Express loaded");

const app = express();
const PORT = process.env.PORT || 3003;

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "communication-service",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
  console.log(`📧 Communication Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

console.log("🎯 Service configuration complete");
