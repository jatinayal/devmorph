import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jatin"
    );

    const admin = await Admin.findOne({ _id: decoded.userId });

    if (!admin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.adminId = admin._id;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
