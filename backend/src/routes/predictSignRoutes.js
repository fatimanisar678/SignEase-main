const express = require("express");

const router = express.Router();

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

// POST /api/predict-sign
// Body: { imageBase64: "..." }
router.post("/", async (req, res) => {
  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ message: "imageBase64 is required" });
    }

    const mlRes = await fetch(`${ML_API_URL}/predict-sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });

    const data = await mlRes.json().catch(() => ({}));

    if (!mlRes.ok) {
      return res.status(502).json({
        message: "ML service error",
        status: mlRes.status,
        details: data,
      });
    }

    return res.json(data);
  } catch (err) {
    console.error("Predict sign proxy error:", err);
    return res.status(500).json({ message: "Failed to predict sign" });
  }
});

module.exports = router;

