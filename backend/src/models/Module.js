const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
    iconText: { type: String }, // e.g., "ABC" or "#"
    iconColor: { type: String, default: "#CDE0F5" },
    iconName: { type: String }, // Ionicons name if no iconText
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
