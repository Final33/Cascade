import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question, responses, rubric } = await request.json();

    if (!question || !responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: question, responses' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create comprehensive grading prompt
    const gradingPrompt = `
You are an expert AP exam grader with extensive experience in evaluating Free Response Questions (FRQs). 
You will grade student responses with the same rigor and standards as official AP graders.

QUESTION DETAILS:
Subject: ${question.subject}
Unit: ${question.unit}
Topic: ${question.topic}
Difficulty: ${question.difficulty}
Total Points: ${question.totalPoints}
Time Limit: ${question.timeLimit} minutes

QUESTION CONTEXT:
${question.question}

PARTS TO GRADE:
${question.parts.map((part: any, index: number) => `
Part ${part.label} (${part.points} points):
${part.question}
Expected Length: ${part.expectedLength || 'medium'}
${part.hints ? `Hints Available: ${part.hints.join('; ')}` : ''}
`).join('\n')}

STUDENT RESPONSES:
${responses.map((response: any, index: number) => `
Part ${question.parts[index]?.label}: 
"${response.response || '[No response provided]'}"
Word Count: ${response.wordCount}
Time Spent: ${Math.floor(response.timeSpent / 60)}:${(response.timeSpent % 60).toString().padStart(2, '0')}
`).join('\n')}

${rubric ? `OFFICIAL RUBRIC:\n${rubric}` : ''}

GRADING INSTRUCTIONS:
1. Grade each part separately with detailed feedback
2. Award partial credit appropriately (0.5 point increments when justified)
3. Focus on mathematical/scientific accuracy, clear reasoning, and complete answers
4. Consider the expected response length and complexity
5. Provide specific, actionable feedback for improvement
6. Identify both strengths and areas for improvement
7. Use encouraging but honest language
8. Reference specific parts of the student's response

For each part, provide:
- Points earned out of total possible (use 0.5 increments when appropriate)
- Detailed explanation of scoring rationale
- Specific feedback on what was done well
- Specific areas for improvement
- Suggestions for better approaches if applicable

IMPORTANT FORMATTING REQUIREMENTS:
- Use ONLY the part label from the question (e.g., "(a)", "(b)", "(c)") - do NOT add "Part" prefix
- Keep feedback concise but thorough (2-3 sentences per section)
- Provide 2-3 specific strengths, improvements, and suggestions per part
- Use encouraging but honest language
- Include specific mathematical/technical details in feedback

Respond in the following JSON format (no additional text before or after):
{
  "totalScore": number,
  "maxScore": number,
  "percentage": number,
  "overallGrade": "string (A+, A, A-, B+, B, B-, C+, C, C-, D, F)",
  "gradingTime": "string (e.g., '2:30')",
  "parts": [
    {
      "partLabel": "string (ONLY the label like '(a)', '(b)', etc.)",
      "pointsEarned": number,
      "maxPoints": number,
      "feedback": "string (2-3 sentences explaining the score)",
      "strengths": ["string", "string", "string"],
      "improvements": ["string", "string", "string"],
      "suggestions": ["string", "string", "string"]
    }
  ],
  "overallFeedback": "string (3-4 sentences about overall performance)",
  "studyRecommendations": ["string", "string", "string"],
  "nextSteps": ["string", "string", "string"]
}

Be thorough, fair, and constructive in your grading. Remember that this is a learning opportunity for the student.
`;

    // Generate the grading response
    const result = await model.generateContent(gradingPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let gradingResult;
    try {
      // First try to parse the entire response as JSON
      try {
        gradingResult = JSON.parse(text);
      } catch {
        // If that fails, extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          gradingResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI grading response', details: text.substring(0, 500) + '...' },
        { status: 500 }
      );
    }

    // Validate and fix the response structure
    if (!gradingResult.totalScore && gradingResult.totalScore !== 0) {
      return NextResponse.json(
        { error: 'Invalid grading response structure', response: gradingResult },
        { status: 500 }
      );
    }

    // Ensure all required fields exist with defaults
    gradingResult.parts = gradingResult.parts || [];
    gradingResult.overallFeedback = gradingResult.overallFeedback || 'Grading completed successfully.';
    gradingResult.studyRecommendations = gradingResult.studyRecommendations || [];
    gradingResult.nextSteps = gradingResult.nextSteps || [];
    gradingResult.gradingTime = gradingResult.gradingTime || '2:30';

    // Ensure each part has all required fields
    gradingResult.parts = gradingResult.parts.map((part: any) => ({
      partLabel: part.partLabel || '(?)',
      pointsEarned: part.pointsEarned || 0,
      maxPoints: part.maxPoints || 1,
      feedback: part.feedback || 'No feedback provided.',
      strengths: part.strengths || [],
      improvements: part.improvements || [],
      suggestions: part.suggestions || []
    }));

    // Add metadata
    gradingResult.gradedAt = new Date().toISOString();
    gradingResult.model = 'gemini-1.5-flash';
    gradingResult.questionId = question.id;

    return NextResponse.json(gradingResult);

  } catch (error) {
    console.error('Error in FRQ grading:', error);
    return NextResponse.json(
      { error: 'Failed to grade FRQ', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
