const express = require("express");
const router = express.Router();
const ProjectModel = require("../../../models/projectDataModel");

// Endpoint to fetch all projects
router.get("/getAllProjects", async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await ProjectModel.find();

    // Send the projects as a response
    res.status(200).json(projects);
  } catch (error) {
    console.error("Failed to retrieve projects:", error);
    res.status(400).json({ error: "Failed to retrieve projects" });
  }
});

module.exports = router;
