const express = require("express");
const generateContent = require("../components/gemini");

const router = express.Router();

// Replace with the API key you created in the Google Cloud Console

function parseResearchIdeas(text) {
  const ideas = [];

  text = text.replace(/\*\*/g, "").trim();

  // Split text by each research idea
  var ideaBlocks = text.split(/\n\d+\./); // Splits at '1.', '2.', etc.

  ideaBlocks.forEach((block) => {
    if (block.trim()) {
      const titleMatch = block.match(/Title:(.+)/);
      const coreConceptsMatch = block.match(/Core Concepts:(.+)/);
      const difficultyMatch = block.match(/Difficulty Level:(.+)/);
      const overviewMatch = block.match(/Overview:(.+)/);

      const idea = {
        title: titleMatch ? titleMatch[1].trim() : "",
        coreConcepts: coreConceptsMatch ? coreConceptsMatch[1].trim() : "",
        difficultyLevel: difficultyMatch ? difficultyMatch[1].trim() : "",
        overview: overviewMatch ? overviewMatch[1].trim() : "",
      };

      ideas.push(idea);
    }
  });

  return ideas;
}
router.post("/generateResearchMate", async (req, res) => {
  const { CareerChoice, DomainOfInterest, engineeringStream } = req.body;

  // Construct the query using the provided body data
  const query = `
      Based on the career choice of ${CareerChoice}, 
      domain of interest in ${DomainOfInterest}, and the engineering stream ${engineeringStream}, 
      provide 8 different research ideas with the following details:
      1. Title
      2. Core Concepts
      3. Difficulty Level
      4. Overview

      Sample format :

1 . Title: Public Health Policy

Core Concepts: Policy Development, Legislative Processes, Ethics in Health Policy

Difficulty Level: Medium to High. Involves understanding complex legislative processes and ethical considerations.

Overview: Focuses on developing, implementing, and evaluating health policies aimed at improving public health outcomes.

2 . Title: Public Health Policy

Core Concepts: Policy Development, Legislative Processes, Ethics in Health Policy

Difficulty Level: Medium to High. Involves understanding complex legislative processes and ethical considerations.

Overview: Focuses on developing, implementing, and evaluating health policies aimed at improving public health outcomes.
    `;

  try {
    // Send query to the content generation function
    //const responseText = await generateContent(query);
    const responseText = `
1. **Title:** AI-Driven Health Monitoring for Remote and Underserved Communities
**Core Concepts:** Artificial intelligence, Internet of Things, remote patient monitoring, health disparities
**Difficulty Level:** High
**Overview:** Develop AI-powered devices and algorithms to monitor and track health metrics of individuals in remote or underserved communities, enabling early detection and prevention of chronic diseases.

2. **Title:** Cybersecurity for Medical IoT Devices
**Core Concepts:** Cybersecurity, Internet of Things, medical devices, data security
**Difficulty Level:** Medium to High
**Overview:** Investigate and develop cybersecurity measures to protect medical IoT devices from unauthorized access, data breaches, and hacking, ensuring patient safety and privacy.

3. **Title:** Smart Health Systems for Chronic Disease Management
**Core Concepts:** Smart health systems, chronic disease management, personalized healthcare
**Difficulty Level:** Medium
**Overview:** Design and implement smart health systems that leverage data analytics and machine learning to personalize chronic disease management plans, improving patient outcomes and quality of life.

4. **Title:** Gamified Health Education for Youth and Adolescents
**Core Concepts:** Gamification, health education, behavior change
**Difficulty Level:** Medium
**Overview:** Create gamified health education programs that make learning about health and wellness engaging and enjoyable for youth and adolescents, promoting healthy behaviors and reducing health risks.

5. **Title:** Telehealth for Mental Health Services
**Core Concepts:** Telehealth, mental health, access to care
**Difficulty Level:** Medium to High
**Overview:** Develop and evaluate telehealth platforms that provide accessible and affordable mental health services to underserved populations, reducing barriers to care and improving mental well-being.

6. **Title:** AI-Enhanced Care Coordination for Elderly and Disabled Populations
**Core Concepts:** Artificial intelligence, care coordination, aging population, disability
**Difficulty Level:** High
**Overview:** Develop AI-powered algorithms and tools to optimize care coordination for elderly and disabled individuals, improving access to services, reducing care fragmentation, and enhancing overall well-being.

7. **Title:** Smart Home Environment for Health Behavior Intervention
**Core Concepts:** Smart homes, health behavior, behavior change
**Difficulty Level:** Medium
**Overview:** Design and evaluate smart home environments that use sensors and algorithms to monitor, intervene, and support positive health behaviors, promoting a healthier lifestyle for individuals and families.

8. **Title:** Sustainable Health Innovation for Low-Income Countries
**Core Concepts:** Sustainable development, global health, healthcare inequality
**Difficulty Level:** High
**Overview:** Develop and implement health innovations that are affordable, sustainable, and scalable in low-income countries, addressing health disparities and improving health outcomes for vulnerable populations.
`;

    const ideas = parseResearchIdeas(responseText);

    // Send the parsed response as JSON
    res.json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/getOverview", async (req, res) => {
  try {
    const { Title, CoreConcepts, DifficultyLevel, Description } = req.body;

    // Ensure all required fields are present
    if (!Title || !CoreConcepts || !DifficultyLevel || !Description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the prompt for generating the content
    const query = `Generate a topic overview  & Also provide a requirement list in 50 words "${Title}" with core concepts: ${CoreConcepts} and description ${Description}
    Topic - > 60 words ;
    Requirements - > 50 words
    Sample format
    
    
**Topic Overview**
Smart Home Environment for Health Behavior Intervention focuses on leveraging smart home technologies to monitor, intervene, and support positive health behaviors. These environments utilize sensors and algorithms to provide personalized feedback, reminders, and interventions tailored to individual needs, promoting healthier lifestyles and improving well-being.
**Requirements**
* **Sensors:** To gather data on health-related activities, such as physical activity, sleep patterns, and medication adherence.       
* **Algorithms:** To analyze sensor data, identify behavior patterns, and provide tailored interventions.
* **Intervention Platform:** To deliver personalized feedback, reminders, and support through devices such as smartphones, smart speakers, or smart displays.
* **Data Management System:** To store and manage sensor data and intervention outcomes, ensuring privacy and security.
`;

    // Call the generateContent function with the prompt
    //const generatedResponse = await generateContent(query);

    const generatedResponse = `
    **Topic Overview**

    **Smart Home Environment for Health Behavior Intervention**

    Smart home environments leverage technology to monitor, intervene, and support positive health behaviors. They utilize sensors and algorithms to provide personalized feedback, reminders, and interventions tailored to individual needs. These environments empower individuals and families to make healthier choices and improve their overall well-being.

    **Requirements**

    * Sensors for data collection (e.g., activity trackers, sleep monitors)
    * Algorithms for data analysis and intervention design
    * Intervention platform for delivering personalized feedback and support (e.g., smartphone apps, smart speakers)
    * Data management system for secure storage and analysis
    * Privacy and security measures to protect sensitive health data
    `;

    const [overview, requirements] =
      splitOverviewAndRequirements(generatedResponse);

    // Send the AI-generated content back as response
    return res.status(200).json({
      overview: overview.replace(/[*:-]/g, "").trim(),
      requirements: requirements.replace(/[*:-]/g, "").trim(),
      Title,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/getOverviewOnYourIdea", async (req, res) => {
  try {
    const { idea } = req.body;

    // Ensure all required fields are present
    if (!idea) {
      return res.status(400).json({ error: "Missing idea field" });
    }

    // Create the prompt for generating the content
    const query = `Generate a topic overview  & Also provide a requirement list in 50 words  on a Reaserch Idea  : ${idea}
    Topic - > 60 words ;
    Requirements - > 50 words
    Sample format
    
    
**Topic Overview**
Smart Home Environment for Health Behavior Intervention focuses on leveraging smart home technologies to monitor, intervene, and support positive health behaviors. These environments utilize sensors and algorithms to provide personalized feedback, reminders, and interventions tailored to individual needs, promoting healthier lifestyles and improving well-being.
**Requirements**
* **Sensors:** To gather data on health-related activities, such as physical activity, sleep patterns, and medication adherence.       
* **Algorithms:** To analyze sensor data, identify behavior patterns, and provide tailored interventions.
* **Intervention Platform:** To deliver personalized feedback, reminders, and support through devices such as smartphones, smart speakers, or smart displays.
* **Data Management System:** To store and manage sensor data and intervention outcomes, ensuring privacy and security.
`;

    // Call the generateContent function with the prompt
    //const generatedResponse = await generateContent(query);

    const generatedResponse = `
    
**Topic Overview**

The intersection of health and agriculture presents a multifaceted field of study that examines the interdependencies between these two sectors. By exploring the role of agricultural practices on human health, researchers aim to optimize food production for improved nutritional outcomes and reduce the prevalence of diet-related diseases. Additionally, the development of health-enhancing agricultural technologies, such as precision farming and smart agriculture, holds promise for sustainable and resilient food systems that promote human well-being.

**Requirements**

* **Expertise in both health and agriculture:** A strong understanding of human physiology, nutrition, and agricultural practices is essential.
* **Data analysis skills:** Researchers should possess proficiency in statistical analysis, data mining, and modeling techniques to handle complex datasets.
* **Interdisciplinary collaboration:** The project requires collaboration with experts from various fields, including medical sciences, environmental science, and agricultural engineering.
* **Access to real-world data:** Collection of data from farms, food industries, and health institutions is crucial for analysis and validation.
* **Hands-on experience:** Involvement in agricultural practices or health-related initiatives is advantageous for practical knowledge and insights.
    `;

    const [overview, requirements] =
      splitOverviewAndRequirements(generatedResponse);

    // Send the AI-generated content back as response
    return res.status(200).json({
      overview: overview.replace(/[*:-]/g, "").trim(),
      requirements: requirements.replace(/[*:-]/g, "").trim(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

function splitOverviewAndRequirements(responseText) {
  const splitText = responseText.split("Requirements");

  // Remove "Topic Overview" from the overview section
  let overview = splitText[0].replace("Topic Overview", "").trim();

  // Add back "Requirements" to the requirements section and remove unwanted label text
  let requirements = splitText[1]
    ? splitText[1].replace("Requirements", "").trim()
    : "";

  return [overview, requirements];
}

// Route for text generation using the generateText function

module.exports = router;
