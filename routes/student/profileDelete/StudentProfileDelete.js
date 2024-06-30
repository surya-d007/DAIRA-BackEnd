const express = require('express');
const router = express.Router();
const studentData = require('../../../models/studentDataModel');


// POST route to delete an item by email and ID
router.post('/deleteItem', async (req, res) => {
    // for projectPortfolio , skills , certification , workExperience , 
    const { email, id } = req.body;

    try {
        // Find the user by email and update the arrays
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            {
                $pull: {
                    workExperience: { _id: id },
                    certification: { _id: id },
                    skills: { _id: id },
                    projectPortfolio: { _id: id },
                    Interests : {_id : id}
                }
            },
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



router.post('/deleteprojectsAppliedIds', async (req, res) => {
    const { email, projectId } = req.body;

    try {
        // Find the user by email and update the projectsAppliedIds array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $pull: { projectsAppliedIds: projectId } },
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

// POST route to delete a mentorshipAppliedId by email and mentorship ID
router.post('/deletementorshipid', async (req, res) => {
    const { email, mentorshipId } = req.body;

    try {
        // Find the user by email and update the mentorshipAppliedIds array
        const updatedUser = await studentData.findOneAndUpdate(
            { email },
            { $pull: { mentorshipAppliedIds: mentorshipId } },
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
