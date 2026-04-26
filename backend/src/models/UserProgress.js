const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    quizScores: [
      {
        score: Number,
        total: Number,
        date: { type: Date, default: Date.now },
      }
    ],
    currentStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
  },
  { timestamps: true }
);

const UserProgress = mongoose.model("UserProgress", userProgressSchema);
module.exports = UserProgress;
