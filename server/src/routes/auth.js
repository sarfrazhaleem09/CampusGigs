import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
const router = Router();
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  skills: user.skills,
});
const makeToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must contain at least 8 characters." });
    if (await User.exists({ email: email.toLowerCase().trim() }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email?.toLowerCase().trim(),
    }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});
router.patch("/me", protect, async (req, res, next) => {
  try {
    const { name, email, bio, skills } = req.body;

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName || cleanName.length > 80) {
        return res.status(400).json({
          message: "Name must contain 1–80 characters.",
        });
      }

      req.user.name = cleanName;
    }

    if (email !== undefined) {
      const cleanEmail = String(email).trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address.",
        });
      }

      const existingUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }

      req.user.email = cleanEmail;
    }

    if (bio !== undefined) {
      req.user.bio = String(bio).slice(0, 500);
    }

    if (Array.isArray(skills)) {
      req.user.skills = skills
        .slice(0, 20)
        .map((skill) => String(skill).trim().slice(0, 40));
    }

    await req.user.save();

    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
});
router.patch("/change-password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must contain at least 8 characters.",
      });
    }

    if (newPassword.length > 128) {
      return res.status(400).json({
        message: "New password is too long.",
      });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!matches) {
      return res.status(401).json({
        message: "Your current password is incorrect.",
      });
    }

    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      return res.status(400).json({
        message: "Choose a password different from your current one.",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
