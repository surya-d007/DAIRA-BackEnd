const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  personalDetails: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String ,
      required: true,
      default: 'faculty',
    },
    universityName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    mobileNo: {
      type: String,
      required: true
    },
    linkedIn: {
      type: String,
      default: null
    },
    domain: {
      type: String,
      required: true
    },
    education: {
      type: [{
        degree: {
          type: String,
          required: true
        },
        institution: {
          type: String,
          required: true
        },
        year: {
          type: Number,
          required: true
        }
      }],
      default: []
    },
    excellence: {
      type: [{
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        year: {
          type: Number,
          required: true
        }
      }],
      default: []
    }
  },
  publications: {
    type: [{
      title: {
        type: String,
        required: true
      },
      journal: {
        type: String,
        required: true
      },
      year: {
        type: Number,
        required: true
      },
      link: {
        type: String,
        required : true,
        default: null
      }
    }],
    default: []
  },
  coursesTaught: {
    type: [{
      courseTitle: {
        type: String,
        required: true
      },
      courseCode: {
        type: String,
        required: true
      },
      semester: {
        type: String,
        required: true
      }
    }],
    default: []
  },
  professionalExperience: {
    type: [{
      organization: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: null
      }
    }],
    default: []
  },
  certifications: {
    type: [{
      title: {
        type: String,
        required: true
      },
      organization: {
        type: String,
        required: true
      },
      year: {
        type: Number,
        required: true
      }
    }],
    default: []
  }
}, { collection: 'facultyData' });

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;





