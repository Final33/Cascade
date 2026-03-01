import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface GradeTestRequest {
  questions: any[];
  userAnswers: any[];
  testType: string;
  difficulty: string;
  selectedUnits: string[];
  locallyGradedQuestions?: any[];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { questions, userAnswers, locallyGradedQuestions, testType, difficulty, selectedUnits } = body;
    
    // Enhanced validation
    if (!questions || !Array.isArray(questions) || !userAnswers) {
      return NextResponse.json(
        { error: 'Invalid request format. Questions and userAnswers are required.' }, 
        { status: 400 }
      );
    }
    
    // Validate each question has minimum required fields
    const invalidQuestions = questions.filter(q => !q.content || !q.type);
    if (invalidQuestions.length > 0) {
      console.warn("Found invalid questions:", invalidQuestions);
      return NextResponse.json(
        { error: `${invalidQuestions.length} questions have missing required fields.` },
        { status: 400 }
      );
    }
    
    // Use locally graded questions for correctness but generate explanations
    const gradingPromises = questions.map((question, idx) => {
      const userAnswer = userAnswers[idx];
      const locallyGradedQ = locallyGradedQuestions?.[idx];
       
      // Normalize both values for comparison to prevent type/format mismatches
      const isCorrect = question.type === "mcq" ? 
        // Only mark correct if:
        // 1. User provided an answer
        // 2. User's selected answer exactly matches the correct answer (after normalization)
        // 3. The question has a valid correctAnswer property
        userAnswer?.selected !== undefined && 
        question.correctAnswer !== undefined &&
        String(userAnswer.selected).trim().toUpperCase() === String(question.correctAnswer).trim().toUpperCase() : 
        false;
      
      if (!userAnswer) {
        return {
          ...question,
          userAnswer: { selected: null }, // Ensure userAnswer is an object with selected property
          isCorrect: false,
          explanation: "No answer was provided.",
          feedback: "You did not provide an answer to this question."
        };
      }
      
      // Store debug information for troubleshooting
      console.log(`Question ${idx} evaluation:`, {
        questionType: question.type,
        userSelected: userAnswer?.selected,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
      
      switch (question.type) {
        case "mcq":
          return generateMCQExplanation(question, userAnswer, isCorrect);
        case "free-response":
        case "frq":
          return gradeFreeResponse(question, userAnswer);
        case "document-based":
          return gradeDocumentBased(question, userAnswer);
        default:
          return {
            ...question,
            userAnswer,
            isCorrect,
            explanation: "This question type cannot be automatically graded.",
            feedback: "This question type cannot be automatically graded."
          };
      }
    });
    
    try {
      const gradedQuestions = await Promise.all(gradingPromises);
      
      // Calculate total score
      let score = 0;
      gradedQuestions.forEach(q => {
        if (q.isCorrect) score++;
      });
      
      return NextResponse.json({
        gradedQuestions,
        score
      });
    } catch (error) {
      console.error("Error during grading:", error);
      return NextResponse.json(
        { error: 'Error processing questions' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// New function specifically for MCQ explanation generation
async function generateMCQExplanation(question, userAnswer, isCorrect) {
  // Get the correct option text and user selected text
  const correctLabel = String(question.correctAnswer || "").trim();
  const userSelected = String(userAnswer?.selected || "").trim();
  
  // Log the comparison data for debugging
  console.log('MCQ Comparison:', {
    correctLabel,
    userSelected,
    areEqual: correctLabel.toUpperCase() === userSelected.toUpperCase(),
    isCorrect
  });
  
  let correctOptionText = "Unknown option";
  let userSelectedText = "No selection made";
  
  if (question.options && Array.isArray(question.options)) {
    // Find correct option by comparing normalized labels
    const correctOption = question.options.find((opt) => 
      String(opt.label).trim().toUpperCase() === correctLabel.toUpperCase()
    );
    
    if (correctOption) {
      correctOptionText = correctOption.text || "Unknown option";
    }
    
    if (userAnswer?.selected) {
      // Find user's selected option by comparing normalized labels
      const userOption = question.options.find((opt) => 
        String(opt.label).trim().toUpperCase() === userSelected.toUpperCase()
      );
      
      if (userOption) {
        userSelectedText = userOption.text || "Unknown option";
      }
    }
  }
  
  try {
    // Generate explanation with AI
    const prompt = `
As an AP Calculus expert, analyze this multiple-choice question and explain the correct answer.

QUESTION:
${question.content}

ANSWER OPTIONS:
${question.options?.map((opt) => `${opt.label}. ${opt.text}`).join('\n') || 'No options provided'}

CORRECT ANSWER: ${correctLabel}. ${correctOptionText}

STUDENT ANSWER: ${userAnswer?.selected || 'No answer'}: ${userSelectedText}

The student's answer is ${isCorrect ? 'CORRECT' : 'INCORRECT'}.

You MUST acknowledge that ${correctLabel} is the correct answer.
If the student selected ${userAnswer?.selected}, this is ${isCorrect ? 'CORRECT' : 'INCORRECT'}.

Provide a detailed explanation of why ${correctLabel} is the correct answer and the mathematical concepts involved.
Format your response as a JSON object with just one field:
{
  "explanation": "Detailed explanation of the correct answer and the concepts tested"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AP Calculus examination grader. Provide clear explanations of multiple choice questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || "{}";
    
    try {
      const parsedContent = JSON.parse(content);
      
      return {
        ...question,
        userAnswer,
        isCorrect, // Use the passed-in isCorrect value
        explanation: parsedContent.explanation || `The correct answer is ${correctLabel}: ${correctOptionText}.`,
      };
    } catch (error) {
      console.error("Error parsing AI response:", error, content);
      return {
        ...question,
        userAnswer,
        isCorrect, // Use the passed-in isCorrect value
        explanation: `The correct answer is ${correctLabel}: ${correctOptionText}.`,
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // Fallback without AI
    return {
      ...question,
      userAnswer,
      isCorrect, // Use the passed-in isCorrect value
      explanation: `The correct answer is ${correctLabel}: ${correctOptionText}.`,
    };
  }
}

// Grade free response questions with AI
async function gradeFreeResponse(question: any, userAnswer: any) {
  if (!userAnswer?.text || userAnswer.text.trim() === "") {
    return {
      ...question,
      userAnswer,
      isCorrect: false,
      explanation: "No answer was provided.",
      feedback: "You did not provide an answer to this question."
    };
  }
  
  const prompt = `
As an AP Calculus expert, grade this free response question and provide feedback.

QUESTION:
${question.content}

RUBRIC:
${question.rubric ? JSON.stringify(question.rubric, null, 2) : "No rubric provided"}

STUDENT ANSWER:
${userAnswer.text}

Evaluate the student's response and provide:
1. A determination if the answer is correct (fully or partially)
2. A score out of the total points
3. A detailed explanation of the correct approach
4. Specific feedback on the student's work

Format your response as a JSON object:
{
  "isCorrect": boolean,
  "score": number,
  "totalPoints": number,
  "explanation": "Detailed explanation of the correct approach",
  "feedback": "Specific feedback on the student's work"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are an AP Calculus examination grader. Evaluate free response questions fairly and provide constructive feedback."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  // Extract the JSON response
  const content = response.choices[0]?.message?.content || "";
  try {
    const gradingResult = JSON.parse(content);
    return {
      ...question,
      userAnswer,
      isCorrect: gradingResult.isCorrect,
      score: gradingResult.score,
      totalPoints: gradingResult.totalPoints,
      explanation: gradingResult.explanation,
      feedback: gradingResult.feedback
    };
  } catch (error) {
    console.error("Error parsing AI grading response:", error);
    return {
      ...question,
      userAnswer,
      isCorrect: false,
      explanation: "An error occurred during grading",
      feedback: "Unable to properly evaluate this response"
    };
  }
}

// Grade document-based questions with AI
async function gradeDocumentBased(question: any, userAnswer: any) {
  if (!userAnswer?.text || userAnswer.text.trim() === "") {
    return {
      ...question,
      userAnswer,
      isCorrect: false,
      explanation: "No answer was provided.",
      feedback: "You did not provide an answer to this question."
    };
  }
  
  // Format the documents for the prompt
  const documentText = question.documents
    .map((doc: any, i: number) => `DOCUMENT ${i+1} - ${doc.title}:\n${doc.content}`)
    .join("\n\n");
  
  const prompt = `
As an AP Calculus expert, grade this document-based question and provide feedback.

QUESTION:
${question.content}

DOCUMENTS:
${documentText}

RUBRIC:
${question.rubric ? JSON.stringify(question.rubric, null, 2) : "No rubric provided"}

STUDENT ANSWER:
${userAnswer.text}

Evaluate the student's response and provide:
1. A determination if the answer demonstrates understanding (fully or partially)
2. A score out of the total points
3. A detailed explanation of what a complete answer should include
4. Specific feedback on how well the student integrated and analyzed the documents

Format your response as a JSON object:
{
  "isCorrect": boolean,
  "score": number,
  "totalPoints": number,
  "explanation": "Detailed explanation of what a complete answer should cover",
  "feedback": "Specific feedback on the student's analysis and integration of documents"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are an AP Calculus examination grader. Evaluate document-based questions fairly and provide constructive feedback."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  // Extract the JSON response
  const content = response.choices[0]?.message?.content || "";
  try {
    const gradingResult = JSON.parse(content);
    return {
      ...question,
      userAnswer,
      isCorrect: gradingResult.isCorrect,
      score: gradingResult.score,
      totalPoints: gradingResult.totalPoints,
      explanation: gradingResult.explanation,
      feedback: gradingResult.feedback
    };
  } catch (error) {
    console.error("Error parsing AI grading response:", error);
    return {
      ...question,
      userAnswer,
      isCorrect: false,
      explanation: "An error occurred during grading",
      feedback: "Unable to properly evaluate this response"
    };
  }
}