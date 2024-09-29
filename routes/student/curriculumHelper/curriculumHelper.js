const express = require("express");
const generateContent = require("../components/gemini");

const router = express.Router();

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

  Sample Format Refer below:

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
    //const generatedText = await generateContent(prompt);

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

module.exports = router;

module.exports = router;

module.exports = router;
