const express = require('express');
const router = express.Router();
const studentData = require('../../../models/studentDataModel');




// Route to update personal details
router.post('/updatePersonalDetails', async (req, res) => {
    const { email, personalDetails } = req.body;

    try {
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { personalDetails: personalDetails },
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






router.post('/updateProjects', async (req, res) => {
    const { email, projectPortfolio } = req.body;

    try {
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { projectPortfolio: projectPortfolio },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




router.post('/updateCertifications', async (req, res) => {
    const { email, certification } = req.body;

    try {
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { certification: certification },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/updateWorkExperience', async (req, res) => {
    const { email, workExperience } = req.body;

    try {
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { workExperience: workExperience },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/updateInterests', async (req, res) => {
    const { email, Interests } = req.body;

    try {
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { Interests: Interests },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/updateSkill', async (req, res) => {
    const { email, skills } = req.body;

    try {
        // Find the user by email and set the skills array to the new skills
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { skills: skills }, // Replace the entire skills array
            { new: true } // To return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
