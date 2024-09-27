const { GoogleGenerativeAI } = require("@google/generative-ai");

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

module.exports = generateContent;
