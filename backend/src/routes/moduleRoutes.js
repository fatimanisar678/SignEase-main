const express = require("express");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

const router = express.Router();

// GET /api/modules - Returns all curriculum modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json(modules);
  } catch (err) {
    console.error("Modules error:", err);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
});

// GET /api/modules/:moduleId/lessons - Returns lessons for a specific module
router.get("/:moduleId/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    console.error("Lessons error:", err);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
});

module.exports = router;
