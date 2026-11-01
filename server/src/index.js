import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";
import messageRoutes from "./routes/messages.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", app: "CampusGigs API" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use((req, res) =>
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.path}` }),
);
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === "ValidationError")
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((x) => x.message)
        .join(", "),
    });
  if (err.name === "CastError")
    return res.status(400).json({ message: "Invalid identifier." });
  res.status(500).json({ message: "Something went wrong. Please try again." });
});
const port = process.env.PORT || 5000;
try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Check server/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () =>
    console.log(`CampusGigs API running on http://localhost:${port}`),
  );
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exit(1);
}
