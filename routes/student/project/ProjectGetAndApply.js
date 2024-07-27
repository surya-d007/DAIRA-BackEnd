const express = require("express");
const router = express.Router();
const ProjectModel = require("../../../models/projectDataModel");
const FacultyModel = require("../../../models/facultyDataModel");
const StudentModel = require("../../../models/studentDataModel");

// Endpoint to fetch all projects with faculty details
router.get("/getAllProjects", async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await ProjectModel.find();

    // Fetch faculty details for each project
    const projectsWithFacultyDetails = await Promise.all(
      projects.map(async (project) => {
        const faculty = await FacultyModel.findOne({
          email: project.projFacultyEmail,
        });
        return {
          ...project._doc,
          facultyImgUrl: faculty ? faculty.personalDetails.profileimgURL : null,
          projFacultyName: faculty ? faculty.personalDetails.name : null,
          school: faculty ? faculty.personalDetails.school : null,
        };
      })
    );

    // Send the projects with faculty details as a response
    res.status(200).json(projectsWithFacultyDetails);
  } catch (error) {
    console.error("Failed to retrieve projects:", error);
    res.status(400).json({ error: "Failed to retrieve projects" });
  }
});

router.post("/applyProject", async (req, res) => {
  try {
    const { projectId, email } = req.body;

    // Validate input
    if (!projectId || !email) {
      return res
        .status(400)
        .json({ message: "Project ID and email are required" });
    }

    // Find the student by email
    const student = await StudentModel.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Add project ID to the student's applied projects
    if (!student.projectsAppliedIds.includes(projectId)) {
      student.projectsAppliedIds.push(projectId);
      await student.save();
    }

    // Find the project by ID
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Add student email to the project's studentsApplied
    const existingApplication = project.studentsApplied.find(
      (application) => application.student === email
    );
    if (!existingApplication) {
      project.studentsApplied.push({
        student: email,
        status: "pending", // Set initial status as "pending"
      });
      await project.save();
    }

    res.status(200).json({ message: "Applied successfully" });
  } catch (error) {
    console.error("Error applying for project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/getApplicationStatus", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find the student by email
    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { projectsAppliedIds } = student;

    // Find the projects by IDs
    const projects = await ProjectModel.find({
      _id: { $in: projectsAppliedIds },
    });

    // Include faculty details for each project
    const projectsWithFacultyDetails = await Promise.all(
      projects.map(async (project) => {
        const faculty = await FacultyModel.findOne({
          email: project.projFacultyEmail,
        });

        return {
          ...project.toObject(),
          facultyDetails: {
            name: faculty?.personalDetails.name || "N/A",
            profileImgUrl: faculty?.personalDetails.profileimgURL || "N/A",
            school: faculty?.personalDetails.school || "N/A",
          },
        };
      })
    );

    res.json({ projects: projectsWithFacultyDetails });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
