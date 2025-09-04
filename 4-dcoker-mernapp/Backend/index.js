import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());

let connection = false;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("✅ MongoDB connected");
    connection = true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    connection = false;
  }
}

// Call once at startup
connectDB();

// Health route
app.get("/", (_, res) => {
  res.json({
    healthy: true,
    message: "everything is good at backend",
    connection: connection,
  });
});

// Optional: Listen for connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
  connection = false;
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
  connection = true;
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
