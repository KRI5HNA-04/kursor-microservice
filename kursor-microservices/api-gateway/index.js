const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🌐 Initializing API Gateway...");

// Service URLs
const SERVICES = {
  execution: process.env.EXECUTION_SERVICE_URL || "http://localhost:3001",
  communication:
    process.env.COMMUNICATION_SERVICE_URL || "http://localhost:3002",
  snippet: process.env.SNIPPET_SERVICE_URL || "http://localhost:3003",
  user: process.env.USER_SERVICE_URL || "http://localhost:3004",
};

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
    ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Health check for the gateway itself
app.get("/health", async (req, res) => {
  try {
    // Check health of all services
    const healthChecks = await Promise.allSettled([
      fetch(`${SERVICES.execution}/health`)
        .then((r) => r.json())
        .catch(() => ({ status: "down" })),
      fetch(`${SERVICES.communication}/health`)
        .then((r) => r.json())
        .catch(() => ({ status: "down" })),
      fetch(`${SERVICES.snippet}/health`)
        .then((r) => r.json())
        .catch(() => ({ status: "down" })),
      fetch(`${SERVICES.user}/health`)
        .then((r) => r.json())
        .catch(() => ({ status: "down" })),
    ]);

    const serviceHealth = {
      execution:
        healthChecks[0].status === "fulfilled"
          ? healthChecks[0].value
          : { status: "down" },
      communication:
        healthChecks[1].status === "fulfilled"
          ? healthChecks[1].value
          : { status: "down" },
      snippet:
        healthChecks[2].status === "fulfilled"
          ? healthChecks[2].value
          : { status: "down" },
      user:
        healthChecks[3].status === "fulfilled"
          ? healthChecks[3].value
          : { status: "down" },
    };

    const allHealthy = Object.values(serviceHealth).every(
      (service) => service.status === "healthy"
    );

    res.json({
      status: allHealthy ? "healthy" : "degraded",
      gateway: "api-gateway",
      timestamp: new Date().toISOString(),
      services: serviceHealth,
      port: PORT,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "unhealthy",
      gateway: "api-gateway",
      error: "Failed to check service health",
      timestamp: new Date().toISOString(),
    });
  }
});

// Authentication middleware for protected routes
async function authenticateRequest(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }

    // Extract token and validate with user service
    const token = authHeader.replace("Bearer ", "");
    const validateResponse = await fetch(`${SERVICES.user}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!validateResponse.ok) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userData = await validateResponse.json();
    req.user = userData.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication service unavailable" });
  }
}

// Gateway info endpoint
app.get("/info", (req, res) => {
  res.json({
    service: "api-gateway",
    version: "1.0.0",
    description: "API Gateway for Kursor microservices architecture",
    services: SERVICES,
    routes: {
      "/auth/*": "User authentication (user-service)",
      "/users/*": "User management (user-service)",
      "/profile": "User profiles (user-service)",
      "/snippets/*": "Code snippet management (snippet-service)",
      "/execute": "Code execution (execution-service)",
      "/contact": "Contact form (communication-service)",
      "/notify": "Notifications (communication-service)",
      "/health": "Gateway and services health",
      "/info": "Gateway information",
    },
    environment: process.env.NODE_ENV || "development",
  });
});

// User Service Routes (Authentication - No auth required for login/signup)
app.use(
  "/auth",
  createProxyMiddleware({
    target: SERVICES.user,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/auth",
    },
    onError: (err, req, res) => {
      console.error("User service proxy error:", err);
      res.status(503).json({ error: "User service unavailable" });
    },
  })
);

// User Service Routes (Protected routes)
app.use(
  "/users",
  authenticateRequest,
  createProxyMiddleware({
    target: SERVICES.user,
    changeOrigin: true,
    pathRewrite: {
      "^/users": "/users",
    },
    onError: (err, req, res) => {
      console.error("User service proxy error:", err);
      res.status(503).json({ error: "User service unavailable" });
    },
  })
);

app.use(
  "/profile",
  authenticateRequest,
  createProxyMiddleware({
    target: SERVICES.user,
    changeOrigin: true,
    pathRewrite: {
      "^/profile": "/profile",
    },
    onError: (err, req, res) => {
      console.error("User service proxy error:", err);
      res.status(503).json({ error: "User service unavailable" });
    },
  })
);

// Snippet Service Routes (Protected)
app.use(
  "/snippets",
  authenticateRequest,
  (req, res, next) => {
    // Add user ID to headers for snippet service
    req.headers.authorization = `Bearer ${req.user.userId}`;
    next();
  },
  createProxyMiddleware({
    target: SERVICES.snippet,
    changeOrigin: true,
    pathRewrite: {
      "^/snippets": "/snippets",
    },
    onError: (err, req, res) => {
      console.error("Snippet service proxy error:", err);
      res.status(503).json({ error: "Snippet service unavailable" });
    },
  })
);

app.use(
  "/stats",
  authenticateRequest,
  (req, res, next) => {
    // Add user ID to headers for snippet service
    req.headers.authorization = `Bearer ${req.user.userId}`;
    next();
  },
  createProxyMiddleware({
    target: SERVICES.snippet,
    changeOrigin: true,
    pathRewrite: {
      "^/stats": "/stats",
    },
    onError: (err, req, res) => {
      console.error("Snippet service proxy error:", err);
      res.status(503).json({ error: "Snippet service unavailable" });
    },
  })
);

// Execution Service Routes (Protected)
app.use(
  "/execute",
  authenticateRequest,
  createProxyMiddleware({
    target: SERVICES.execution,
    changeOrigin: true,
    pathRewrite: {
      "^/execute": "/execute",
    },
    onError: (err, req, res) => {
      console.error("Execution service proxy error:", err);
      res.status(503).json({ error: "Code execution service unavailable" });
    },
  })
);

// Communication Service Routes (Protected)
app.use(
  "/contact",
  createProxyMiddleware({
    target: SERVICES.communication,
    changeOrigin: true,
    pathRewrite: {
      "^/contact": "/contact",
    },
    onError: (err, req, res) => {
      console.error("Communication service proxy error:", err);
      res.status(503).json({ error: "Communication service unavailable" });
    },
  })
);

app.use(
  "/notify",
  authenticateRequest,
  createProxyMiddleware({
    target: SERVICES.communication,
    changeOrigin: true,
    pathRewrite: {
      "^/notify": "/notify",
    },
    onError: (err, req, res) => {
      console.error("Communication service proxy error:", err);
      res.status(503).json({ error: "Communication service unavailable" });
    },
  })
);

// Service discovery endpoint
app.get("/services", async (req, res) => {
  try {
    const serviceInfo = await Promise.allSettled([
      fetch(`${SERVICES.execution}/info`).then((r) => r.json()),
      fetch(`${SERVICES.communication}/info`).then((r) => r.json()),
      fetch(`${SERVICES.snippet}/info`).then((r) => r.json()),
      fetch(`${SERVICES.user}/info`).then((r) => r.json()),
    ]);

    res.json({
      gateway: "api-gateway",
      services: {
        execution:
          serviceInfo[0].status === "fulfilled"
            ? serviceInfo[0].value
            : { status: "unavailable" },
        communication:
          serviceInfo[1].status === "fulfilled"
            ? serviceInfo[1].value
            : { status: "unavailable" },
        snippet:
          serviceInfo[2].status === "fulfilled"
            ? serviceInfo[2].value
            : { status: "unavailable" },
        user:
          serviceInfo[3].status === "fulfilled"
            ? serviceInfo[3].value
            : { status: "unavailable" },
      },
    });
  } catch (error) {
    console.error("Service discovery error:", error);
    res.status(500).json({ error: "Service discovery failed" });
  }
});

// Aggregated dashboard endpoint
app.get("/dashboard", async (req, res) => {
  try {
    // Get service health and basic stats without authentication
    const [healthChecks, serviceStats] = await Promise.allSettled([
      Promise.allSettled([
        fetch(`${SERVICES.execution}/health`).then((r) => r.json()),
        fetch(`${SERVICES.communication}/health`).then((r) => r.json()),
        fetch(`${SERVICES.snippet}/health`).then((r) => r.json()),
        fetch(`${SERVICES.user}/health`).then((r) => r.json()),
      ]),
      Promise.allSettled([
        fetch(`${SERVICES.execution}/info`).then((r) => r.json()),
        fetch(`${SERVICES.communication}/info`).then((r) => r.json()),
        fetch(`${SERVICES.snippet}/info`).then((r) => r.json()),
        fetch(`${SERVICES.user}/info`).then((r) => r.json()),
      ]),
    ]);

    const serviceHealth =
      healthChecks.status === "fulfilled" ? healthChecks.value : [];
    const serviceInfo =
      serviceStats.status === "fulfilled" ? serviceStats.value : [];

    res.json({
      gateway: {
        name: "api-gateway",
        status: "healthy",
        port: PORT,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      services: {
        execution: {
          health:
            serviceHealth[0]?.status === "fulfilled"
              ? serviceHealth[0].value
              : { status: "down" },
          info:
            serviceInfo[0]?.status === "fulfilled"
              ? serviceInfo[0].value
              : { status: "unavailable" },
          url: SERVICES.execution,
        },
        communication: {
          health:
            serviceHealth[1]?.status === "fulfilled"
              ? serviceHealth[1].value
              : { status: "down" },
          info:
            serviceInfo[1]?.status === "fulfilled"
              ? serviceInfo[1].value
              : { status: "unavailable" },
          url: SERVICES.communication,
        },
        snippet: {
          health:
            serviceHealth[2]?.status === "fulfilled"
              ? serviceHealth[2].value
              : { status: "down" },
          info:
            serviceInfo[2]?.status === "fulfilled"
              ? serviceInfo[2].value
              : { status: "unavailable" },
          url: SERVICES.snippet,
        },
        user: {
          health:
            serviceHealth[3]?.status === "fulfilled"
              ? serviceHealth[3].value
              : { status: "down" },
          info:
            serviceInfo[3]?.status === "fulfilled"
              ? serviceInfo[3].value
              : { status: "unavailable" },
          url: SERVICES.user,
        },
      },
      summary: {
        totalServices: 4,
        healthyServices: serviceHealth.filter(
          (s) => s.status === "fulfilled" && s.value?.status !== "down"
        ).length,
        gatewayVersion: "1.0.0",
        environment: process.env.NODE_ENV || "development",
      },
    });
  } catch (error) {
    console.error("Dashboard aggregation error:", error);
    res.status(500).json({
      error: "Failed to aggregate dashboard data",
      gateway: "api-gateway",
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    gateway: "api-gateway",
    requestedPath: req.originalUrl,
    availableRoutes: [
      "GET /health",
      "GET /info",
      "GET /services",
      "GET /dashboard",
      "POST /auth/signup",
      "POST /auth/login",
      "GET /profile",
      "PUT /profile",
      "GET /snippets",
      "POST /snippets",
      "GET /execute",
      "POST /contact",
      "POST /notify",
    ],
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Gateway error:", error);
  res.status(500).json({
    error: "Internal gateway error",
    gateway: "api-gateway",
    details: process.env.NODE_ENV !== "production" ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start API Gateway:", err);
    process.exit(1);
  }
  console.log(`🌐 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Gateway info: http://localhost:${PORT}/info`);
  console.log(`🏢 Service discovery: http://localhost:${PORT}/services`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log("");
  console.log("🎯 Routing configuration:");
  console.log(`   /auth/* → User Service (${SERVICES.user})`);
  console.log(`   /snippets/* → Snippet Service (${SERVICES.snippet})`);
  console.log(`   /execute → Execution Service (${SERVICES.execution})`);
  console.log(
    `   /contact → Communication Service (${SERVICES.communication})`
  );
});

module.exports = app;
