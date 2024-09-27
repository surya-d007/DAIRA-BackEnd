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
  console.log(query);
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
          inputPrompt = ` You are an experienced Technical Human Resource Manager,your task is to review the provided resume against the job description : ${jobDescription}
  Please share your professional evaluation on whether the candidate's profile aligns with the role. 
 Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
`;
          break;
        case "improve_skills":
          inputPrompt = `You are an Technical Human Resource Manager with expertise in data science, 
your role is to scrutinize the resume in light of the job description provided : ${jobDescription}
Share your insights on the candidate's suitability for the role from an HR perspective. 
Additionally, offer advice on enhancing the candidate's skills and identify areas where improvement is needed.`;
          break;
        case "missing_keywords":
          inputPrompt = `You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, 
your task is to evaluate the resume against the provided job description : ${jobDescription} . As a Human Resource manager,
 assess the compatibility of the resume with the role. Give me what are the keywords that are missing
 Also, provide recommendations for enhancing the candidate's skills and identify which areas require further development.
`;
          break;
        case "scoring":
          inputPrompt = `You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, 
your task is to evaluate the resume against the provided job description : ${jobDescription} give me the percentage of match if the resume matches
the job description. First the output should come as percentage and then keywords missing and last final thoughts.

samaple output format:

Percentage Match: no%
Keywords Missing: term1 , term2 , term3 , term4 , term5 , term6 , ... etc upto max 8 , min 6
Area of improvement : 3 domains like below , not more than 3
          domaintitle 1 : description of domain 1 in 25 words minimun
          domaintitle 2 : description of domain 2 in 25 words minimum
          domaintitle 3 : description of domain 3 in 25 words minimum
Additional Pointers : para in 40 words minimum


sample fotmat response

{"response":"Percentage Match: 70%\nKeywords Missing: Public relations, Communications\nAreas of Improvement:\n- Digital content creation: Highlight the creation of social media content. Discuss the different formats you create, such as posts, graphics, videos, and stories.\n- Community building: Underline your experience in growing and engaging online communities on platforms like Facebook, Twitter, Instagram, and LinkedIn.\n- Social media advertising: Emphasize your ability to run and manage effective social media advertising campaigns. Mention the platforms you are familiar with and the results you have achieved.\n- Crisis management: Briefly address how you have handled negative feedback or social media crises to maintain a positive brand reputation.\n- Metrics tracking and analysis: Highlight your skills in using social media analytics tools to track key metrics, such as engagement, reach, and return on investment (ROI).\n\nAdditional Pointers:\n\n- To further enhance your resume, consider including specific examples of successful social media campaigns you have executed.\n- Use numbers and quantifiable results to demonstrate the impact of your social media efforts. For instance, you could mention the increase in followers, engagement, or leads generated.\n- Consider obtaining industry-recognized certifications in social media marketing to demonstrate your expertise."}
`;
          break;
        default:
          return res.status(400).send({ message: "Invalid query type" });
      }

      // const response = parseInput(
      //   await generateContent([inputPrompt, resumeText])
      // );

      const response = parseInput(
        `Percentage Match: 80%\nKeywords Missing: Agile, Scrum, Testing, DevOps\nAreas of Improvement:\n- Web Development: Highlight your proficiency in the MERN stack and other relevant technologies. Quantify your experience and mention specific projects where you have applied your skills.\n- App Development: Showcase your expertise in React Native and Expo by providing examples of mobile applications you have developed or contributed to. Discuss the challenges you faced and the solutions you implemented.\n- Cloud Services: Emphasize your experience with AWS and Heroku. Describe the projects where you have used these services and the benefits you achieved.\n- APIs and Version Control: Highlight your ability to integrate with various APIs and your proficiency in using Git and GitHub for version control. Provide examples of how you have used these tools to collaborate on projects.\n- Programming Languages: List all the programming languages you are familiar with and provide a brief description of your experience with each language.\n- Skills: Expand on your skills by providing specific examples and quantifying your experience whenever possible. Use action verbs and numbers to make your skills more impactful.\n- Projects: Provide a detailed description of your projects, including the technologies used, the challenges faced, and the results achieved. Highlight the impact of your contributions and quantify your accomplishments.\nAdditional Pointers:\n- Consider obtaining industry-recognized certifications to demonstrate your expertise in full-stack development and related technologies.\n- Build a portfolio of your work to showcase your skills and give potential employers a tangible sense of your abilities.\n- Network with other developers and professionals in the industry to stay up-to-date on the latest trends and best practices.`
      );
      res.send({ response });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send({ message: "Error processing request" });
    }
  });
});

function parseInput(input) {
  // Initialize output object
  const output = {
    Percentage: 70, // You mentioned percentage as 70 in the desired output
    Keywords_Missing: [],
    Areas_of_Improvement: [],
    Additional_Pointers: "",
  };

  // Extracting and splitting based on specific sections
  const percentageMatchPattern = /Percentage Match: (\d+)%/;
  const keywordsMissingPattern = /Keywords Missing: ([^\n]+)/;
  const areasOfImprovementPattern =
    /Areas of Improvement:\n((?:[\s\S](?!Additional Pointers))+)/;
  const additionalPointersPattern = /Additional Pointers:\n([\s\S]+)/;

  // Extract percentage match
  const percentageMatch = input.match(percentageMatchPattern);
  if (percentageMatch) {
    output.Percentage = parseInt(percentageMatch[1], 10);
  }

  // Extract missing keywords
  const keywordsMissing = input.match(keywordsMissingPattern);
  if (keywordsMissing) {
    output.Keywords_Missing = keywordsMissing[1]
      .split(",")
      .map((keyword) => keyword.trim());
  }

  // Extract areas of improvement
  const areasOfImprovement = input.match(areasOfImprovementPattern);
  if (areasOfImprovement) {
    const areas = areasOfImprovement[1]
      .split("\n- ")
      .map((area) => area.trim());
    output.Areas_of_Improvement = areas.filter(Boolean); // Removes empty values
  }

  // Extract additional pointers
  const additionalPointers = input.match(additionalPointersPattern);
  if (additionalPointers) {
    output.Additional_Pointers = additionalPointers[1].trim();
  }

  return output;
}

module.exports = router;
