const express = require("express");
const Lesson = require("../models/Lesson");

const router = express.Router();

// GET /api/lessons - Returns all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    const formatted = lessons.map((l) => ({
      id: l._id.toString(),
      moduleId: l.moduleId,
      character: l.character,
      description: l.description,
      mediaUrl: l.mediaUrl,
      mlLabel: l.mlLabel,
      hints: l.hints,
      order: l.order,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Lessons error:", err);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
});

// GET /api/lessons/:id - Single lesson by ID
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lesson" });
  }
});

module.exports = router;
