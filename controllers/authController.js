import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // בדיקת שדות חובה
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // בדיקה אם המשתמש כבר קיים
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת משתמש חדש
    const user = await User.create({ name, email, password: hashedPassword });

    // יצירת JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // חיפוש משתמש
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // בדיקת סיסמה מוצפנת
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // יצירת JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function logoutUser(req, res) {
  // הלקוח יצטרך למחוק את ה-token משלו
  res.json({ message: "Logout successful" });
}
