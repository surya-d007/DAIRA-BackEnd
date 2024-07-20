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
      excellence: {
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
    },
    projectCreate: {
      type: [String],
      default: [],
    },
    publications: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          journal: {
            type: String,
            required: true,
          },
          year: {
            type: Number,
            required: true,
          },
          link: {
            type: String,
            required: true,
            default: null,
          },
        },
      ],
      default: [],
    },
    coursesTaught: {
      type: [
        {
          courseTitle: {
            type: String,
            required: true,
          },
          courseCode: {
            type: String,
            required: true,
          },
          semester: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    professionalExperience: {
      type: [
        {
          organization: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: null,
          },
        },
      ],
      default: [],
    },
    certifications: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          organization: {
            type: String,
            required: true,
          },
          year: {
            type: Number,
            required: true,
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
