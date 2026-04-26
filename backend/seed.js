const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const gestureRoutes = require("./routes/gestureRoutes");
const predictSignRoutes = require("./routes/predictSignRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "signease-backend", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/gesture", gestureRoutes);
app.use("/api/predict-sign", predictSignRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ SignEase backend running on http://0.0.0.0:${PORT}`);
      console.log(`   Local:   http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
