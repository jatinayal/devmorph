import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/userRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import cookieParser from "cookie-parser";
import commentRouter from "./src/routes/comment.routes.js";
import adminRouter from "./src/routes/authAdmin.js";

const app = express();
const port = process.env.PORT || 3000;
 


mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

 
app.use(cookieParser()); 
app.use(
  cors({
    origin: process.env.TRUSTED_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.use("/api/auth", authRoutes); 
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter); 
app.use("/api/comment", commentRouter);  
app.use("/api/admin", adminRouter);   

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
 