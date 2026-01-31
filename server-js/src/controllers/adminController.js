import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { creditPlans } from "../config/creditPlans.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "jatin",
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (_req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logout successful" });
};

/* ================= GET USER ================= */
export const getAdmin = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await Admin.findById(userId).select(
      "_id name email totalCreation credits emailVerified createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    res.status(200).json({
        user: {
          id: user._id,
      name: user.name,
      email: user.email,
      totalCreation: user.totalCreation,
      credits: user.credits,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
        }
    });
  } catch (error) {
    console.error("GET USER ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    if (!["done", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Payment already processed" });
    }

    // 🔒 Validate plan
    const plan = creditPlans[payment.planId];

    if (!plan) {
      return res
        .status(400)
        .json({ message: "Invalid plan associated with payment" });
    }

    // Update payment
    payment.status = status;
    payment.approvedBy = req.userId;
    payment.approvedAt = new Date();

    // ✅ If approved → credit user
    if (status === "done") {
      const user = await User.findById(payment.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.credits += plan.credits;
      await user.save();
    }

    await payment.save();

    res.status(200).json({
      message: `Payment ${status}`,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment" });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};