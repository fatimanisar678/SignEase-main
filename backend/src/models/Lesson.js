const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    character: { type: String, required: true }, // e.g., "A", "B", "1"
    description: { type: String }, // e.g., "This is the sign for A"
    hints: [{ type: String }],
    mediaUrl: { type: String }, // URL to the placeholder image or GIF
    mlLabel: { type: String }, // The expected ML prediction label
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
