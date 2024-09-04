const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Replace with the API key you created in the Google Cloud Console
const apiKey = "AIzaSyCXIG5dn5tfy_whaXYVV3ckdMrWrMfdaFw";

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
    
    1. Title:**Smart Irrigation System,
    Category: Agriculture Automation,
    Overview: An automated irrigation system that optimizes water usage based on soil moisture and environmental conditions.,
    Market Trend: Increasing water scarcity and demand for efficient irrigation solutions.

  2. Title:Precision Farming Drone,
   Category: Crop Monitoring and Management,
    Overview: A drone equipped with sensors and software to collect and analyze data on crop health, pests, and soil conditions.,
    Market Trend: Precision agriculture techniques and the growing use of drones.`;

    var generatedText = await generateContent(query);

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

module.exports = router;
