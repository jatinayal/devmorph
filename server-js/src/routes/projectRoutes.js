import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteProject,
  getProjectPreview,
  getPublishedProjectById,
  getPublishedProjects,
  makeRevision,
  makeRevisionCode,
  rollbackToVersion,
  saveProjectCode
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/projects/:projectId/revision", protect, makeRevision);
projectRouter.post("/projects/revision/code", protect, makeRevisionCode);
projectRouter.put("/projects/:projectId/save", protect, saveProjectCode);
projectRouter.post("/projects/rollback", protect, rollbackToVersion);
projectRouter.delete("/projects/:projectId", protect, deleteProject);
projectRouter.get("/projects/:projectId/preview", protect, getProjectPreview);

projectRouter.get("/projects/published", getPublishedProjects);
projectRouter.get("/projects/published/:projectId",getPublishedProjectById);


export default projectRouter; 
