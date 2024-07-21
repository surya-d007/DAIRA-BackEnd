const express = require("express");
const router = express.Router();
const ProjectModel = require("../../../models/projectDataModel");

// Endpoint to add a new project
router.post("/projects", async (req, res) => {
  const {
    projectName,
    projectDomain,
    vacancies,
    timeline,
    criteria,
    techStack,
    skillsRequired,
    perks,
  } = req.body;

  const newProject = new ProjectModel({
    postedOn = strigf (current datw)
    status=open
    projFacultyName: "Default Faculty", // You might want to change this
    projectName,
    projectDomain,
    vacancies,
    timeline,
    criteria,
    techStack,
    skillsRequired,
    perks,
  });

  try {
    await newProject.save();
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to add project" });
  }
});

module.exports = router;
