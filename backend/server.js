const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");


const connectDB = require("./config/db");
const projectRoutes = require(
  "./routes/projectRoutes"
);
const taskRoutes = require(
  "./routes/taskRoutes"
);
const dashboardRoutes =
  require(
    "./routes/dashboardRoutes"
  );
// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use(
  "/api/projects",
  projectRoutes
);
app.use(
  "/api/tasks",
  taskRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Cookie Parser
app.use(cookieParser());

// Logger
app.use(morgan("dev"));

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Team Task Manager API Running Successfully",
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});