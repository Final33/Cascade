import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CourseId } from "@/lib/course-config";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Define API request parameters interface
interface GenerateQuestionsRequest {
  course: CourseId;
  testType: "mcq" | "frq" | "full";
  questionCount: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "ap-level";
  selectedUnits: string[];
}

// Course-specific unit descriptions
const unitDescriptions: Record<CourseId, Record<string, string>> = {
  "calc-ab": {
    "limits": "limits and continuity, including one-sided limits and limits at infinity",
    "derivatives": "differential calculus and basic derivative rules including power rule, product rule, quotient rule",
    "derivatives-apps": "applications of derivatives including implicit differentiation, related rates, and chain rule",
    "apps-derivatives": "advanced applications of derivatives like optimization, mean value theorem, and curve sketching",
    "integration": "integral calculus and basic integration techniques including u-substitution",
    "differential-equations": "solving separable differential equations and slope fields",
    "apps-integration": "applications of integration like area between curves, volumes of revolution, and accumulation"
  },
  "cs-a": {
    "primitive-types": "Java primitive data types, variables, operators, and control flow",
    "objects": "object-oriented programming concepts, class methods, and instance variables",
    "boolean": "boolean expressions, if statements, and conditional logic",
    "iteration": "loops, while loops, for loops, and nested iteration",
    "writing-classes": "class design, constructors, methods, and encapsulation",
    "arrays": "one-dimensional arrays, array traversal, and array algorithms",
    "array-lists": "ArrayList class, methods, and traversal techniques",
    "2d-arrays": "two-dimensional arrays and array traversal algorithms",
    "inheritance": "inheritance, polymorphism, and abstract classes",
    "recursion": "recursive methods and recursive problem solving"
  },
  "statistics": {
    "exploring-data": "analyzing patterns and departures from patterns in univariate data",
    "modeling-dist": "normal distributions, sampling distributions, and probability patterns",
    "describing-relationships": "scatterplots, correlation, and linear regression",
    "sampling-experimentation": "planning and conducting surveys and experiments",
    "probability": "probability rules, conditional probability, and independence",
    "random-variables": "probability distributions and expected values",
    "sampling-dist": "sampling distributions and the Central Limit Theorem",
    "confidence-intervals": "constructing and interpreting confidence intervals",
    "hypothesis-testing": "conducting tests of significance and interpreting results"
  },
  "world-history": {
    "ancient": "developments in human society from prehistory to 600 BCE",
    "classical": "classical civilizations and empires from 600 BCE to 600 CE",
    "post-classical": "regional and interregional interactions from 600 to 1450",
    "early-modern": "global interactions and first global age from 1450 to 1750",
    "modern": "industrialization and global integration from 1750 to 1900",
    "contemporary": "accelerating global change from 1900 to the present"
  },
  "cs-principles": {
    "computing-systems": "computer systems, networks, and the internet",
    "programming": "program development and programming constructs",
    "algorithms": "algorithms, sequence, selection, iteration",
    "data": "data representation, storage, and analysis",
    "impact": "computing innovations and their societal impact"
  }
};

// Course-specific prompt generators
function generateCoursePrompt(course: CourseId, selectedUnits: string[]): string {
  const coursePrompts: Record<CourseId, string> = {
    "calc-ab": "You are an expert AP Calculus AB teacher creating authentic AP-style calculus questions that test mathematical concepts, analytical thinking, and problem-solving skills.",
    "cs-a": "You are an expert AP Computer Science A teacher creating authentic AP-style Java programming questions that test coding concepts, algorithmic thinking, and problem-solving skills.",
    "statistics": "You are an expert AP Statistics teacher creating authentic AP-style statistics questions that test statistical concepts, data analysis, and probabilistic reasoning.",
    "world-history": "You are an expert AP World History teacher creating authentic AP-style history questions that test historical knowledge, analysis of primary sources, and understanding of historical patterns.",
    "cs-principles": "You are an expert AP Computer Science Principles teacher creating authentic AP-style questions that test computational thinking, programming concepts, and understanding of computing's impact."
  };

  const unitDesc = selectedUnits
    .map(unit => unitDescriptions[course][unit])
    .filter(Boolean)
    .join("\n");

  return `${coursePrompts[course]}

You will be generating questions covering these specific topics:
${unitDesc}

Each question must be:
1. Appropriate for the AP ${course === "calc-ab" ? "Calculus AB" : 
                          course === "cs-a" ? "Computer Science A" :
                          course === "statistics" ? "Statistics" :
                          course === "world-history" ? "World History" :
                          "Computer Science Principles"} exam level
2. Clear and unambiguous
3. Challenging but solvable with the knowledge from these units
4. Written in a style consistent with actual AP exam questions`;
}

// Generate dynamic prompt based on user's natural language topic
function generateDynamicPrompt(
  topic: string,
  testType: string,
  questionCount: number,
  difficulty: string
): string {
  const basePrompt = `You are an expert AP teacher with deep knowledge of ALL AP subjects. Based on the user's request below, you need to:

1. **IDENTIFY THE SUBJECT**: Analyze the topic to determine which AP subject this relates to (e.g., AP Biology, AP Chemistry, AP Physics, AP Calculus, AP Statistics, AP Computer Science A, AP World History, AP US History, AP English Literature, AP Psychology, AP Environmental Science, etc.)

2. **CREATE APPROPRIATE QUESTIONS**: Generate ${questionCount} high-quality ${testType.toUpperCase()} question(s) at ${difficulty} difficulty level that match the identified subject and specific topic.

**USER'S REQUEST**: "${topic}"

**IMPORTANT REQUIREMENTS**:
- Create UNIQUE questions that are different from typical examples
- Vary the contexts, problem setups, and examples to ensure originality
- Use proper notation for the subject (LaTeX for math/science, code blocks for programming, etc.)
- Make questions appropriate for AP exam level
- Ensure questions test deep understanding, not just memorization

**NOTATION GUIDELINES**:
- **Math/Science subjects**: Use LaTeX with \\( ... \\) for inline and \\[ ... \\] for display math
- **Programming subjects**: Use proper syntax highlighting with \`\`\`language blocks
- **History/Literature**: Include specific dates, names, locations, and proper citations
- **All subjects**: Use clear, precise academic language

${testType === "mcq" ? `
**MCQ FORMAT** - Each question must be in this EXACT JSON format (include ALL fields):
{
  "content": "The question text with proper notation",
  "type": "mcq",
  "subject": "Biology",
  "difficulty": "Medium",
  "options": [
    {"label": "A", "text": "First option"},
    {"label": "B", "text": "Second option"},
    {"label": "C", "text": "Third option"},
    {"label": "D", "text": "Fourth option"}
  ],
  "correctAnswer": "A",
  "explanation": "Detailed explanation of why the correct answer is right and others are wrong"
}

CRITICAL: You MUST include the "subject" field with the course name (Biology, Chemistry, Physics, Psychology, etc.) and "difficulty" field with Easy, Medium, or Hard.` : testType === "frq" ? `
**FRQ FORMAT** - Each question must be in this EXACT JSON format (include ALL fields):
{
  "content": "Multi-part question text with proper notation",
  "type": "frq",
  "subject": "Biology",
  "difficulty": "Hard",
  "rubric": {
    "points": 6,
    "criteria": [
      "Part (a): 2 points - Description of what earns points",
      "Part (b): 4 points - Description of what earns points"
    ]
  },
  "sampleResponse": "Detailed sample response showing full-point answer"
}

CRITICAL: You MUST include the "subject" field with the course name (Biology, Chemistry, Physics, Psychology, etc.) and "difficulty" field with Easy, Medium, or Hard.` : `
**MIXED FORMAT** - Return array of ${questionCount} questions mixing MCQ and FRQ as appropriate.
`}

**RESPONSE FORMAT**: Your response must be a valid JSON array containing exactly ${questionCount} question object(s). Do not include any text before or after the JSON array.

**EXAMPLES OF SUBJECT DETECTION**:
- "Generate an AP Biology question about photosynthesis" → AP Biology
- "Create a calculus problem about derivatives" → AP Calculus AB/BC  
- "Make a chemistry question about molecular bonding" → AP Chemistry
- "Java programming question about arrays" → AP Computer Science A
- "Statistics problem about normal distribution" → AP Statistics
- "World War II question" → AP World History or AP US History
- "Poetry analysis question" → AP English Literature
- "Psychology question about memory" → AP Psychology
- "Environmental science question about ecosystems" → AP Environmental Science

Now analyze the user's request and create the appropriate question(s).

REMEMBER: Every question object MUST include both "subject" and "difficulty" fields or the response will be rejected!`;

  return basePrompt;
}

// Legacy function - kept for backwards compatibility but not used in new AI approach
function generatePrompt(
  course: CourseId,
  testType: string,
  questionCount: number,
  difficulty: string,
  selectedUnits: string[]
): string {
  const coursePrompt = generateCoursePrompt(course, selectedUnits);

  const basePrompt = `${coursePrompt}

Generate ${questionCount} high-quality ${testType.toUpperCase()} questions at ${difficulty} difficulty level.

IMPORTANT: Create UNIQUE questions that are different from typical examples. Vary the mathematical expressions, contexts, and problem setups to ensure originality.

Use proper notation:
${course === "calc-ab" ? `- For math expressions, use LaTeX with \\( ... \\) for inline and \\[ ... \\] for display math
- Use proper LaTeX for fractions (\\frac{num}{den}), integrals (\\int), derivatives (\\frac{d}{dx}), etc.` :
course === "cs-a" ? `- For Java code, use proper syntax highlighting and indentation
- Include necessary import statements when relevant` :
course === "statistics" ? `- For statistical notation, use proper LaTeX notation
- For statistical formulas, use \\bar{x} for sample mean, s for sample standard deviation, etc.` :
`- Use clear, concise language
- Reference specific historical periods, events, or concepts accurately`}`;

  if (testType === "mcq") {
    return `${basePrompt}

REQUIRED FORMAT FOR MCQ QUESTIONS:
Your entire response MUST be a single JSON array containing ${questionCount} question objects.
Each question object must follow this format:
{
  "content": "The question text with proper notation as specified above",
  "type": "mcq",
  "options": [
    {"label": "A", "text": "Option A text"},
    {"label": "B", "text": "Option B text"},
    {"label": "C", "text": "Option C text"},
    {"label": "D", "text": "Option D text"}
  ],
  "correctAnswer": "X" // ONLY the letter (A, B, C, or D) of the correct option
}

Example for ${course}:
${course === "calc-ab" ? 
`{
  "content": "Find the derivative of \\(f(x) = x^2\\sin(x)\\) at \\(x = \\pi\\).",
  "type": "mcq",
  "options": [
    {"label": "A", "text": "\\(-\\pi^2\\)"},
    {"label": "B", "text": "\\(2\\pi\\)"},
    {"label": "C", "text": "\\(2\\pi\\sin(\\pi) + \\pi^2\\cos(\\pi)\\)"},
    {"label": "D", "text": "\\(0\\)"}
  ],
  "correctAnswer": "D"
}` :
course === "cs-a" ? 
`{
  "content": "What is the output of the following code?\n\`\`\`java\nArrayList<Integer> nums = new ArrayList<>();\nnums.add(1);\nnums.add(0, 2);\nSystem.out.println(nums);\`\`\`",
  "type": "mcq",
  "options": [
    {"label": "A", "text": "[1, 2]"},
    {"label": "B", "text": "[2, 1]"},
    {"label": "C", "text": "[2]"},
    {"label": "D", "text": "[1]"}
  ],
  "correctAnswer": "B"
}` :
course === "statistics" ?
`{
  "content": "A normal distribution has \\(\\mu = 70\\) and \\(\\sigma = 5\\). What percentage of the data falls between 65 and 75?",
  "type": "mcq",
  "options": [
    {"label": "A", "text": "34%"},
    {"label": "B", "text": "68%"},
    {"label": "C", "text": "95%"},
    {"label": "D", "text": "99.7%"}
  ],
  "correctAnswer": "B"
}` :
`{
  "content": "Which development most directly led to the start of the Industrial Revolution in Britain?",
  "type": "mcq",
  "options": [
    {"label": "A", "text": "The enclosure movement"},
    {"label": "B", "text": "The French Revolution"},
    {"label": "C", "text": "The Renaissance"},
    {"label": "D", "text": "The Crusades"}
  ],
  "correctAnswer": "A"
}`}

Generate ${questionCount} MCQ questions following this exact format. Do NOT include any text outside the main JSON array.`;
  } else if (testType === "frq") {
    return `${basePrompt}

REQUIRED FORMAT FOR FRQ QUESTIONS:
Your entire response MUST be a single JSON array containing ${questionCount} question objects.
Each question object must follow this format:
{
  "content": "The question text with proper notation as specified above",
  "type": "frq",
  "rubric": {
    "points": Number,
    "criteria": [
      "Part (a): [point value] - Description of criteria",
      "Part (b): [point value] - Description of criteria",
      // ... more parts as needed
    ]
  },
  "sampleResponse": "A detailed sample response demonstrating a full-point answer"
}

Example for ${course}:
${course === "calc-ab" ? 
`{
  "content": "Consider the function \\(f(x) = x^3e^{-x}\\).\n\n(a) Find all critical points of \\(f\\).\n\n(b) Use the first derivative test to classify each critical point as a local maximum, local minimum, or neither.\n\n(c) Find the absolute maximum and minimum values of \\(f\\) on the interval \\([0,4]\\).",
  "type": "frq",
  "rubric": {
    "points": 9,
    "criteria": [
      "Part (a): 3 points - Correct derivative formula (1), Setting f'(x)=0 (1), Finding critical points (1)",
      "Part (b): 3 points - Evaluating f' around each point (1), Correct classification (2)",
      "Part (c): 3 points - Evaluating endpoints (1), Comparing with critical points (1), Correct absolute extrema (1)"
    ]
  },
  "sampleResponse": "(a) \\(f'(x) = e^{-x}(3x^2 - x^3)\\). Set \\(f'(x) = 0\\): \\(e^{-x}(3x^2 - x^3) = 0\\). Since \\(e^{-x} \\neq 0\\), solve \\(3x^2 - x^3 = 0\\): \\(x^2(3-x) = 0\\), so \\(x = 0\\) or \\(x = 3\\).\n\n(b) For \\(x = 0\\): \\(f'\\) changes from positive to negative, so local maximum.\nFor \\(x = 3\\): \\(f'\\) changes from negative to positive, so local minimum.\n\n(c) Compare \\(f(0) = 0\\), \\(f(3) \\approx 1.48\\), \\(f(4) \\approx 1.47\\). Absolute maximum at \\(x = 3\\), absolute minimum at \\(x = 0\\)."
}` :
course === "cs-a" ? 
`{
  "content": "Consider the following incomplete implementation of a method that finds the longest sequence of consecutive integers in an array.\n\n\`\`\`java\npublic class ArraySequence {\n    /** Returns the length of the longest sequence of consecutive integers in arr\n     *  Precondition: arr.length > 0\n     */\n    public static int longestSequence(int[] arr) {\n        // implementation needed\n    }\n}\`\`\`\n\n(a) Write a solution for the longestSequence method that returns the length of the longest sequence of consecutive integers in arr. For example:\n- If arr is [3, 4, 5, 1, 2], return 3 (sequence: 3, 4, 5)\n- If arr is [1, 3, 5, 7], return 1 (no consecutive integers)\n- If arr is [2, 3, 4, 4, 5], return 4 (sequence: 2, 3, 4, 5)\n\n(b) What is the time complexity of your solution? Justify your answer.",
  "type": "frq",
  "rubric": {
    "points": 9,
    "criteria": [
      "Part (a): 7 points - Correct algorithm (2), Proper array traversal (2), Tracking current/max sequence (2), Edge cases (1)",
      "Part (b): 2 points - Correct time complexity (1), Valid justification (1)"
    ]
  },
  "sampleResponse": "(a) \`\`\`java\npublic static int longestSequence(int[] arr) {\n    if (arr.length == 0) return 0;\n    Arrays.sort(arr);\n    int maxLen = 1;\n    int currLen = 1;\n    \n    for (int i = 1; i < arr.length; i++) {\n        if (arr[i] == arr[i-1] + 1) {\n            currLen++;\n            maxLen = Math.max(maxLen, currLen);\n        } else if (arr[i] != arr[i-1]) {\n            currLen = 1;\n        }\n    }\n    return maxLen;\n}\`\`\`\n\n(b) The time complexity is O(n log n) due to the initial sorting. The subsequent array traversal is O(n), but the sorting dominates the time complexity. The space complexity is O(1) as we only use a few variables."
}` :
course === "statistics" ?
`{
  "content": "A researcher is studying the relationship between study time (in hours) and test scores (out of 100) for a group of students. The data is summarized below:\n\n\\[\\begin{array}{|c|c|c|c|c|}\n\\hline\nn = 25 & \\bar{x} = 3.2 & s_x = 1.1 & \\bar{y} = 82.5 & s_y = 8.4 \\\\\n\\hline\n\\end{array}\\]\n\nThe correlation coefficient is \\(r = 0.75\\).\n\n(a) Calculate and interpret the slope of the least squares regression line.\n\n(b) Calculate the coefficient of determination and explain what it means in context.\n\n(c) A student studies for 4 hours. Calculate and interpret a 95% confidence interval for the mean test score for all students who study for 4 hours.",
  "type": "frq",
  "rubric": {
    "points": 9,
    "criteria": [
      "Part (a): 3 points - Correct slope calculation (1), Units included (1), Contextual interpretation (1)",
      "Part (b): 3 points - Correct r² calculation (1), Correct percentage (1), Contextual interpretation (1)",
      "Part (c): 3 points - Correct formula use (1), Accurate computation (1), Proper interpretation (1)"
    ]
  },
  "sampleResponse": "(a) Slope = r(s_y/s_x) = 0.75(8.4/1.1) = 5.73. For each additional hour of study time, the predicted test score increases by 5.73 points.\n\n(b) r² = 0.75² = 0.5625 or 56.25%. About 56.25% of the variation in test scores can be explained by the linear relationship with study time.\n\n(c) ŷ = 82.5 + 5.73(4 - 3.2) = 87.08. The 95% CI formula uses SE = ... [calculation]. The interval is [84.2, 89.9]. We can be 95% confident that the mean test score for all students who study 4 hours is between 84.2 and 89.9 points."
}` :
course === "cs-principles" ?
`{
  "content": "Consider a social media application that allows users to share photos and connect with friends.\n\n(a) Describe two different data abstraction techniques the application could use to represent a user's friend network. Compare the advantages and disadvantages of each approach.\n\n(b) The application needs to determine if two users are 'mutually connected' (they are both in each other's friend lists). Write an algorithm in pseudocode that determines if two users are mutually connected.\n\n(c) Discuss one potential privacy concern with this friend network system and propose a technical solution to address it.",
  "type": "frq",
  "rubric": {
    "points": 9,
    "criteria": [
      "Part (a): 3 points - Two valid abstractions (1), Advantages for each (1), Disadvantages for each (1)",
      "Part (b): 3 points - Correct algorithm logic (2), Efficient implementation (1)",
      "Part (c): 3 points - Valid privacy concern (1), Technical solution (1), Implementation feasibility (1)"
    ]
  },
  "sampleResponse": "(a) Approach 1: Adjacency Matrix - Advantages: O(1) lookup time, simple to implement; Disadvantages: O(n²) space complexity, inefficient for sparse networks.\nApproach 2: Adjacency List - Advantages: Space efficient for sparse networks, easy to add/remove connections; Disadvantages: O(n) lookup time, more complex implementation.\n\n(b) Algorithm checkMutualConnection(user1, user2):\n    1. if user2 not in user1.friendList:\n    2.     return false\n    3. if user1 not in user2.friendList:\n    4.     return false\n    5. return true\n\n(c) Privacy Concern: Friend lists could be scraped to build user profiles for targeted advertising.\nSolution: Implement granular privacy settings allowing users to control visibility of their connections, using encryption for friend list storage and implementing rate limiting on API requests to prevent mass data collection."
}` :
`{
  "content": "Analyze the causes and consequences of the Industrial Revolution in Britain (1750-1850).\n\n(a) Identify and explain TWO technological innovations that contributed to industrialization in Britain during this period.\n\n(b) Analyze TWO social consequences of industrialization on British society.\n\n(c) Compare the process of industrialization in Britain with ONE other European country during this period.",
  "type": "frq",
  "rubric": {
    "points": 9,
    "criteria": [
      "Part (a): 3 points - Two valid innovations (1), Detailed explanation of each (2)",
      "Part (b): 3 points - Two social impacts (1), Analysis with specific evidence (2)",
      "Part (c): 3 points - Valid comparison (1), Specific evidence (1), Analysis of differences (1)"
    ]
  },
  "sampleResponse": "(a) 1. Steam Engine: Watt's improvements enabled efficient power generation, transforming manufacturing and transportation.\n2. Spinning Jenny: Hargreaves' invention increased textile production efficiency, revolutionizing the cotton industry.\n\n(b) 1. Urbanization: Mass migration to cities led to overcrowded housing, poor sanitation, and new social problems.\n2. Class Structure: Emergence of industrial working class and new middle class of factory owners reshaped social hierarchy.\n\n(c) France industrialized more slowly due to political instability and less access to coal. While Britain had early railway development by 1830, France's railway expansion came later. British industrialization was more organic, while French industrialization had more state involvement."
}`}

Generate ${questionCount} FRQ questions following this exact format. Each question should:
1. Be divided into clear parts (a), (b), (c) etc.
2. Include a detailed rubric with point allocations
3. Provide a comprehensive sample response
4. Use appropriate notation and terminology for ${course === "calc-ab" ? "calculus" : 
                                               course === "cs-a" ? "Java programming" :
                                               course === "statistics" ? "statistics" :
                                               course === "world-history" ? "historical analysis" :
                                               "computer science"}
5. Test multiple concepts within the selected units
6. Require analysis and problem-solving skills

Do NOT include any text outside the main JSON array.`;
  } else if (testType === "full") {
    // For full tests, generate both MCQ and FRQ questions
    const mcqCount = Math.ceil(questionCount * 0.7); // 70% MCQ
    const frqCount = Math.floor(questionCount * 0.3); // 30% FRQ
    
    return `${basePrompt}

You will generate a full AP-style test with:
- ${mcqCount} multiple-choice questions
- ${frqCount} free-response questions

Follow the MCQ and FRQ formats specified above for each question type.
Combine all questions into a single JSON array, with MCQs first followed by FRQs.

Do NOT include any text outside the main JSON array.`;
  }

  return basePrompt;
}

export async function POST(req: Request) {
  try {
    const { topic, testType = "mcq", questionCount = 1, difficulty = "intermediate" } = await req.json();
    
    // Validate inputs
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const prompt = generateDynamicPrompt(topic.trim(), testType, questionCount, difficulty);
    
    console.log('📝 Generated Prompt (first 500 chars):', prompt.substring(0, 500));

    // Call OpenAI API to generate questions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert AP teacher. Your task is to create authentic AP-style questions following strict format requirements. Your entire response must be valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    });

    const rawContent = completion.choices[0]?.message?.content || "";
    console.log("--- Raw AI Response ---");
    console.log(rawContent);
    console.log("--- End Raw AI Response ---");

    let jsonStrToParse = ""; // Variable to hold the string we attempt to parse

    try {
      // Attempt to extract JSON array, handling potential surrounding text
      const match = rawContent.match(/(\[\s*\{[\s\S]*\}\s*\])/);
      if (match && match[0]) {
        jsonStrToParse = match[0];
        console.log("--- Extracted JSON Array String ---");
        console.log(jsonStrToParse);
        console.log("--- End Extracted JSON Array String ---");
      } else {
        // If no array found, maybe the AI returned a single object or malformed text
        console.log("--- No JSON Array Match Found, Attempting to use Raw Content ---");
        // We might still try parsing rawContent if it looks like JSON, but expect an array
        jsonStrToParse = rawContent.trim(); // Use trimmed raw content as fallback
      }

      // Fix LaTeX expressions that break JSON parsing
      // Replace single backslashes with double backslashes for proper JSON escaping
      jsonStrToParse = jsonStrToParse
        .replace(/\\(?!["\\/bfnrt])/g, '\\\\') // Escape single backslashes that aren't already valid JSON escapes
        .replace(/\\\\\\\\/g, '\\\\'); // Fix any double-escaped backslashes

      console.log("--- Fixed JSON String ---");
      console.log(jsonStrToParse);
      console.log("--- End Fixed JSON String ---");

      // --- PARSING STEP ---
      const parsedData = JSON.parse(jsonStrToParse);

      // --- VALIDATION STEP ---
      // Ensure the parsed data is an array
      if (!Array.isArray(parsedData)) {
        console.error("Parsed data is not an array:", parsedData);
        throw new Error("AI response was not a valid JSON array.");
      }

      // --- FORMATTING STEP (Iterate through the validated array) ---
      const formattedQuestions = parsedData.map((q: any, index: number) => {
        const questionType = q.type || testType; // Infer type if missing

        // Basic structure validation and defaults
        const baseQuestion = {
          id: index,
          type: questionType,
          content: q.content || `Error: Content missing for question ${index + 1}`,
          subject: q.subject || "Unknown Subject", // Extract subject from AI response
          difficulty: q.difficulty || "Medium", // Extract difficulty from AI response
          options: questionType === "mcq" ? (q.options || []) : [],
          rubric: questionType === "frq" ? (q.rubric || {}) : {},
          documents: q.documents || [], // Assuming documents might be relevant later
          sampleResponse: q.sampleResponse || undefined, // For FRQ
        };

        // MCQ Specific Formatting & Validation
        if (questionType === "mcq") {
          let cleanCorrectAnswer: string | undefined = undefined;
          if (q.correctAnswer) {
            const rawAnswer = String(q.correctAnswer).trim().toUpperCase();
            // Strict check for single letter A, B, C, or D
            if (/^[A-D]$/.test(rawAnswer)) {
              cleanCorrectAnswer = rawAnswer;
            } else {
              console.warn(`Invalid correctAnswer format for MCQ ${index}: '${q.correctAnswer}'. Setting to undefined.`);
            }
          } else {
             console.warn(`Missing correctAnswer for MCQ ${index}. Setting to undefined.`);
          }

          // Ensure options is an array of objects with label/text
          const validOptions = Array.isArray(baseQuestion.options)
             ? baseQuestion.options.filter(opt => typeof opt === 'object' && opt !== null && 'label' in opt && 'text' in opt)
             : [];
          if (validOptions.length !== baseQuestion.options.length || validOptions.length === 0) {
             console.warn(`Invalid or missing options structure for MCQ ${index}.`);
          }


          return {
            ...baseQuestion,
            options: validOptions, // Use validated/filtered options
            correctAnswer: cleanCorrectAnswer,
          };
        }

        // FRQ Specific Formatting (can add more validation later if needed)
        if (questionType === "frq") {
           // Ensure rubric has points and criteria array
           if (typeof baseQuestion.rubric !== 'object' || baseQuestion.rubric === null || !baseQuestion.rubric.points || !Array.isArray(baseQuestion.rubric.criteria)) {
              console.warn(`Invalid or missing rubric structure for FRQ ${index}.`);
              baseQuestion.rubric = { points: 0, criteria: ["Rubric not available"] }; // Provide fallback
           }
          return baseQuestion;
        }

        // Fallback for unknown types
        console.warn(`Unknown question type encountered: ${questionType} for question ${index}`);
        return { ...baseQuestion, content: `Error: Unknown question type '${questionType}'` };
      });

      console.log("--- Formatted Questions Sent to Frontend ---");
      console.log(JSON.stringify(formattedQuestions, null, 2));
      console.log("--- End Formatted Questions ---");

      return NextResponse.json({ questions: formattedQuestions });

    } catch (parseError) {
      console.error("--- PARSING FAILED ---");
      console.error("Error parsing AI response JSON:", parseError);
      // Log the string that failed to parse
      console.error("Problematic JSON String:", jsonStrToParse);
      console.error("--- END PARSING FAILURE INFO ---");
      return NextResponse.json(
        { error: "Failed to parse AI response. The AI did not return valid JSON." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in /api/generate-questions:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate questions due to an internal error." }, { status: 500 });
  }
} 