import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCommentsByProject, postComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.get('/project/:projectId', getCommentsByProject)
commentRouter.post('/project/:projectId', protect, postComment)

export default commentRouter