const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    personalDetails: {
      name: {
        type: String,
        default: null,
      },
      profileimgURL: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        required: true,
        default: "faculty",
      },
      universityName: {
        type: String,
        default: null,
      },
      department: {
        type: String,
        default: null,
      },
      school: {
        type: String,
        default: null,
      },
      mobileNo: {
        type: String,
        default: null,
      },
      linkedIn: {
        type: String,
        default: null,
      },
      domain: {
        type: String,
        default: null,
      },
    },

    education: {
      type: [
        {
          degree: {
            type: String,
            default: null,
          },
          institution: {
            type: String,
            default: null,
          },
          year: {
            type: Number,
            default: null,
          },
        },
      ],
      default: [],
    },
    AwardsAndAccolades: {
      type: [
        {
          title: {
            type: String,
            default: null,
          },
          description: {
            type: String,
            default: null,
          },
          year: {
            type: Number,
            default: null,
          },
        },
      ],
      default: [],
    },
    Projects: {
      type: [String],
      default: [],
    },
    ProjectsAndPublications: {
      type: [
        {
          title: {
            type: String,
            default: null,
          },
          description: {
            type: String,
            default: null,
          },
        },
      ],
      default: [],
    },
    Expertise: {
      type: [
        {
          title: {
            type: String,
            default: null,
          },
          description: {
            type: String,
            default: null,
          },
        },
      ],
      default: [],
    },
    Experience: {
      type: [
        {
          title: {
            type: String,
            default: null,
          },
          description: {
            type: String,
            default: null,
          },
        },
      ],
      default: [],
    },
  },
  { collection: "facultyData" }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
