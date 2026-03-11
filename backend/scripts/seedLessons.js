/**
 * Seeds the lessons collection with data matching frontend LESSONS structure.
 * Run: node scripts/seedLessons.js (from backend folder, with MONGODB_URI set)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Lesson = require("../src/models/Lesson");

const lessons = [
  { title: "Basics: Alphabet (A–Z)", level: "Beginner", duration: "10 min", order: 1 },
  { title: "Common Greetings", level: "Beginner", duration: "8 min", order: 2 },
  { title: "Numbers 1–20", level: "Beginner", duration: "12 min", order: 3 },
  { title: "Everyday Phrases", level: "Intermediate", duration: "15 min", order: 4 },
  { title: "Emotions & Expressions", level: "Intermediate", duration: "14 min", order: 5 },
  { title: "Conversation Practice", level: "Advanced", duration: "20 min", order: 6 },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/signease";
  await mongoose.connect(uri, { dbName: "signease" });
  await Lesson.deleteMany({});
  await Lesson.insertMany(lessons);
  console.log("Seeded", lessons.length, "lessons");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
