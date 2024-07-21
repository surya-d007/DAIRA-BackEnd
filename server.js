require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const verifyFirebaseToken = require("./Auth/middleWarejwtAuth");

// Import user routes

const userGetDetailsRouter = require("./routes/Auth");

const getStudrntProfileDetailsRouter = require("./routes/student/profileGetdetails/profileGetDetails");

const updateProfileStudentRouter = require("./routes/student/profileUpdate/StudentProfileUpdate");

const deleteProfileStudentRouter = require("./routes/student/profileDelete/StudentProfileDelete");

const facultyProject = require("./routes/faculty/Project/projectCreateAndUpdate");

app.use("/Auth", userGetDetailsRouter);

app.use(
  "/studentProfile/getDeatils",
  verifyFirebaseToken,
  getStudrntProfileDetailsRouter
);
app.use(
  "/studentProfile/Update",
  verifyFirebaseToken,
  updateProfileStudentRouter
);
app.use(
  "/studentProfile/delete",
  verifyFirebaseToken,
  deleteProfileStudentRouter
);

app.use("/faculty/project", verifyFirebaseToken, facultyProject);

app.post("/verifyToken", verifyFirebaseToken, (req, res) => {
  // Your API logic here, accessed via req.user
  res.status(200).json({ message: "Successfully authenticated via Firebase" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
