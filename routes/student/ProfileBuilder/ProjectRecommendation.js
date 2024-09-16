const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Replace with the API key you created in the Google Cloud Console
const apiKey = process.env.apiKeyGemini;

async function generateContent(query) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(query);
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error:", error);
    // Handle specific errors (e.g., authentication, quota) or network issues
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(`Error: ${errorData.error.message}`);
    } else {
      throw new Error("An error occurred");
    }
  }
}
// Route for text generation using the generateText function

router.post("/generateProjectsRecommondadtions", async (req, res) => {
  const { CareerChoice, DomainOfInterest, engineeringStream } = req.body;

  console.log(CareerChoice + " " + DomainOfInterest + " " + engineeringStream);

  try {
    const query = `My education is ${engineeringStream}, and my domain of interest is ${DomainOfInterest}. My career choice is ${CareerChoice}. Now suggest me 8 project ideas with the following details for each Title: (5-6 words), Category: (7-8 words), Overview: of the project in 3 lines, Market Trend: (5 to 8 words). For each project, provide the number before each title along with the title key word after that number for the project. Compulsorily mention Title, Overview, Category, Market Trend subheading without fail. No key words
    One sample Format 
    
    1. Title:Smart Irrigation System,
    Category: Agriculture Automation,
    Overview: An automated irrigation system that optimizes water usage based on soil moisture and environmental conditions.,
    Market Trend: Increasing water scarcity and demand for efficient irrigation solutions.

  2. Title:Precision Farming Drone,
   Category: Crop Monitoring and Management,
    Overview: A drone equipped with sensors and software to collect and analyze data on crop health, pests, and soil conditions.,
    Market Trend: Precision agriculture techniques and the growing use of drones.`;

    var generatedText = await generateContent(query);

    //     var generatedText = `1. Title: Smart Patient Monitoring
    //    Category: Remote Healthcare
    //    Overview: A device or system that remotely monitors patients' vital signs and sends alerts to medical professionals in case of emergencies.
    //    Market Trend: Increasing demand for remote healthcare and wearable devices.

    // 2. Title: Personalized Health Assistant
    //    Category: Health Management
    //    Overview: An AI-powered app that provides personalized health advice, diet recommendations, and medication reminders.
    //    Market Trend: Growing focus on preventive healthcare and self-management.

    // 3. Title: Telemedicine Platform
    //    Category: Healthcare Delivery
    //    Overview: A platform that connects patients with healthcare professionals for virtual consultations, diagnoses, and prescriptions.
    //    Market Trend: Expanding virtual healthcare and the need for convenient medical access.

    // 4. Title: Mental Health Tracking App
    //    Category: Mental Well-being
    //    Overview: An app that tracks mood, sleep, and stress levels, provides coping mechanisms, and connects users with mental health resources.
    //    Market Trend: Rising prevalence of mental health issues and demand for accessible support.

    // 5. Title: Smart Home Care System
    //    Category: Senior Care
    //    Overview: A system that monitors the safety and well-being of seniors living alone, providing alerts and assistance in case of falls or emergencies.
    //    Market Trend: Aging population and the need for innovative senior care solutions.

    // 6. Title: Nutrition Optimization Tool
    //    Category: Dietary Health
    //    Overview: A tool that analyzes dietary intake, provides personalized meal plans, and connects users with registered dietitians for support.
    //    Market Trend: Growing awareness of the importance of healthy eating and personalized nutrition.

    // 7. Title: Health Education Platform
    //    Category: Community Health
    //    Overview: A platform that provides accessible and engaging health education resources on topics such as preventive care, disease prevention, and healthy lifestyles.
    //    Market Trend: Increasing demand for evidence-based health information.

    // 8. Title: Fitness Tracking and Gamification App
    //    Category: Physical Activity
    //    Overview: An app that tracks fitness activities, rewards progress, and encourages healthy competition among users.
    //    Market Trend: Rising popularity of fitness tracking devices and the gamification of health and wellness.`;

    generatedText = generatedText.replace(/\*/g, "");

    const projects = generatedText.split(/\d+\.\s+/).slice(1);

    const projectDetails = projects.map((projectText) => {
      // Regex patterns to capture text after each keyword up to the next keyword or end of string
      const titleMatch = projectText.match(
        /^(.*?)(?=\s*\*\*\s*Category\s*:|\s*Category\s*:)/s
      );

      const categoryMatch = projectText.match(
        /Category:\s*([^:]+)(?=(\s*[^:]*:|\s*$))/
      );
      const overviewMatch = projectText.match(
        /Overview:\s*([^:]+)(?=(\s*[^:]*:|\s*$))/
      );
      const marketTrendMatch = projectText.match(
        /Market Trend:\s*([^:]+)(?=(\s*[^:]*:|\s*$))/
      );

      let categoryText = categoryMatch ? categoryMatch[1].trim() : "Not found";

      categoryText = categoryText; // Remove the last word
      if (categoryText.endsWith("Market Trend")) {
        categoryText = categoryText.replace(/Market Trend/, "").trim();
      }
      if (categoryText.endsWith("Category")) {
        categoryText = categoryText.replace(/Category/, "").trim();
      }
      if (categoryText.endsWith("Overview")) {
        categoryText = categoryText.replace(/Overview/, "").trim();
      }

      let title = titleMatch ? titleMatch[1].trim() : "Not found";
      title = title.replace(/^Title:\s*/, "").trim(); // Remove "Title:" if it exists
      if (title.endsWith("Market Trend")) {
        title = title.replace(/Market Trend/, "").trim();
      }
      if (title.endsWith("Category")) {
        title = title.replace(/Category/, "").trim();
      }
      if (title.endsWith("Overview")) {
        title = title.replace(/Overview/, "").trim();
      }

      let overviewText = overviewMatch ? overviewMatch[1].trim() : "Not found";
      // Remove trailing "Market Trend" from overview if present
      if (overviewText.endsWith("Market Trend")) {
        overviewText = overviewText.replace(/Market Trend/, "").trim();
      }
      if (overviewText.endsWith("Category")) {
        overviewText = overviewText.replace(/Category/, "").trim();
      }

      let marketTrendMatchh = marketTrendMatch
        ? marketTrendMatch[1].trim()
        : "Not found";
      if (marketTrendMatchh.endsWith("Market Trend")) {
        marketTrendMatchh = marketTrendMatchh
          .replace(/Market Trend/, "")
          .trim();
      }
      if (marketTrendMatchh.endsWith("Category")) {
        marketTrendMatchh = marketTrendMatchh.replace(/Category/, "").trim();
      }
      if (marketTrendMatchh.endsWith("Overview")) {
        marketTrendMatchh = marketTrendMatchh.replace(/Overview/, "").trim();
      }

      return {
        title: title ? title : "",
        category: categoryText ? categoryText : "",
        overview: overviewText ? overviewText : "",
        marketTrend: marketTrendMatchh ? marketTrendMatchh : "",
      };
    });

    // Return the JSON response
    res.json({ projects: projectDetails });

    // Map the project strings into JSON objects
    // Return the JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/getKnowMoreProjectRecommend", async (req, res) => {
  try {
    // Extract the JSON data from the request body
    const projectDetails = req.body;

    // Log the JSON data to the console
    console.log("Received Project Details:", projectDetails.project);

    const query = `The project title is "${projectDetails.project.title}". 
    The project category is "${projectDetails.project.category}".
    The project market trend is "${projectDetails.project.marketTrend}".
    The project overview is "${projectDetails.project.overview}".

    Describe all these
    1. Relevance in India Market: (25 words).
    2. Government Policies: (25 words).
    3. Impact:(25 words).
    4. Goal: (20 words).
    5. List the knowledge requirements for this project, including technical stack, skills, and tools.
    
    For sample Format refer below

1. Relevance in India Market: With India's ambitious goals for solar energy adoption, this project contributes to the need for accurate forecasting to optimize grid integration and prevent power outages.
2. Government Policies: The Ministry of New and Renewable Energy (MNRE) promotes solar PV forecasting through schemes like the National Solar Mission and the Rooftop Solar Programme.
3. Impact: This project has the potential to improve grid stability, reduce curtailment, and enhance the utilization of solar power, leading to significant economic and environmental benefits.
4. Goal: To develop a predictive model for forecasting solar PV power output to facilitate optimal grid management and reduce energy wastage.
5. Knowledge Requirements:
   Technical Stack: Python, Machine Learning (e.g., Scikit-learn, Keras), Data Analytics (e.g., Pandas, Matplotlib)     
   Skills: Solar PV fundamentals, Time Series Analysis, Data Preprocessing, Model Evaluation
   Tools: Weather Data Sources (e.g., NCEP, GFS), PV Power Data (e.g., NREL), Cloud Computing (e.g., AWS, Azure)   
    
    `;

    const generatedInfo = await generateContent(query);

    //   var generatedInfo = `
    //  **1. Relevance in India Market:**
    //  The aging population and rising prevalence of chronic diseases in India create a significant demand for home health care services.

    //  **2. Government Policies:**
    //  Government initiatives like the National Health Policy and Ayushman Bharat promote home-based care and encourage the adoption of technology in healthcare.

    //  **3. Impact:**
    //  The platform empowers patients with access to quality home health care, improves their well-being, and reduces healthcare costs by enabling timely interventions.

    //  **4. Goal:**
    //  To provide a seamless and accessible platform for patients to connect with trusted and skilled home health care providers.

    //  **5. Knowledge Requirements:**
    //  **Technical Stack:**
    //  - Front-end Development: React/Redux, Bootstrap
    //  - Back-end Development: Node.js, Express, MongoDB
    //  - Cloud Computing: AWS/Azure
    //  **Skills:**
    //  - Healthcare Industry Knowledge
    //  - Software Development
    //  - UI/UX Design
    //  **Tools:**
    //  - IDE (e.g., Visual Studio Code)
    //  - Version Control (e.g., Git)
    //   - Project Management Tools (e.g., Jira, Trello)
    //  `;

    const parsedJson = parseGeneratedInfoToJson(generatedInfo);

    // Log the generated JSON
    console.log(JSON.stringify(parsedJson, null, 2));

    // Parse into JSON

    // Send a success response back to the client
    res.status(200).json({ data: parsedJson });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

function parseGeneratedInfoToJson(infoString) {
  const jsonResult = {};

  // Remove '**' and trim extra spaces/newlines
  infoString = infoString.replace(/\*\*/g, "").trim();

  // Regular expressions to extract different sections
  const relevanceRegex = /Relevance in India Market:\s*([^\n]+)/;
  const policiesRegex = /Government Policies:\s*([^\n]+)/;
  const impactRegex = /Impact:\s*([^\n]+)/;
  const goalRegex = /Goal:\s*([^\n]+)/;
  const techStackRegex = /Technical Stack:\s*([\s\S]*?)(Skills:|\n-\s*Skills:)/;
  const skillsRegex = /Skills:\s*([\s\S]*?)(Tools:|\n-\s*Tools:)/;
  const toolsRegex = /Tools:\s*([\s\S]+)/;

  // Extract values using the regular expressions
  jsonResult.relevanceInIndiaMarket =
    infoString.match(relevanceRegex)?.[1]?.trim() || "";
  jsonResult.governmentPolicies =
    infoString.match(policiesRegex)?.[1]?.trim() || "";
  jsonResult.impact = infoString.match(impactRegex)?.[1]?.trim() || "";
  jsonResult.goal = infoString.match(goalRegex)?.[1]?.trim() || "";

  // Function to split lists and clean up unwanted characters
  const cleanList = (str) =>
    str
      .trim()
      .split("\n")
      .map((item) => item.replace(/^-/, "").trim())
      .filter(Boolean); // Filter out any empty items

  jsonResult.knowledgeRequirements = {
    technicalStack: cleanList(infoString.match(techStackRegex)?.[1] || ""),
    skills: cleanList(infoString.match(skillsRegex)?.[1] || ""),
    tools: cleanList(infoString.match(toolsRegex)?.[1] || ""),
  };

  return jsonResult;
}
module.exports = router;
