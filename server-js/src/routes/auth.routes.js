import  express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  getUser,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getUser);

export default authRouter;
