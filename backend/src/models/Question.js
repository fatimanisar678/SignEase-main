const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // Optional link to a specific module
    prompt: { type: String, required: true },
    mediaUrl: { type: String }, // URL to ASL GIF
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    type: { type: String, default: "MultipleChoice" },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
