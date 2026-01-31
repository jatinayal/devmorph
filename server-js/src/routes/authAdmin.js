import  express from "express";
import { adminProtect } from "../middleware/adminAuth.js";
import {
  signup,
  login,
  logout,
  getAdmin,
  updatePaymentStatus,
  getAllPayments,
} from "../controllers/adminController.js";

const adminRouter = express.Router();
  
adminRouter.post("/signup",adminProtect, signup);
adminRouter.post("/login", login);
adminRouter.post("/logout", logout);
adminRouter.get("/me", adminProtect, getAdmin);
adminRouter.put("/payment/:paymentId", adminProtect, updatePaymentStatus);
adminRouter.get("/payments", adminProtect, getAllPayments); 

export default adminRouter;
