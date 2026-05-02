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

    // 2. Create Lessons
    const alphabetLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const alphabetLessons = alphabetLetters.map((char, index) => ({
      moduleId: createdModules[0]._id,
      character: char,
      description: `This is the sign for ${char}`,
      mediaUrl: `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${char.toLowerCase()}.gif`,
      mlLabel: char,
      order: index + 1
    }));

    const phrases = [
      { character: "Hello", description: "A common greeting.", mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcHoxdmh5YXB4eHlxeHlxeHlxeHlxeHlxeHlxeHlxeHlxeHlxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif" },
      { character: "Thank You", description: "Show your gratitude.", mediaUrl: "https://media.giphy.com/media/3o7TKpGJRZf9k276xy/giphy.gif" },
      { character: "Please", description: "Be polite.", mediaUrl: "https://media.giphy.com/media/3o7TKVH3bZ5gYI1Z56/giphy.gif" },
      { character: "Sorry", description: "Apologize sincerely.", mediaUrl: "https://media.giphy.com/media/3o7TKVy0yZ3vJpB7YQ/giphy.gif" },
      { character: "Help", description: "Ask for assistance.", mediaUrl: "https://media.giphy.com/media/3o7TKVH3bZ5gYI1Z56/giphy.gif" },
      { character: "Yes", description: "Affirmative.", mediaUrl: "https://media.giphy.com/media/3o7TKVy0yZ3vJpB7YQ/giphy.gif" },
      { character: "No", description: "Negative.", mediaUrl: "https://media.giphy.com/media/3o7TKVH3bZ5gYI1Z56/giphy.gif" },
      { character: "More", description: "Want something more.", mediaUrl: "https://media.giphy.com/media/3o7TKVy0yZ3vJpB7YQ/giphy.gif" },
    ];
    const phraseLessons = phrases.map((p, index) => ({
      moduleId: createdModules[2]._id, // Common Phrases module
      ...p,
      mlLabel: p.character,
      order: index + 1
    }));

    await Lesson.insertMany([...alphabetLessons, ...phraseLessons]);
    console.log("Lessons inserted.");

    // 3. Create Quiz Questions
    const questionsToInsert = [
      // WORDS
      { moduleId: alphabetModuleId, prompt: 'What word does this sign mean?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs/h/hello.gif', options: ['Goodbye', 'Please', 'Hello', 'Sorry'], correctIndex: 2 },
      { moduleId: alphabetModuleId, prompt: 'Identify this common sign.', mediaUrl: 'https://www.lifeprint.com/asl101/gifs/t/thank-you.gif', options: ['Thank You', 'Welcome', 'Excuse Me', 'No'], correctIndex: 0 },
      { moduleId: alphabetModuleId, prompt: 'What does this gesture mean?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs/s/sorry.gif', options: ['Please', 'Thank You', 'Sorry', 'Hello'], correctIndex: 2 },
      
      // ALPHABET
      { moduleId: alphabetModuleId, prompt: 'Which letter is being signed here?', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif', options: ['A', 'B', 'S', 'O'], correctIndex: 0 },
      { moduleId: alphabetModuleId, prompt: 'Identify this letter:', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif', options: ['D', 'F', 'B', 'K'], correctIndex: 2 },
      { moduleId: alphabetModuleId, prompt: 'What alphabet is this?', mediaUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif', options: ['G', 'C', 'O', 'Q'], correctIndex: 1 },

      // NUMBERS
      { moduleId: alphabetModuleId, prompt: 'What number is being signed?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number01.gif', options: ['1', '2', '3', '4'], correctIndex: 0 },
      { moduleId: alphabetModuleId, prompt: 'Identify this number:', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number02.gif', options: ['5', '2', '8', '0'], correctIndex: 1 },
      { moduleId: alphabetModuleId, prompt: 'What number does this represent?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number03.gif', options: ['6', '9', '3', '1'], correctIndex: 2 },
      { moduleId: alphabetModuleId, prompt: 'Which number is this?', mediaUrl: 'https://www.lifeprint.com/asl101/gifs-animated/number05.gif', options: ['10', '5', '4', '7'], correctIndex: 1 },
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
