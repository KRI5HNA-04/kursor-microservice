const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3004;
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

console.log("👤 Initializing User Service...");

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

// Utility function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "user-service",
    timestamp: new Date().toISOString(),
    port: PORT,
    database: "connected",
  });
});

// POST: User registration
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required: name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.password) {
      return res.status(409).json({
        error: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password: hashedPassword,
        image: name.charAt(0).toUpperCase(),
      },
      create: {
        name,
        email,
        password: hashedPassword,
        image: name.charAt(0).toUpperCase(),
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("User registered:", user.email);
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.error("POST /auth/signup error:", error);
    res.status(500).json({
      error: "Failed to create user",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// POST: User login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Handle long image URLs
    let image = user.image;
    if (image && image.length > 300) {
      image = `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(
        user.name || "User"
      )}`;
    }

    console.log("User logged in:", user.email);
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image,
      },
      token,
    });
  } catch (error) {
    console.error("POST /auth/login error:", error);
    res.status(500).json({
      error: "Failed to authenticate user",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// POST: Token validation
app.post("/auth/validate", (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = verifyToken(token);
    res.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: "Invalid or expired token",
    });
  }
});

// GET: Get user profile
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        mobile: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        createdAt: true,
        _count: {
          select: {
            savedCodes: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ...user,
      snippetCount: user._count.savedCodes,
    });
  } catch (error) {
    console.error("GET /profile error:", error);
    res.status(500).json({
      error: "Failed to fetch profile",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// PUT: Update user profile
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, image, mobile, bio, githubUrl, linkedinUrl } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (bio !== undefined) updateData.bio = bio;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        mobile: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        updatedAt: true,
      },
    });

    console.log("Profile updated for user:", req.user.email);
    res.json(updatedUser);
  } catch (error) {
    console.error("PUT /profile error:", error);
    res.status(500).json({
      error: "Failed to update profile",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// POST: Change password
app.post("/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || !user.password) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedNewPassword },
    });

    console.log("Password changed for user:", req.user.email);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("POST /auth/change-password error:", error);
    res.status(500).json({
      error: "Failed to change password",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Get user by ID (for inter-service communication)
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Search users (limited info for privacy)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          githubUrl: true,
          linkedinUrl: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({
      error: "Failed to search users",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
});

// GET: Service info
app.get("/info", (req, res) => {
  res.json({
    service: "user-service",
    version: "1.0.0",
    features: [
      "authentication",
      "user-profiles",
      "jwt-tokens",
      "password-management",
    ],
    endpoints: [
      "GET /health",
      "POST /auth/signup",
      "POST /auth/login",
      "POST /auth/validate",
      "POST /auth/change-password",
      "GET /profile",
      "PUT /profile",
      "GET /users/:id",
      "GET /users",
      "GET /info",
    ],
    environment: process.env.NODE_ENV || "development",
    database: "prisma",
    tokenExpiry: "7d",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    requestedPath: req.originalUrl,
    availableEndpoints: [
      "GET /health",
      "POST /auth/signup",
      "POST /auth/login",
      "POST /auth/validate",
      "POST /auth/change-password",
      "GET /profile",
      "PUT /profile",
      "GET /users/:id",
      "GET /users",
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
  console.log("👤 Shutting down User Service...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("👤 Shutting down User Service...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
  console.log(`👤 User Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth/*`);
  console.log(`👤 Profile endpoint: http://localhost:${PORT}/profile`);
  console.log(`🔧 Service info: http://localhost:${PORT}/info`);
});

module.exports = app;
