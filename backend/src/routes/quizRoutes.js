const express = require("express");
const Question = require("../models/Question");
const UserProgress = require("../models/UserProgress");

const router = express.Router();

// GET /api/quiz/generate
router.get("/generate", async (req, res) => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) return res.json([]);
    const questions = count <= 10
      ? await Question.find()
      : await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Quiz generate error:", err);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
});

// POST /api/quiz/submit — userId from body (no auth required for now)
router.post("/submit", async (req, res) => {
  try {
    const { score, total, userId } = req.body;
    if (!userId) return res.json({ message: "Score received (not saved — no userId)" });
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { $push: { quizScores: { score, total, date: new Date() } }, $inc: { currentStreak: 1 } },
      { new: true, upsert: true }
    );
    res.json({ message: "Score saved", progress });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({ message: "Failed to submit score" });
  }
});

module.exports = router;