const express = require('express');
const router = express.Router();
const UserData = require('../models/studentDataModel');

// POST route to get or create user by email
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists 
    let user = await UserData.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      const newUser = {
        email,
        personalDetails: {
          role: 'student',
        },

      };

      // Save new user to database
      user = await UserData.create(newUser);
    }

    // Return the user object
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
