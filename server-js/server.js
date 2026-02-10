import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/userRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import commentRouter from "./src/routes/comment.routes.js";
import adminRouter from "./src/routes/authAdmin.js";

const app = express();
const port = process.env.PORT || 3000;

/* -------------------- Startup Guards -------------------- */
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.");
  process.exit(1);
}

/* -------------------- DB -------------------- */
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* -------------------- Middleware -------------------- */
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.TRUSTED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- API Routes -------------------- */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is Live!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/comment", commentRouter);
app.use("/api/admin", adminRouter);

const __dirname = path.resolve();

// serve React build
app.use(express.static(path.join(__dirname, "../client-js/dist")));

// React Router fallback — Express 5 safe
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client-js/dist/index.html"));
});


/* -------------------- Start Server -------------------- */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
