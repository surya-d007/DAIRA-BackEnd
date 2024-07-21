const express = require("express");
const router = express.Router();
const ProjectModel = require("../../../models/projectDataModel");
const FacultyModel = require("../../../models/facultyDataModel");

// Endpoint to add a new project
router.post("/CreateProject", async (req, res) => {
  const {
    FacEmail, // Changed from 'FacEmai'
    projectName,
    projectDomain,
    vacancies,
    timeline,
    criteria,
    techStack,
    skillsRequired,
    perks,
    target,
  } = req.body;

  // Create a new project object
  const newProject = new ProjectModel({
    postedOn: new Date(), // Use JavaScript Date object to get current date and time
    status: "open", // Make sure status is a string
    projFacultyEmail: FacEmail, // Changed from 'FacEmai'
    projectName,
    projectDomain,
    vacancies,
    timeline,
    criteria,
    techStack,
    skillsRequired,
    perks,
    target,
  });

  try {
    // Save the new project to the database
    const savedProject = await newProject.save();

    // Get the project's ID
    const projectId = savedProject._id;

    // Update the faculty's Projects field with the new project's ID
    await FacultyModel.findOneAndUpdate(
      { email: FacEmail },
      { $push: { Projects: projectId } }, // Add the project ID to the Projects array
      { new: true } // Return the updated document
    );

    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    // Handle errors and send a response
    console.error("Failed to add project:", error);
    res.status(400).json({ error: "Failed to add project" });
  }
});

module.exports = router;
