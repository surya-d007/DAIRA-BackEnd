const express = require('express');
const router = express.Router();
const studentData = require('../../../models/studentDataModel');

// POST route to update user's personal details by email
router.post('/updatePersonalDetails', async (req, res) => {
    const { email, personalDetails } = req.body;

    try {
        let updateFields = {};
        for (let key in personalDetails) {
            updateFields[`personalDetails.${key}`] = personalDetails[key];
        }

        // Find the user by email and update the specified fields in personalDetails
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $set: updateFields },
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


router.post('/updateSkill', async (req, res) => {
    const { email, skillTitle, skills } = req.body;

    try {
        // Find the user by email and update the skills array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { skills: { skillTitle, skills } } },
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




router.post('/updatecertification', async (req, res) => {
    const { email, certTitle, description } = req.body;

    try {
        // Find the user by email and update the skills array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { certification: { certTitle, description } } },
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





router.post('/updateWorkExperience', async (req, res) => {
    const { email, workTitle, description } = req.body;

    try {
        // Find the user by email and update the skills array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { workExperience: { workTitle, description } } },
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





router.post('/updateProjectPortfolio', async (req, res) => {
    const { email, projTitle, projDescription } = req.body;

    try {
        // Find the user by email and update the skills array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { projectPortfolio: { projTitle, projDescription } } },
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





router.post('/updateProjectsAppliedIds', async (req, res) => {
    const { email, projectId } = req.body;

    try {
        // Find the user by email and update the projectsAppliedIds array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { projectsAppliedIds: projectId } },
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





router.post('/updateMentorshipAppliedIds', async (req, res) => {
    const { email, mentorshipIds } = req.body;

    try {
        // Find the user by email and update the projectsAppliedIds array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { mentorshipAppliedIds: mentorshipIds } },
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





router.post('/updateInterest', async (req, res) => {
    const { email, InterestTitle , description } = req.body;

    try {
        // Find the user by email and update the skills array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $push: { Interests: { InterestTitle, description } } },
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
