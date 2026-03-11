const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper to format user for response (matches frontend variables)
const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  level: user.level,
  streakDays: user.streakDays,
  lessonsCompleted: user.lessonsCompleted,
  quizScore: user.quizScore,
});

// POST /api/auth/signup - Body: { fullName, email, password }
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "fullName, email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const token = createToken(user._id.toString());

    res.status(201).json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Failed to create account" });
  }
});

// POST /api/auth/login - Body: { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    res.json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Failed to log in" });
  }
});

// GET /api/auth/me - Header: Authorization: Bearer <token>
router.get("/me", auth, (req, res) => {
  res.json(formatUser(req.user));
});

// PUT /api/auth/me - Update profile/progress (fullName, level, streakDays, lessonsCompleted, quizScore)
router.put("/me", auth, async (req, res) => {
  const allowedFields = ["fullName", "level", "streakDays", "lessonsCompleted", "quizScore"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    res.json(formatUser(user));
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
