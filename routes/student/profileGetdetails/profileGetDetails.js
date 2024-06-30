const express = require('express');
const router = express.Router();
const studentData = require('../../../models/studentDataModel');

// POST route to get or create user by email
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists 
    let user = await studentData.findOne({ email });

    if(user)
    {
        res.status(200).json(user);
    }else{
        res.status(404).send("User with that email not found");
    }


       // Return the user object
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
