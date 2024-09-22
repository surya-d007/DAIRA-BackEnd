const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const formidable = require("formidable");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const router = express.Router();

// Replace with the API key you created in the Google Cloud Console
const apiKey = process.env.apiKeyGemini;

// Function to generate content using Google Generative AI
async function generateContent(query) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(query);
    return result.response.text(); // Extract and return the AI response text
  } catch (error) {
    console.error("Error:", error);
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(`Error: ${errorData.error.message}`);
    } else {
      throw new Error("An error occurred");
    }
  }
}

// Route to handle resume analysis
// Route to handle resume analysis
router.post("/analyze-resume", (req, res) => {
  const form = new formidable.IncomingForm();

  // Parse incoming form with file upload
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).send({ message: "Error in file upload" });
    }

    console.log(files); // Log files object to debug

    // Access the first elements of arrays for jobDescription and queryType
    const pdfFile = files.resume[0];
    const jobDescription = fields.jobDescription[0];
    const queryType = fields.queryType[0];

    if (!pdfFile || !jobDescription) {
      return res
        .status(400)
        .send({ message: "Missing PDF or job description" });
    }

    try {
      const pdfBuffer = fs.readFileSync(pdfFile.filepath || pdfFile.file);
      const pdfData = await pdfParse(pdfBuffer);
      const resumeText = pdfData.text;

      // Define prompts based on query type
      let inputPrompt = "";
      switch (queryType) {
        case "about_resume":
          inputPrompt = `You are an experienced Technical Human Resource Manager...`;
          break;
        case "improve_skills":
          inputPrompt = `You are a Technical Human Resource Manager...`;
          break;
        case "missing_keywords":
          inputPrompt = `You are a skilled ATS...`;
          break;
        case "scoring":
          inputPrompt = `You are a skilled ATS...`;
          break;
        default:
          return res.status(400).send({ message: "Invalid query type" });
      }

      const response = await generateContent([
        inputPrompt,
        resumeText,
        jobDescription,
      ]);
      res.send({ response });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ message: "Error processing request" });
    }
  });
});

module.exports = router;
