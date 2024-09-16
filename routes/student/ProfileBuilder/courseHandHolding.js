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

router.post("/generate-job-profiles", async (req, res) => {
  const { CareerChoice, DomainOfInterest, engineeringStream } = req.body;

  // Validate if the necessary fields are provided
  if (!CareerChoice || !DomainOfInterest || !engineeringStream) {
    return res.status(400).json({
      message:
        "CareerChoice, DomainOfInterest, and engineeringStream are required",
    });
  }

  // Construct the prompt to send to the AI model
  const prompt = `
      Generate 8 job profiles related to the following fields:
      Career Choice: ${CareerChoice}
      Domain of Interest: ${DomainOfInterest}
      Engineering Stream: ${engineeringStream}
  
      Each profile should include the following information:
      - Title
      - Skills Required
      - Salary Expectation
      - Description


      Sample format :

      
**title: Renewable Energy Engineer**
- **Skills Required:** Solar and wind energy technology, energy simulation software, project management
- **Salary Expectation:** INR 5-8 lakhs per annum
- **Description:** Design, develop, and implement renewable energy systems, conduct energy audits, and provide technical support.      

**title: Solar Photovoltaic Engineer**
- **Skills Required:** Solar panel design, installation, and maintenance, electrical engineering
- **Salary Expectation:** INR 4-6 lakhs per annum
- **Description:** Plan, install, and maintain solar photovoltaic systems, troubleshoot issues, and ensure system efficiency.

**tile :Wind Turbine Engineer**
- **Skills Required:** Wind turbine design, operation, and maintenance, mechanical engineering
- **Salary Expectation:** INR 5-7 lakhs per annum
- **Description:** Design, commission, and maintain wind turbines, monitor their performance, and perform preventative maintenance.    
    `;

  try {
    // Call the function to generate content from the AI model
    const generatedText = await generateContent(prompt);

    //     const generatedText = `
    // **Title: Software Development Engineer**
    // - **Skills Required:** Programming languages (Java, Python, React, Node.js), software design principles, agile methodologies
    // - **Salary Expectation:** INR 6-9 lakhs per annum
    // - **Description:** Design, develop, test, and maintain software applications, collaborate with cross-functional teams, and follow industry best practices.

    // **Title: Application Architect**
    // - **Skills Required:** Advanced programming skills, software design patterns, cloud computing, distributed systems
    // - **Salary Expectation:** INR 9-12 lakhs per annum
    // - **Description:** Lead software development teams, design and implement scalable and robust software architectures, and mentor junior engineers.

    // **Title: Mobile Application Developer**
    // - **Skills Required:** Mobile development frameworks (Android, iOS), mobile operating systems, user experience design
    // - **Salary Expectation:** INR 5-8 lakhs per annum
    // - **Description:** Build and maintain mobile applications, optimize for performance, and ensure user satisfaction by incorporating user feedback.

    // **Title: Data Engineer**
    // - **Skills Required:** Data management technologies (SQL, NoSQL), data mining techniques, cloud platforms (AWS, Azure)
    // - **Salary Expectation:** INR 7-10 lakhs per annum
    // - **Description:** Design and implement data pipelines, transform and analyze large datasets, and support data-driven decision-making in the organization.

    // **Title: Software Development Engineer**
    // - **Skills Required:** Programming languages (Java, Python, React, Node.js), software design principles, agile methodologies
    // - **Salary Expectation:** INR 6-9 lakhs per annum
    // - **Description:** Design, develop, test, and maintain software applications, collaborate with cross-functional teams, and follow industry best practices.

    // **Title: Application Architect**
    // - **Skills Required:** Advanced programming skills, software design patterns, cloud computing, distributed systems
    // - **Salary Expectation:** INR 9-12 lakhs per annum
    // - **Description:** Lead software development teams, design and implement scalable and robust software architectures, and mentor junior engineers.

    // **Title: Mobile Application Developer**
    // - **Skills Required:** Mobile development frameworks (Android, iOS), mobile operating systems, user experience design
    // - **Salary Expectation:** INR 5-8 lakhs per annum
    // - **Description:** Build and maintain mobile applications, optimize for performance, and ensure user satisfaction by incorporating user feedback.

    // **Title: Data Engineer**
    // - **Skills Required:** Data management technologies (SQL, NoSQL), data mining techniques, cloud platforms (AWS, Azure)
    // - **Salary Expectation:** INR 7-10 lakhs per annum
    // - **Description:** Design and implement data pipelines, transform and analyze large datasets, and support data-driven decision-making in the organization.
    //     `;

    // Example of how you can format the response from the model
    const jobProfiles = parseGeneratedTextToJobProfiles(generatedText);

    res.status(200).json({
      success: true,
      data: jobProfiles, // Return the formatted job profiles
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "An error occurred while generating job profiles",
    });
  }
});

// Utility function to clean up text
function cleanText(text) {
  return text
    .replace(/Skills Required:/gi, "")
    .replace(/Salary Expectation:/gi, "")
    .replace(/Title:/gi, "")
    .replace(/Description:/gi, "")
    .replace(/-/g, "")
    .replace(/\*\*/g, "")
    .trim();
}

// Utility function to parse generated text into job profiles
function parseGeneratedTextToJobProfiles(text) {
  const jobProfiles = [];

  // Example: Split profiles by some pattern, you may need to adjust this based on AI response structure
  const profiles = text.split("\n\n").filter(Boolean);

  profiles.forEach((profile) => {
    const lines = profile.split("\n").filter(Boolean);

    // Clean and remove unwanted characters like ** and \n
    const title = cleanText(lines[0].replace("Title: ", ""));
    const skills = cleanText(lines[1].replace("Skills Required: ", ""));
    const salary = cleanText(lines[2].replace("Salary Expectation: ", ""));
    const description = cleanText(lines.slice(3).join(" ")); // Join the remaining lines for the description

    jobProfiles.push({
      title,
      skills,
      salary,
      description,
    });
  });

  return jobProfiles;
}

function parseGeneratedCourses(text) {
  // Implement parsing logic for the AI-generated text
  const courses = text.split("\n\n").map((courseText) => {
    const lines = courseText.split("\n").map((line) => {
      // Remove *, -, and : from the string
      return line.replace(/[*:-]/g, "").trim();
    });
    return {
      title: lines[0]?.replace("Title", "").trim(),
      difficultyLevel: lines[1]?.replace("Difficulty Level", "").trim(),
      timeline: lines[2]?.replace("Timeline", "").trim(),
      description: lines[3]?.replace("Description", "").trim(),
    };
  });
  return courses;
}
function parseGeneratedCourses(text) {
  // Implement parsing logic for the AI-generated text
  const courses = text.split("\n\n").map((courseText) => {
    const lines = courseText.split("\n").map((line) => {
      // Remove *, -, and : from the string
      return line.replace(/[*:-]/g, "").trim();
    });
    return {
      title: lines[0]?.replace("Title", "").trim(),
      difficultyLevel: lines[1]?.replace("Difficulty Level", "").trim(),
      timeline: lines[2]?.replace("Timeline", "").trim(),
      description: lines[3]?.replace("Description", "").trim(),
    };
  });
  return courses;
}

router.post("/generate-recommended-course", async (req, res) => {
  const { title, skills, salary, description } = req.body;

  // Validate if the necessary fields are provided
  if (!title || !skills || !salary || !description) {
    return res.status(400).json({
      message: "Title, Skills, Salary, and Description are required",
    });
  }

  // Construct the prompt to send to the AI model
  const prompt = `
      Based on the job profile below, generate 8 recommended courses that would help someone excel in this job. 
      Each course should include the following details:
      - Title
      - Difficulty Level
      - Timeline (e.g., 3 months, 6 months)
      - Description
  
      Job Profile:
      - **Title**: ${title}
      - **Skills Required**: ${skills}
      - **Salary Expectation**: ${salary}
      - **Description**: ${description}
  
      Example of course format:

      
**Title : Mastering Java Multithreading**
- Difficulty Level: Intermediate
- Timeline: 4 months
- Description: Dive into the intricacies of multithreading, including thread creation, synchronization, and deadlock resolution.

**Title : Advanced Java Collections Framework**
- Difficulty Level: Intermediate
- Timeline: 3 months
- Description: Explore advanced data structures like hashmaps, trees, and queues, leveraging them to optimize code performance and efficiency.

**Title: Design Patterns in Java**
- Difficulty Level: Intermediate
- Timeline: 6 months
- Description: Gain proficiency in applying industry-standard design patterns to solve common software engineering challenges and enhance code reusability.
  
    `;

  try {
    // Call the function to generate content from the AI model
    var generatedText = await generateContent(prompt);

    // generatedText = `**Title: Data Structures and Algorithms in Python**
    // - Difficulty Level: Intermediate
    // - Timeline: 4 months
    // - Description: Explore essential data structures and algorithms in Python, covering concepts like arrays, linked lists, trees, and sorting techniques.

    // **Title: React Native Advanced Development**
    // - Difficulty Level: Advanced
    // - Timeline: 6 months
    // - Description: Delve into advanced React Native features, including complex UI design, state management, and optimizing performance for large-scale applications.

    // **Title: Agile Software Development with Jira**
    // - Difficulty Level: Intermediate
    // - Timeline: 3 months
    // - Description: Master agile methodologies using Jira, covering sprint planning, task management, and defect tracking for effective software development processes.

    // **Title: Cloud Computing with AWS Serverless Services**
    // - Difficulty Level: Intermediate
    // - Timeline: 5 months
    // - Description: Explore serverless architecture on AWS, building applications using services like Lambda, API Gateway, and DynamoDB to reduce infrastructure management overhead and improve scalability.

    // Title: Data Structures and Algorithms in Python**
    // - Difficulty Level: Intermediate
    // - Timeline: 4 months
    // - Description: Explore essential data structures and algorithms in Python, covering concepts like arrays, linked lists, trees, and sorting techniques.

    // **Title: React Native Advanced Development**
    // - Difficulty Level: Advanced
    // - Timeline: 6 months
    // - Description: Delve into advanced React Native features, including complex UI design, state management, and optimizing performance for large-scale applications.

    // **Title: Agile Software Development with Jira**
    // - Difficulty Level: Intermediate
    // - Timeline: 3 months
    // - Description: Master agile methodologies using Jira, covering sprint planning, task management, and defect tracking for effective software development processes.

    // **Title: Cloud Computing with AWS Serverless Services**
    // - Difficulty Level: Intermediate
    // - Timeline: 5 months
    // - Description: Explore serverless architecture on AWS, building applications using services like Lambda, API Gateway, and DynamoDB to reduce infrastructure management overhead and improve scalability.
    //     `;

    const courses = parseGeneratedCourses(generatedText);

    // Respond with the generated courses
    res.status(200).json({
      success: true,
      data: courses, // Return the formatted courses
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while generating courses",
    });
  }
});

router.post("/knowMoreAboutCourse", async (req, res) => {
  const { description, difficultyLevel, timeline, title } = req.body;

  // Validate if the necessary fields are provided
  if (!description || !difficultyLevel || !timeline || !title) {
    return res.status(400).json({
      message: "Description, difficultyLevel, timeline, and title are required",
    });
  }

  // Construct the prompt to send to the AI model
  const prompt = `
      Generate the following content based on the provided details:
      
      Title: ${title}
      Difficulty: ${difficultyLevel}
      Timeline: ${timeline}
      Description: ${description}
      
      Please generate: 60 words each , but dont mention 60 words 
      - Course Overview 
      - Tech Stacks, Technologies, and Tools Covered 


      sample response Format:

      
**Course Overview:**
Fundamentals of Health Information Systems course offers an in-depth exploration of the critical role and technology of managing health information systems in healthcare. It covers the spectrum from the impact of HIS on patient care and healthcare delivery to the technical nuances of managing and securing these systems. Participants will engage in detailed study and hands-on practice in areas such as electronic health records, data privacy and security, healthcare data analytics, and the integration of health information technology with healthcare processes. This course aims to bridge the theoretical and practical aspects of HIS, preparing learners for real-world applications and challenges in the healthcare industry.
**Tech Stacks, Technologies, and Tools Covered:**
Throughout the course, learners will be introduced to and gain proficiency with a variety of industry-standard technologies and tools, including: - Electronic Health Record (EHR) systems such as Epic and Cerner, for managing patient data and healthcare workflows. - Data privacy and security tools, understanding HIPAA compliance, and safeguarding patient information. - Healthcare data analytics platforms, using tools like SAS and Tableau for data visualization and decision support. - Introduction to health informatics standards and protocols, such as HL7 and FHIR, for data exchange and interoperability. - Practical exercises in using health information exchange (HIE) systems to understand the dynamics of data sharing among healthcare providers. This comprehensive coverage ensures learners are well-versed in the key technologies and tools essential for a career in


    `;

  try {
    // Call the function to generate content from the AI model
    const generatedText = await generateContent(prompt);

    // Example of how you can format the response from the model
    // Assuming generatedText is in the format "Course Overview:\n... Tech Stacks:\n..."
    const [courseOverview, techStacks] = generatedText
      .split("Tech Stacks, Technologies, and Tools Covered")
      .map((part) => part.trim());

    const cleanCourseOverview = courseOverview
      .replace(/(\*\*|:\s*|\n\s*)+/g, " ")
      .trim();

    const cleanTechStacks = techStacks
      .replace(/(\*\*|:\s*|\n\s*|\s{2,})+/g, " ")
      .trim();

    res.status(200).json({
      success: true,
      data: {
        courseOverview: cleanCourseOverview
          .replace("Course Overview:", "")
          .trim(),
        techStacks: cleanTechStacks.trim(),
        title: title,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "An error occurred while generating course details",
    });
  }
});

module.exports = router;
