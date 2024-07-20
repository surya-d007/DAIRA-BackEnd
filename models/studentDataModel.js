const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
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
      role: {
        type: String,
        required: true,
        default: "student",
        enum: ["student", "faculty", "admin"],
      },
      universityName: {
        type: String,
        default: null,
      },
      branch: {
        type: String,
        default: null,
      },
      Degree: {
        type: String,
        default: null,
      },
      mobileNo: {
        type: String,
        default: null,
      },
      place: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
      profileImgLink: {
        type: String,
        default: null,
      },
      WhichYear: {
        type: String,
        default: null,
      },
      CGPA: {
        type: String,
        default: null,
      },
      Batch: {
        type: String,
        default: null,
      },
      linkedIn: {
        type: String,
        default: null,
      },
      resumeLink: {
        type: String,
        default: null,
      },
    },
    projectsAppliedIds: {
      type: [String],
      default: [],
    },
    mentorshipAppliedIds: {
      type: [String],
      default: [],
    },
    projectPortfolio: {
      type: [
        {
          projTitle: {
            type: String,
            required: true,
          },
          projDescription: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    skills: {
      type: [
        {
          skillTitle: {
            type: String,
            required: true,
          },
          skills: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    certification: {
      type: [
        {
          certTitle: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },

    workExperience: {
      type: [
        {
          workTitle: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },

    Interests: {
      type: [
        {
          InterestTitle: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { collection: "studentData" }
);

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
