const express = require("express");
const Lesson = require("../models/Lesson");

const router = express.Router();

// GET /api/lessons - Returns lessons matching frontend structure: id, title, level, duration
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    const formatted = lessons.map((l) => ({
      id: l._id.toString(),
      title: l.title,
      level: l.level,
      duration: l.duration,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Lessons error:", err);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
});

module.exports = router;
