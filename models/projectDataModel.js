const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    postedOn: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: null,
    },
    projFacultyName: {
      type: String,
      required: true,
    },
    projectFacImageUrl: {
      type: String,
      default: null,
    },
    school: {
      type: String,
      default: null,
    },
    projectName: {
      type: String,
      default: null,
    },
    projectDomain: {
      type: String,
      default: null,
    },
    vacancies: {
      type: String,
      default: null,
    },
    techStack: {
      type: String,
      default: null,
    },
    criteria: {
      type: String,
      default: null,
    },
    timeline: {
      type: String,
      default: null,
    },
    skillsRequired: {
      type: String,
      default: null,
    },
    perks: {
      type: String,
      default: null,
    },
    studentsApplied: {
      type: [
        {
          student: {
            type: String, // Assuming student ID or name
            default: null,
          },
          status: {
            type: String,
            enum: ["pending", "declined", "accepted"],
            default: null,
          },
        },
      ],
      default: [], // Default to an empty array
    },
    projectProgress: {
      type: Number,
      default: 0, // Optional field for tracking progress
    },
  },
  { collection: "projectData" }
);

const ProjectModel = mongoose.model("Project", projectSchema);

module.exports = ProjectModel;
