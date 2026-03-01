/**
 * Specialized handling for Free Response Questions (FRQ)
 * Keeps MCQ grading system intact by providing a parallel process
 */

import { Question } from "@/components/test-interface";

export interface FRQGradingCriteria {
  points: number;
  criteria: string[];
  keywords?: string[];
}

/**
 * Grade FRQ responses using rubric-based evaluation
 * @param question The FRQ question with user response
 * @param userAnswer The user's text response
 * @returns Graded response with score and feedback
 */
export async function gradeFRQResponse(
  question: Question, 
  userAnswer: { text: string | null }
): Promise<{
  score: number;
  feedback: string;
  isCorrect: boolean;
}> {
  // Default response for empty answers
  if (!userAnswer?.text) {
    return {
      score: 0,
      feedback: "No answer was provided.",
      isCorrect: false
    };
  }
  
  try {
    // For local development/testing - implement basic keyword matching
    // In production, this would call an API for AI evaluation
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      return performLocalFRQGrading(question, userAnswer.text);
    }
    
    // Call the FRQ-specific grading endpoint
    const response = await fetch("/api/grade-frq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        userAnswer: userAnswer.text,
      }),
      signal: AbortSignal.timeout(15000) // 15 second timeout for FRQ grading
    });
    
    if (!response.ok) {
      throw new Error(`FRQ grading API error: ${response.status}`);
    }
    
    const gradingData = await response.json();
    
    return {
      score: gradingData.score,
      feedback: gradingData.feedback,
      isCorrect: gradingData.score > 0 // Any points means partially correct at minimum
    };
  } catch (error) {
    console.error("Error during FRQ grading:", error);
    
    // Fallback to local grading if API fails
    return performLocalFRQGrading(question, userAnswer.text);
  }
}

/**
 * Simple local grading for FRQ questions when API is unavailable
 */
function performLocalFRQGrading(question: Question, userText: string): {
  score: number;
  feedback: string;
  isCorrect: boolean;
} {
  // Default rubric if none exists on the question
  const rubric = question.rubric || {
    points: 3,
    criteria: ["Complete answer", "Correct reasoning", "Proper terminology"]
  };
  
  // Simple keyword matching for local grading
  const totalPoints = rubric.points || 3;
  let score = 0;
  let feedbackItems: string[] = [];
  
  // Extract keywords from the question/sample response if available
  const keywords = [
    ...(question.content.match(/\b\w{5,}\b/g) || []),
    ...(question.sampleResponse?.match(/\b\w{5,}\b/g) || [])
  ];
  
  // Count matching keywords
  const uniqueKeywords = [...new Set(keywords.map(k => k.toLowerCase()))];
  const userTextLower = userText.toLowerCase();
  
  let matchedKeywords = 0;
  uniqueKeywords.forEach(keyword => {
    if (userTextLower.includes(keyword)) matchedKeywords++;
  });
  
  // Calculate score based on keyword matches and answer length
  const keywordScore = Math.min(totalPoints, Math.floor((matchedKeywords / Math.max(5, uniqueKeywords.length / 3)) * totalPoints));
  const lengthScore = userText.length > 100 ? Math.min(1, totalPoints - keywordScore) : 0;
  
  score = keywordScore + lengthScore;
  
  // Generate feedback
  if (score === totalPoints) {
    feedbackItems.push("Your answer addresses all key points in the rubric.");
  } else if (score > 0) {
    feedbackItems.push("Your answer addresses some key concepts but could be more comprehensive.");
    if (userText.length < 100) {
      feedbackItems.push("Consider providing a more detailed explanation.");
    }
  } else {
    feedbackItems.push("Your answer doesn't address the key concepts required by the rubric.");
    feedbackItems.push("Review the course material and provide a more comprehensive response.");
  }
  
  return {
    score,
    feedback: feedbackItems.join(" "),
    isCorrect: score > 0
  };
} 