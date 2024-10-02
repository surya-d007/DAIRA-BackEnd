const express = require("express");
const generateContent = require("../components/gemini");

const router = express.Router();
const fs = require("fs");

router.post("/generate-topicsIn-course", async (req, res) => {
  const { subject, module } = req.body;

  // Validate if the necessary fields are provided
  if (!subject || !module) {
    return res.status(400).json({
      message: "subject, module required",
    });
  }

  // Construct the prompt to send to the AI model
  const prompt = `
    Based on the subject: ${subject} and module: ${module} below, generate 8 recommended topics in that that would help someone excel in this subject.
    Each topic should include the following details:
    - Title
    - Prerequisite
    - Difficulty Level
    - Overview Concept

    Example format:

   **1. Title: Tree Traversals: Navigating the Foliage of Nodes**
- Prerequisite: Tree basics, recursion
- Difficulty Level: Beginner
- Overview Concept: Tree traversals involve systematically visiting all nodes in a tree, mirroring the process of exploring a forest.

**2. Title: Binary Search Trees: Efficiently Locating the Needle in the Haystack**
- Prerequisite: Tree traversals
- Difficulty Level: Intermediate
- Overview Concept: Binary search trees leverage the properties of the binary search algorithm to organize and search elements rapidly.

  `;

  try {
    // Call the function to generate content from the AI model
    //const generatedText = await generateContent(prompt);

    const generatedText = `
**1. Title: Relational Data Model: Understanding the Foundation of Databases **
- Prerequisite: Basic set theory
- Difficulty Level: Beginner CHEI PAR
- Overview Concept: The relational data model provides a structured approach to organizing data in tables, ensuring data integrity and consistency.

**2. Title: Entity-Relationship Model: Designing Conceptual Schemas**
- Prerequisite: Understanding relational data model
- Difficulty Level: Intermediate
- Overview Concept: Entity-relationship models graphically represent relationships between entities, facilitating the development of conceptual database schemas.

**3. Title: Structured Query Language (SQL): Unlocking the Power of Data Retrieval and Manipulation**
- Prerequisite: Basic understanding of relational data
- Difficulty Level: Intermediate
- Overview Concept: SQL serves as the primary language for interacting with relational databases, enabling users to perform data retrieval, manipulation, and management tasks.

**4. Title: Database Normalization: Minimizing Redundancy and Enhancing Data Quality**
- Prerequisite: Understanding relational data model
- Difficulty Level: Intermediate
- Overview Concept: Database normalization involves breaking down tables into smaller, more focused tables to eliminate redundancy and improve data integrity.

**5. Title: Database Transaction Processing: Ensuring Data Integrity During Concurrent Operations**
- Prerequisite: Understanding SQL basics
- Difficulty Level: Intermediate
- Overview Concept: Transaction processing manages concurrent database operations, ensuring that transactions are executed atomically, consistently, isolated, and durably (ACID).

**6. Title: Query Optimization: Enhancing Database Performance**
- Prerequisite: Understanding SQL and database internals
- Difficulty Level: Advanced
- Overview Concept: Query optimization techniques help improve the efficiency of SQL queries by analyzing execution plans and identifying optimal execution strategies.

**7. Title: Data Warehousing and Big Data Analytics: Harnessing the Power of Massive Datasets**
- Prerequisite: Understanding relational data model and SQL
- Difficulty Level: Advanced
- Overview Concept: Data warehousing involves collecting, organizing, and analyzing large volumes of data to support decision-making and business intelligence.

**8. Title: NoSQL Databases: Exploring Alternatives to Relational Databases**
- Prerequisite: Understanding relational data model
- Difficulty Level: Intermediate
- Overview Concept: NoSQL databases provide alternative data storage models optimized for specific application scenarios, such as unstructured data, scalability, and high availability.

`;
    const topicsArray = processGeneratedText(generatedText);

    res.status(200).json({
      success: true,
      data: topicsArray, // Return the formatted topics
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while generating topics",
    });
  }
});

router.post("/generate-topicsIn-course-knowMore", async (req, res) => {
  const { title, prerequisite, difficultyLevel, overviewConcept } = req.body;

  // Validate if the necessary fields are provided
  if (!title || !overviewConcept) {
    return res.status(400).json({
      message: "subject, module required",
    });
  }

  // Construct the prompt to send to the AI model
  const prompt = `
    Based on the title: ${title} and prerequisite: ${prerequisite}  and overviewConcept : ${overviewConcept} GENERATE Overview in 60 words and Tech Stacks, Technologies, and Tools Covered in 60 words , strictly i need 60 words each
    

    Example format:

Overview:
Fundamentals of Health Information Systems course offers an in-depth exploration of the critical role and technology of managing health information systems in healthcare. It covers the spectrum from the impact of HIS on patient care and healthcare delivery to the technical nuances of managing and securing these systems. Participants will engage in detailed study and hands-on practice in areas such as electronic health records, data privacy and security, healthcare data analytics, and the integration of health information technology with healthcare processes. This course aims to bridge the theoretical and practical aspects of HIS, preparing learners for real-world applications and challenges in the healthcare industry.

Tech Stacks, Technologies, and Tools Covered:
Throughout the course, learners will be introduced to and gain proficiency with a variety of industry-standard technologies and tools, including: - Electronic Health Record (EHR) systems such as Epic and Cerner, for managing patient data and healthcare workflows. - Data privacy and security tools, understanding HIPAA compliance, and safeguarding patient information. - Healthcare data analytics platforms, using tools like SAS and Tableau for data visualization and decision support. - Introduction to health informatics standards and protocols, such as HL7 and FHIR, for data exchange and interoperability. - Practical exercises in using health information exchange (HIE) systems to understand the dynamics of data sharing among healthcare providers. This comprehensive coverage ensures learners are well-versed in the key technologies and tools essential for a career in

  `;

  try {
    // Call the function to generate content from the AI model
    const generatedText = await generateContent(prompt);

    //     const generatedText = `**Overview:**
    // Query Optimization aims to enhance the efficiency of database queries by optimizing execution plans and identifying optimal execution strategies through the analysis of execution plans, leading to improved performance.

    // **Tech Stacks, Technologies, and Tools Covered:**
    // This topic introduces and covers techniques and algorithms for query optimization, including cost-based optimization, join ordering, and index selection. It explores the use of key technologies like query optimizers, execution plans, and database management systems (DBMS).`;

    const extractedContent = extractContentFromGeneratedText(
      generatedText,
      title
    );

    // Return the extracted content as JSON
    res.status(200).json({
      success: true,
      data: extractedContent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while generating topics",
    });
  }
});

// Function to extract topic overview and tech stacks from the generated text
const extractContentFromGeneratedText = (text, title) => {
  // Define case-insensitive keywords to find the sections
  const overviewKeyword = /overview\s*/i;
  const techStackKeyword = /tech stacks\s*/i;

  // Search for the positions of the keywords using regular expressions
  const overviewMatch = text.match(overviewKeyword);
  const techStackMatch = text.match(techStackKeyword);

  if (!overviewMatch || !techStackMatch) {
    throw new Error("Required sections not found in the generated text");
  }

  // Extract content using the index of the matched keywords
  const topicOverview = text
    .substring(
      overviewMatch.index + overviewMatch[0].length,
      techStackMatch.index
    )
    .trim();

  let techStacks = text
    .substring(techStackMatch.index + techStackMatch[0].length)
    .trim();

  // Check if the techStacks string contains a colon and remove everything before and including it
  if (techStacks.includes(":")) {
    techStacks = techStacks.substring(techStacks.indexOf(":") + 1).trim();
  }

  // Return the extracted content as JSON
  return {
    topicOverview,
    techStacks,
    title,
  };
};

// Function to process the AI-generated text and convert it into a structured JSON
function processGeneratedText(generatedText) {
  const topicsArray = [];

  // Split the generated text by topic based on "Title"
  const topics = generatedText
    .split(/\*\*\d+\.\s+Title:/)
    .filter((topic) => topic.trim() !== "");

  topics.forEach((topic) => {
    // Extract the details using keyword splits
    const titleMatch = topic.match(/(.+)\n- Prerequisite:/);
    const prerequisiteMatch = topic.match(
      /- Prerequisite:\s*(.+)\n- Difficulty Level:/
    );
    const difficultyMatch = topic.match(
      /- Difficulty Level:\s*(.+)\n- Overview Concept:/
    );
    const overviewMatch = topic.match(/- Overview Concept:\s*(.+)/);

    // Create an object for each topic only if all fields are found
    if (titleMatch && prerequisiteMatch && difficultyMatch && overviewMatch) {
      const topicObject = {
        title: titleMatch[1].trim(),
        prerequisite: prerequisiteMatch[1].trim(),
        difficultyLevel: difficultyMatch[1].trim(),
        overviewConcept: overviewMatch[1].trim(),
      };

      // Push the topic object into the topics array
      topicsArray.push(topicObject);
    }
  });

  return topicsArray;
}
router.post("/generate-quizOn-course", async (req, res) => {
  const { subject, module } = req.body;

  // Validate if the necessary fields are provided
  if (!subject || !module) {
    return res.status(400).json({
      message: "subject, module required",
    });
  }

  const prompt = `
  Based on the subject: ${subject} and module: ${module} below, generate 8 QUIZ QUESTIONS with 4 options and one correct answer that would help someone excel in this subject.
  Each topic should include the following details:

  Sample Format Refer below: dont include any other than this , not even a single thing change in this fromat , dont include any kind of topic and title

1. Which operation inserts an element at the front of a queue?
(A) Push
(B) Pop
(C) Enqueue
(D) Dequeue
Correct Answer: C

2. Which operation returns the top element of a stack without removing it?
(A) Push
(B) Pop
(C) Peek
(D) Enqueue
Correct Answer: C

3. Which data structure follows the Last-In First-Out (LIFO) principle?
(A) Queue
(B) Stack
(C) Linked List
(D) Array
Correct Answer: B

4. Which operation removes the last element added to a queue?
(A) Push
(B) Pop
(C) Enqueue
(D) Dequeue
Correct Answer: D
`;

  try {
    // Process the generated text into a structured JSON format
    // var generatedText = await generateContent(prompt);
    // generatedText = generatedText.replace(/\*/g, "");

    const generatedText = `1. Which operation inserts an element at the front of a queue?
    (A) Push
    (B) Pop
    (C) Enqueue
    (D) Dequeue
    Correct Answer: C

    2. Which operation returns the top element of a stack without removing it?
    (A) Push
    (B) Pop
    (C) Peek
    (D) Enqueue
    Correct Answer: C

    3. Which data structure follows the Last-In First-Out (LIFO) principle?
    (A) Queue
    (B) Stack
    (C) Linked List
    (D) Array
    Correct Answer: B

    4. Which operation removes the last element added to a queue?
    (A) Push
    (B) Pop
    (C) Enqueue
    (D) Dequeue
    Correct Answer: D

    5. Which data structure is a linear collection of items, where each item is linked to the next item?
    (A) Queue
    (B) Stack
    (C) Linked List
    (D) Array
    Correct Answer: C

    6. Which operation adds an element to the end of a stack?
    (A) Push
    (B) Pop
    (C) Enqueue
    (D) Dequeue
    Correct Answer: A

    7. Which data structure is used to implement a breadth-first traversal of a tree?
    (A) Queue
    (B) Stack
    (C) Linked List
    (D) Array
    Correct Answer: A

    8. Which operation returns the number of elements in a queue?
    (A) Push
    (B) Pop
    (C) Size
    (D) Enqueue
    Correct Answer: C
    `;

    const quizArray = processGeneratedQuiz(generatedText);

    res.status(200).json({
      success: true,
      data: quizArray, // Return the formatted quiz
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "An error occurred while generating quiz questions",
    });
  }
});

// Function to process the AI-generated text and convert it into a structured JSON
function processGeneratedQuiz(generatedText) {
  const quizArray = [];

  // Split by question numbers using regex to capture the start of each question
  const questions = generatedText.split(/(?=\d+\.\s)/g);

  questions.forEach((questionBlock) => {
    const lines = questionBlock
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (lines.length < 6) return; // Skip if it's not a valid question format

    // Extract the question and options
    const question = lines[0].replace(/[0-9]+\.\s/, "").trim(); // Remove the number and keep the question text
    const optionA = lines[1].replace("(A)", "").trim();
    const optionB = lines[2].replace("(B)", "").trim();
    const optionC = lines[3].replace("(C)", "").trim();
    const optionD = lines[4].replace("(D)", "").trim();
    const correctAnswer = lines[5].replace("Correct Answer:", "").trim();

    // Push the formatted question into the array
    quizArray.push({
      question: question,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctAnswer: correctAnswer,
    });
  });

  return quizArray;
}

router.post("/generate-Results-quiz", async (req, res) => {
  const { results } = req.body;

  console.log("result init      ", JSON.stringify(results, null, 2));
  const jsonResults = JSON.stringify(results, null, 2);

  // Validate if the necessary fields are provided
  if (!results) {
    return res.status(400).json({
      message: "results required",
    });
  }

  // Calculate score
  let correctCount = 0;
  results.forEach((result) => {
    if (result.selectedOption == result.correctOption) {
      correctCount++;
    }
  });

  // Calculate percentage score
  const totalQuestions = results.length;
  const percentageScore =
    totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  // Create the prompt for performance analysis
  const prompt = `
      Evaluate the performance based on the following quiz results:
      ${results
        .map((result) => {
          return (
            `Question: ${result.question}\n` +
            `Options: ${result.options.join(", ")}\n` +
            `User Selected Option: ${result.selectedOption}\n` +
            `Correct Option: ${result.correctOption}\n`
          );
        })
        .join("\n")}
      
      Provide a description on the user test results  , and the area to imporove and alone with domains marks , minum 7 domain and its marks reuqired strictly

      sample output format :  strictly i need the same key words - > Analysis , Areas to improve , dont change any words and format

**Analysis:**
Your performance shows a solid understanding of the basic operation of a queue data structure and its operation. Specifically, you accurately identified that the 'Enqueue' operation is used to insert an element at the front of a queue. This indicates a fundamental comprehension of how queues work.

**Areas to improve:**
Despite your strong understanding of the basic queue operation, there are some areas that could benefit from further attention:

1. **Interpretation of Question:** In some cases, you misinterpreted the question and provided an incorrect answer. This suggests that you may be rushing through the questions without carefully reading and understanding the context. Taking a more deliberate approach and focusing on accurately interpreting the question before answering will improve your performance.
2. **Attention to Detail:** Your answers were inconsistent, with some correct and others incorrect. This inconsistency points to a possible lack of attention to detail. It's important to carefully review your answers and ensure they align with the question being asked.
3. **Understanding of Other Queue Operations:** While you correctly identified the 'Enqueue' operation, you seem to lack a clear understanding of other queue operations, such as 'Dequeue' and 'Push'. This indicates a need to revisit and reinforce your knowledge of the different queue operations and their specific functions.

Domain marks:
1. Queue: 8
2. Stack: 4
3. Linked List: 4
4. DSA: 7
5. Push: 5
6. Pop: 3
7. Peek: 4

  `;

  // Call your processing function

  // var generatedText = await generateContent(prompt);
  // generatedText = generatedText.replace(/\*/g, "");

  const generatedText = `**Analysis:**
Your performance shows a basic understanding of the fundamental operations of a queue data structure. However, there are areas where your responses indicate a need for improvement.

**Areas to Improve:**
1. **Interpretation of Questions:** In several instances, you misinterpreted the questions and provided incorrect answers. This suggests that you may be rushing through the questions without仔细阅读和理解上下文.
2. **Accuracy:** Your answers were inconsistent, with some correct and others incorrect. This inconsistency points to a lack of attention to detail. Carefully review your answers to ensure they align with the question being asked.
3. **Grasp of Other Queue Operations:** While you correctly identified the 'Enqueue' operation, you seem to lack a clear understanding of other queue operations, such as 'Dequeue' and 'Push'. Reinforce your knowledge of the different queue operations and their specific functions.

**Domain Marks:**
1. Queue: 6
2. Stack: 3
3. Linked List: 2
4. Push: 3
5. Pop: 2
6. Peek: 2
7. DSA: 4
`;

  const feedbackJson = parseFeedback(generatedText);

  // Send only the score back as a JSON response
  res.json({
    score: percentageScore.toFixed(1), // Send score as a string with 2 decimal places
    //score: 34,
    Jsonfeedback: feedbackJson,
    generatedText,
  });
});

function parseFeedback(generatedText) {
  // Trim the generatedText to avoid any leading or trailing whitespace
  generatedText = generatedText.trim();

  let analysis = "";
  let areasToImprove = [];
  let domainMarks = {};

  // Define the keywords to find the sections (lowercased for case-insensitive matching)
  const analysisKeyword = "analysis:"; // Use lowercase
  const areasKeyword = "areas to improve:"; // Use lowercase
  const domainMarksKeyword = "domain marks"; // Use lowercase

  // Convert generatedText to lowercase for case-insensitive search
  const lowerCaseText = generatedText.toLowerCase();

  // Find the start of the Analysis, Areas to Improve, and Domain Marks sections
  const analysisStart = lowerCaseText.indexOf(analysisKeyword);
  const areasStart = lowerCaseText.indexOf(areasKeyword);
  const domainMarksStart = lowerCaseText.indexOf(domainMarksKeyword);

  // If Analysis section is found
  if (analysisStart !== -1 && areasStart !== -1) {
    // Capture the analysis part
    analysis = generatedText
      .substring(analysisStart + analysisKeyword.length, areasStart)
      .trim();

    // Extract the areas to improve section
    const areasText = generatedText
      .substring(areasStart + areasKeyword.length, domainMarksStart)
      .trim();

    // Split the areas into lines for processing
    const areaLines = areasText
      .split("\n")
      .filter((line) => line.trim() !== "");

    // Process each area to improve
    areaLines.forEach((line) => {
      if (line.match(/^\d+\./)) {
        // Match only lines that start with a number followed by a period
        const area = line.replace(/^\d+\.\s*/, "").trim(); // Remove the numbering
        const [title, ...descriptionParts] = area.split(":"); // Split title and description

        if (title && descriptionParts.length > 0) {
          // Join description parts back if there are multiple
          const description = descriptionParts.join(":").trim();
          areasToImprove.push({
            title: title.replace(/\*\*/g, "").trim(), // Remove markdown formatting
            description: description.trim(),
          });
        }
      }
    });
  }

  // Parse Domain Marks if present
  if (domainMarksStart !== -1) {
    const domainMarksText = generatedText
      .substring(domainMarksStart + domainMarksKeyword.length)
      .trim();

    // Match domain and marks lines like: "Queue : 8"
    const domainPattern = /([a-zA-Z\s]+):\s*(\d+)/g;
    let match;
    while ((match = domainPattern.exec(domainMarksText)) !== null) {
      const domain = match[1].trim(); // Extract domain name
      const mark = parseInt(match[2], 10); // Convert mark to integer
      domainMarks[domain] = mark;
    }
  }

  return {
    Analysis: analysis,
    AreasToImprove: areasToImprove,
    DomainMarks: domainMarks,
  };
}

module.exports = router;
