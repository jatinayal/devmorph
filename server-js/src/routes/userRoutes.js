import  express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createProjectCode, createUserProject, getUserCredits, getUserProject, getUserProjects, purchaseCredits, togglePublish } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/credits',protect, getUserCredits)
userRouter.post('/project',protect, createUserProject)
userRouter.post('/project/code',protect, createProjectCode)
userRouter.get('/project/:projectId', protect, getUserProject)
userRouter.get('/projects', protect, getUserProjects)
userRouter.patch('/publish/:projectId', protect, togglePublish)
userRouter.post('/payment',protect, purchaseCredits)

export default userRouter