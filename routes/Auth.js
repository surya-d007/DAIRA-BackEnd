const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const UserData = require('../models/studentDataModel');

// POST route to get or create user by email
const JWT_SECRET = process.env.JWT_SECRET
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserData.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log(token);

    res.json({ token, email: user.email, userData: user }); // Modify this to return actual student data  
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Register Route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserData({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;