// Add this function to ensure each question has a valid correct answer
export async function generateQuestions(topic: string, difficulty: string, count: number) {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        difficulty,
        count
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate questions");
    }

    const data = await response.json();
    
    // Validate and normalize each question to ensure correct answers are properly formatted
    return data.questions.map(question => {
      // For MCQs, ensure the correctAnswer property exists and is properly formatted
      if (question.type === "mcq") {
        // Verify options exist
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          throw new Error(`Question is missing valid options: ${question.content}`);
        }
        
        // Ensure correctAnswer exists and is one of the option labels
        if (!question.correctAnswer || 
            !question.options.some(opt => String(opt.label) === String(question.correctAnswer))) {
          console.error("Question has invalid correctAnswer:", question);
          // Set first option as default if no valid correctAnswer
          question.correctAnswer = question.options[0].label;
        }
        
        // Normalize correctAnswer to string to avoid type comparison issues
        question.correctAnswer = String(question.correctAnswer);
      }
      
      return question;
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
} 