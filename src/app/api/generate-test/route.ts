import { z } from "zod";
import { NextResponse } from 'next/server';

// Define the Zod schema for validation
const FRQRubricSchema = z.object({
  points: z.number().int().positive(),
  criteria: z.array(z.string()).min(1),
  recommendedLength: z.number().int().positive().optional(),
});

const FRQQuestionSchema = z.object({
  id: z.number().int(),
  type: z.literal("frq"),
  content: z.string().min(10), // Basic check for content length
  rubric: FRQRubricSchema,
  sampleResponse: z.string().optional(),
});

// Example for MCQ if you generate both
const MCQOptionSchema = z.object({ label: z.string(), text: z.string() });
const MCQQuestionSchema = z.object({
  id: z.number().int(),
  type: z.literal("mcq"),
  content: z.string().min(10),
  options: z.array(MCQOptionSchema).min(2),
  correctAnswer: z.string(),
  explanation: z.string().optional(), // Explanation might be added later
});

// Union schema for any question type
const QuestionSchema = z.union([MCQQuestionSchema, FRQQuestionSchema]);
const QuestionsArraySchema = z.array(QuestionSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { units, difficulty, count, testType } = body; // Get parameters

    // --- Call your AI generation function here ---
    // const aiResponseContent = await callMyAIGenerationFunction(prompt);
    let aiResponseContent = ""; // Placeholder for AI response string

    // --- Parsing and Validation ---
    let parsedQuestions;
    try {
      // Attempt to parse the raw string content from AI
      const rawParsed = JSON.parse(aiResponseContent);
      
      // Validate the parsed structure against the Zod schema
      const validationResult = QuestionsArraySchema.safeParse(rawParsed);

      if (!validationResult.success) {
        console.error("Zod Validation Error:", validationResult.error.errors);
        // Log the raw AI response for debugging
        console.error("Raw AI Response causing validation failure:", aiResponseContent);
        throw new Error(`AI response failed validation: ${validationResult.error.message}`);
      }
      
      parsedQuestions = validationResult.data;

    } catch (parseOrValidationError) {
      console.error("Failed to parse or validate AI response:", parseOrValidationError);
      // Return a specific error response
      return NextResponse.json(
        { error: "Failed to parse AI response into proper question format. Please try generating the test again." },
        { status: 500 }
      );
    }

    // --- Return the validated questions ---
    return NextResponse.json(parsedQuestions);

  } catch (error) {
    console.error("Error generating practice test:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating the test." },
      { status: 500 }
    );
  }
}

// Example prompt enhancement for FRQ generation:
const generateFRQPrompt = (units: string[], difficulty: string, count: number) => `
Generate ${count} AP Calculus FRQ (Free Response Questions) covering these units: ${units.join(', ')}.
The difficulty should be ${difficulty}.

For EACH question, provide the output STRICTLY in the following JSON format:
{
  "id": UniqueNumber, // Assign a unique number starting from 1
  "type": "frq",
  "content": "The question text, formatted potentially with LaTeX using single dollar signs for inline ($...$) and double for display ($$...$$). Ensure LaTeX is correctly formatted.",
  "rubric": {
    "points": Number, // Total points for the question (e.g., 9)
    "criteria": [ // An array of strings describing scoring criteria
      "Criterion 1 description (e.g., 'Correctly finds the derivative')",
      "Criterion 2 description (e.g., 'Applies the chain rule appropriately')",
      "Criterion 3 description (e.g., 'Provides correct final numerical answer')"
      // Add more criteria as appropriate for the points
    ],
    "recommendedLength": Number // Optional: Recommended response length in characters (e.g., 250)
  },
  "sampleResponse": "An optional, detailed sample response demonstrating a full-point answer, potentially using LaTeX."
}

Ensure the entire response is a single JSON array containing these question objects. Do NOT include any text outside this JSON array.
Example of a single question object in the array:
{
  "id": 1,
  "type": "frq",
  "content": "Let $f(x) = x^3 - 6x^2 + 5$. Find the intervals on which $f$ is concave up.",
  "rubric": {
    "points": 3,
    "criteria": [
      "Finds $f''(x)$ correctly.",
      "Sets $f''(x) = 0$ and finds potential inflection points.",
      "Determines the interval where $f''(x) > 0$."
    ],
    "recommendedLength": 150
  },
  "sampleResponse": "First, find the second derivative: $f'(x) = 3x^2 - 12x$, $f''(x) = 6x - 12$. Set $f''(x) = 0 \\implies 6x - 12 = 0 \\implies x = 2$. Test intervals: For $x < 2$, let $x=0$, $f''(0) = -12 < 0$ (concave down). For $x > 2$, let $x=3$, $f''(3) = 18 - 12 = 6 > 0$ (concave up). Thus, $f$ is concave up on $(2, \\infty)$."
}
`;

// --- When calling the AI ---
// Use a prompt like generateFRQPrompt(...)

// --- After receiving the AI response ---
// Implement robust parsing and validation (see step 2) 