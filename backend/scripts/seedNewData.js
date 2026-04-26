const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Module = require("../src/models/Module");
const Lesson = require("../src/models/Lesson");
const Question = require("../src/models/Question");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/signease");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Module.deleteMany();
    await Lesson.deleteMany();
    await Question.deleteMany();

    console.log("Existing data cleared.");

    // 1. Create Modules
    const createdModules = await Module.insertMany([
      {
        title: "Alphabet",
        description: "Learn the fundamentals of finger spelling.",
        level: "Beginner",
        iconText: "ABC",
        iconColor: "#CDE0F5",
        order: 1
      },
      {
        title: "Numbers",
        description: "Counting from 1-100 with ease.",
        level: "Beginner",
        iconText: "#",
        iconColor: "#CDE0F5",
        order: 2
      },
      {
        title: "Common Phrases",
        description: "Greetings and essential everyday talk.",
        level: "Intermediate",
        iconName: "chatbox-outline",
        iconColor: "#EBCB9F",
        order: 3
      }
    ]);

    const alphabetModuleId = createdModules[0]._id;

    console.log("Modules inserted.");

    // 2. Create Lessons for Alphabet
    const alphabetLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const lessonsToInsert = alphabetLetters.map((char, index) => ({
      moduleId: alphabetModuleId,
      character: char,
      description: `This is the sign for ${char}`,
      mediaUrl: `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${char.toLowerCase()}.gif`,
      mlLabel: char,
      order: index + 1
    }));

    await Lesson.insertMany(lessonsToInsert);
    console.log("Lessons inserted.");

    // 3. Create Quiz Questions
    const questionsToInsert = [
      {
        moduleId: alphabetModuleId,
        prompt: 'What word does this sign mean?',
        mediaUrl: 'https://www.lifeprint.com/asl101/gifs/h/hello.gif',
        options: ['Goodbye', 'Please', 'Hello', 'Sorry'],
        correctIndex: 2,
      },
      {
        moduleId: alphabetModuleId,
        prompt: 'Identify this common sign.',
        mediaUrl: 'https://www.lifeprint.com/asl101/gifs/t/thank-you.gif',
        options: ['Thank You', 'Welcome', 'Excuse Me', 'No'],
        correctIndex: 0,
      },
      {
        moduleId: alphabetModuleId,
        prompt: 'Which word is shown here?',
        mediaUrl: 'https://www.lifeprint.com/asl101/gifs/p/please.gif',
        options: ['Sorry', 'Please', 'Yes', 'Help'],
        correctIndex: 1,
      },
      {
        moduleId: alphabetModuleId,
        prompt: 'What does this gesture mean?',
        mediaUrl: 'https://www.lifeprint.com/asl101/gifs/s/sorry.gif',
        options: ['Please', 'Thank You', 'Sorry', 'Hello'],
        correctIndex: 2,
      },
      {
        moduleId: alphabetModuleId,
        prompt: 'Identify the word being signed:',
        mediaUrl: 'https://www.lifeprint.com/asl101/gifs/y/yes.gif',
        options: ['No', 'Yes', 'Maybe', 'Always'],
        correctIndex: 1,
      }
    ];

    await Question.insertMany(questionsToInsert);
    console.log("Quiz Questions inserted.");

    console.log("Data Import Success!");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
