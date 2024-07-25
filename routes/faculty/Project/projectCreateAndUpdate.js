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

router.post("/getAllProjects", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the faculty document using the provided email
    const faculty = await FacultyModel.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    // Retrieve the project IDs from the faculty document
    const projectIds = faculty.Projects;

    // Fetch the project documents corresponding to the IDs
    const projects = await ProjectModel.find({ _id: { $in: projectIds } });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Failed to retrieve projects:", error);
    res.status(400).json({ error: "Failed to retrieve projects" });
  }
});

// Endpoint to edit an existing project
router.post("/editProject", async (req, res) => {
  const {
    id,
    FacEmail,
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

  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.projFacultyEmail !== FacEmail) {
      return res.status(403).json({
        error: "Unauthorized: Email does not match project faculty email",
      });
    }

    project.projectName = projectName;
    project.projectDomain = projectDomain;
    project.vacancies = vacancies;
    project.timeline = timeline;
    project.criteria = criteria;
    project.techStack = techStack;
    project.skillsRequired = skillsRequired;
    project.perks = perks;
    project.target = target;

    const updatedProject = await project.save();
    res.status(200).json({
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(400).json({ error: "Failed to update project" });
  }
});

module.exports = router;
