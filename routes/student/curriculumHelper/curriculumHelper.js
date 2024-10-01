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

    const generatedText = `**1. Title: Tree Traversals: Navigating the Foliage of Nodes**
- Prerequisite: Tree basics, recursion
- Difficulty Level: Beginner
- Overview Concept: Tree traversals involve systematically visiting all nodes in a tree, mirroring the process of exploring a forest.

**2. Title: Binary Search Trees: Efficiently Locating the Needle in the Haystack**
- Prerequisite: Tree traversals
- Difficulty Level: Intermediate
- Overview Concept: Binary search trees leverage the properties of the binary search algorithm to organize and search elements rapidly.

**3. Title: Hash Tables: Rapid Retrieval in the Labyrinth of Data**
- Prerequisite: Array basics, hashing functions
- Difficulty Level: Intermediate
- Overview Concept: Hash tables employ hashing techniques to swiftly access and retrieve elements from vast datasets.

**4. Title: Graphs: Modeling Relationships like a Spider's Web**
- Prerequisite: None
- Difficulty Level: Beginner
- Overview Concept: Graphs represent entities and their connections, providing a framework for understanding interconnected systems.

**5. Title: Depth-First Search: Unraveling the Labyrinth**
- Prerequisite: Graphs
- Difficulty Level: Intermediate
- Overview Concept: Depth-first search traverses graphs by exploring every possible path to the end before backtracking.

**6. Title: Dijkstra's Algorithm: Finding the Shortest Path to Success**
- Prerequisite: Graphs, weighted edges
- Difficulty Level: Intermediate
- Overview Concept: Dijkstra's algorithm efficiently finds the shortest paths in weighted graphs, determining the most optimal route between nodes.

**7. Title: Dynamic Programming: Breaking Down Problems into Simpler Solutions**
- Prerequisite: Recursion
- Difficulty Level: Advanced
- Overview Concept: Dynamic programming decomposes complex problems into smaller subproblems, solving them incrementally to obtain optimal solutions.
oute between nodes.

**8. Title: Divide and Conquer: Vanquishing Complexity with Divide and Rule**
- Prerequisite: Recursion
- Difficulty Level: Advanced
- Overview Concept: Divide and conquer algorithms divide a problem into smaller, manageable segments, solving them recursively until the original problem is resolved
`;

    // Process the generated text into a structured JSON format
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
    var generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/\*/g, "");

    // const generatedText = `1. Which operation inserts an element at the front of a queue?
    // (A) Push
    // (B) Pop
    // (C) Enqueue
    // (D) Dequeue
    // Correct Answer: C

    // 2. Which operation returns the top element of a stack without removing it?
    // (A) Push
    // (B) Pop
    // (C) Peek
    // (D) Enqueue
    // Correct Answer: C

    // 3. Which data structure follows the Last-In First-Out (LIFO) principle?
    // (A) Queue
    // (B) Stack
    // (C) Linked List
    // (D) Array
    // Correct Answer: B

    // 4. Which operation removes the last element added to a queue?
    // (A) Push
    // (B) Pop
    // (C) Enqueue
    // (D) Dequeue
    // Correct Answer: D

    // 5. Which data structure is a linear collection of items, where each item is linked to the next item?
    // (A) Queue
    // (B) Stack
    // (C) Linked List
    // (D) Array
    // Correct Answer: C

    // 6. Which operation adds an element to the end of a stack?
    // (A) Push
    // (B) Pop
    // (C) Enqueue
    // (D) Dequeue
    // Correct Answer: A

    // 7. Which data structure is used to implement a breadth-first traversal of a tree?
    // (A) Queue
    // (B) Stack
    // (C) Linked List
    // (D) Array
    // Correct Answer: A

    // 8. Which operation returns the number of elements in a queue?
    // (A) Push
    // (B) Pop
    // (C) Size
    // (D) Enqueue
    // Correct Answer: C
    // `;

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

  var generatedText = await generateContent(prompt);
  generatedText = generatedText.replace(/\*/g, "");

  //   const generatedText = `**Analysis:**

  // Your quiz results demonstrate a reasonable understanding of indexing concepts and techniques. You accurately answered questions regarding the purpose and types of indexes, hashing techniques, and hybrid indexing. However, there are a few areas where improvement can be made.

  // **Areas to Improve:**

  // 1. **Precision and Accuracy:** In some instances, you incorrectly selected options. This indicates a need to carefully evaluate the question and ensure that your answer aligns with the correct option.
  // 2. **Understanding of Worst-Case Scenarios:** You incorrectly identified the worst-case scenario for finding an element in an open addressing hash table with linear probing. This suggests a misunderstanding of the probing technique and its impact on performance.
  // 3. **Knowledge of Cardinality Estimators:** While you correctly identified the purpose of cardinality estimators, you failed to provide further explanation. This suggests a need to deepen your understanding of the role of cardinality estimators in query optimization.

  // **Domain Marks:**

  // 1. Indexing: 7
  // 2. Hashing: 6
  // 3. Data Structures: 8
  // 4. Query Optimization: 5
  // 5. Cardinality Estimation: 4
  // 6. Database Management: 6
  // 7. Performance Tuning: 5
  // `;

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
