const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;
const prisma = new PrismaClient();

console.log("📝 Initializing Snippet Service...");

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());

// Utility function to validate user (simplified for microservice)
async function getUserFromAuth(authHeader) {
  // In a real implementation, this would validate JWT tokens
  // For now, we'll use a simplified approach with user ID in headers
  if (!authHeader) {
    throw new Error("No authorization header");
  }

  // Extract user ID from auth header (simplified)
  // In production, this would decode and validate JWT
  const userId = authHeader.replace("Bearer ", "");
  if (!userId) {
    throw new Error("Invalid authorization");
  }

  return userId;
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "snippet-service",
    timestamp: new Date().toISOString(),
    port: PORT,
    database: "connected",
  });
});

// GET: List all saved codes for a user
app.get("/snippets", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);

    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { language: { contains: search, mode: "insensitive" } },
      ];
    }

    const [snippets, total] = await Promise.all([
      prisma.savedCode.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          code: true,
        },
      }),
      prisma.savedCode.count({ where }),
    ]);

    res.json({
      snippets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("GET /snippets error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to fetch snippets",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Get a single snippet by ID
app.get("/snippets/:id", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);
    const { id } = req.params;

    const snippet = await prisma.savedCode.findFirst({
      where: { id, userId },
    });

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.json(snippet);
  } catch (error) {
    console.error("GET /snippets/:id error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to fetch snippet",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// POST: Create a new snippet
app.post("/snippets", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);
    const { title, code, language } = req.body;

    if (!title || !code || !language) {
      return res.status(400).json({
        error:
          "Missing required fields: title, code, and language are required",
      });
    }

    const snippet = await prisma.savedCode.create({
      data: {
        userId,
        title: title.trim(),
        code,
        language: language.toLowerCase(),
      },
    });

    console.log("Created snippet:", snippet.id, "for user:", userId);
    res.status(201).json(snippet);
  } catch (error) {
    console.error("POST /snippets error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to create snippet",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// PUT: Update a snippet
app.put("/snippets/:id", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);
    const { id } = req.params;
    const { title, code, language } = req.body;

    // Check if snippet exists and belongs to user
    const existingSnippet = await prisma.savedCode.findFirst({
      where: { id, userId },
    });

    if (!existingSnippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (code !== undefined) updateData.code = code;
    if (language !== undefined) updateData.language = language.toLowerCase();

    const updatedSnippet = await prisma.savedCode.update({
      where: { id },
      data: updateData,
    });

    console.log("Updated snippet:", id, "for user:", userId);
    res.json(updatedSnippet);
  } catch (error) {
    console.error("PUT /snippets/:id error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to update snippet",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// DELETE: Delete a snippet
app.delete("/snippets/:id", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);
    const { id } = req.params;

    // Check if snippet exists and belongs to user
    const existingSnippet = await prisma.savedCode.findFirst({
      where: { id, userId },
    });

    if (!existingSnippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    await prisma.savedCode.delete({
      where: { id },
    });

    console.log("Deleted snippet:", id, "for user:", userId);
    res.json({ success: true, message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("DELETE /snippets/:id error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to delete snippet",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Get snippets by language
app.get("/snippets/language/:language", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);
    const { language } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [snippets, total] = await Promise.all([
      prisma.savedCode.findMany({
        where: {
          userId,
          language: language.toLowerCase(),
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          code: true,
        },
      }),
      prisma.savedCode.count({
        where: {
          userId,
          language: language.toLowerCase(),
        },
      }),
    ]);

    res.json({
      language,
      snippets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("GET /snippets/language/:language error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to fetch snippets by language",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Get snippet statistics for user
app.get("/stats", async (req, res) => {
  try {
    const userId = await getUserFromAuth(req.headers.authorization);

    const [totalSnippets, languageStats, recentSnippets] = await Promise.all([
      prisma.savedCode.count({ where: { userId } }),
      prisma.savedCode.groupBy({
        by: ["language"],
        where: { userId },
        _count: { language: true },
        orderBy: { _count: { language: "desc" } },
      }),
      prisma.savedCode.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          language: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      totalSnippets,
      languageStats: languageStats.map((stat) => ({
        language: stat.language,
        count: stat._count.language,
      })),
      recentSnippets,
    });
  } catch (error) {
    console.error("GET /stats error:", error);
    if (error.message.includes("authorization")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({
      error: "Failed to fetch statistics",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// Get service info
app.get("/info", (req, res) => {
  res.json({
    service: "snippet-service",
    version: "1.0.0",
    features: ["snippet-crud", "search", "pagination", "statistics"],
    endpoints: [
      "GET /health",
      "GET /snippets",
      "GET /snippets/:id",
      "POST /snippets",
      "PUT /snippets/:id",
      "DELETE /snippets/:id",
      "GET /snippets/language/:language",
      "GET /stats",
      "GET /info",
    ],
    environment: process.env.NODE_ENV || "development",
    database: "prisma",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    requestedPath: req.originalUrl,
    availableEndpoints: [
      "GET /health",
      "GET /snippets",
      "GET /snippets/:id",
      "POST /snippets",
      "PUT /snippets/:id",
      "DELETE /snippets/:id",
      "GET /snippets/language/:language",
      "GET /stats",
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

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("📝 Shutting down Snippet Service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("📝 Shutting down Snippet Service...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
  console.log(`📝 Snippet Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗂️  Snippets endpoint: http://localhost:${PORT}/snippets`);
  console.log(`📊 Statistics: http://localhost:${PORT}/stats`);
  console.log(`🔧 Service info: http://localhost:${PORT}/info`);
});

module.exports = app;
