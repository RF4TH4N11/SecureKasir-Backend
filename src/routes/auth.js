import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Hardcoded admin credentials (bisa di-move ke env variable)
const ADMIN_CREDENTIALS = {
  email: "admin@mugiberkah.com",
  password: "admin123",
};

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * Login endpoint
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email dan password harus diisi",
      });
    }

    // Check credentials
    if (
      email !== ADMIN_CREDENTIALS.email ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return res.status(401).json({
        success: false,
        error: "Email atau password salah",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: "admin",
        email: ADMIN_CREDENTIALS.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return token dan user info
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: "admin",
          email: ADMIN_CREDENTIALS.email,
          name: "Administrator",
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Verify token endpoint (optional, untuk validasi token)
 * GET /api/auth/verify
 * Header: Authorization: Bearer <token>
 */
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

/**
 * Middleware untuk authenticate token
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token tidak ditemukan",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Token tidak valid atau sudah expired",
      });
    }
    req.user = user;
    next();
  });
}

export default router;
