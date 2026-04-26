const express = require("express");

const router = express.Router();

// POST /api/gesture
// Placeholder endpoint for future AI/ML gesture recognition.
// Expects a JSON payload that will later contain gesture data (e.g. frames, landmarks, etc.).
router.post("/", async (req, res) => {
  try {
    // For now, just return a static response so the frontend
    // can be wired up and tested without an ML model.
    res.status(200).json({
      message: "Gesture recognition is not implemented yet.",
      recognizedGesture: null,
      confidence: null,
    });
  } catch (err) {
    console.error("Gesture placeholder error:", err);
    res.status(500).json({ message: "Failed to process gesture placeholder request" });
  }
});

module.exports = router;

