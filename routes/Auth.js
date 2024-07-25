const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const studentData = require("../models/studentDataModel");
const facultyData = require("../models/facultyDataModel");

// POST route to get or create user by email
const JWT_SECRET = process.env.JWT_SECRET;
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await studentData.findOne({ email });
    let role = "student";

    if (!user) {
      user = await facultyData.findOne({ email });
      role = "faculty";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email, role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);

    //console.log(user.personalDetails.role);
    res.json({
      token,
      email: user.email,
      role: user.personalDetails.role,
      userData: user,
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register Route
router.post("/student/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new studentData({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/faculty/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new facultyData({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
