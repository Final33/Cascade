# AI Grading System Setup

## Overview
The FRQ AI Grading System uses Google's Gemini 1.5 Flash model to provide comprehensive, rubric-based grading of Free Response Questions with detailed feedback.

## Environment Setup

### Required Environment Variable
Add the following to your `.env.local` file:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

### Getting a Google API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

## Features

### Comprehensive Grading
- **Part-by-part scoring** with detailed point breakdown
- **Rubric-based evaluation** following AP exam standards
- **Partial credit** awarded appropriately (0.5 point increments)
- **Overall grade** calculation (A+ through F scale)

### Detailed Feedback
- **Specific feedback** for each part of the response
- **Strengths identification** highlighting what was done well
- **Improvement areas** with actionable suggestions
- **Study recommendations** for continued learning
- **Next steps** for skill development

### Advanced Analysis
- **Response quality assessment** based on expected length and complexity
- **Mathematical/scientific accuracy** evaluation
- **Clear reasoning** and explanation assessment
- **Time efficiency** analysis
- **Word count** and response completeness tracking

## API Endpoint

### POST `/api/grade-frq`

**Request Body:**
```json
{
  "question": {
    "id": "string",
    "subject": "string",
    "unit": "string", 
    "topic": "string",
    "difficulty": "Easy|Medium|Hard",
    "totalPoints": "number",
    "timeLimit": "number",
    "question": "string",
    "parts": [
      {
        "id": "string",
        "label": "string",
        "question": "string", 
        "points": "number",
        "expectedLength": "short|medium|long",
        "hints": ["string"]
      }
    ],
    "rubric": "string (optional)"
  },
  "responses": [
    {
      "partId": "string",
      "response": "string",
      "timeSpent": "number",
      "wordCount": "number"
    }
  ]
}
```

**Response:**
```json
{
  "totalScore": "number",
  "maxScore": "number", 
  "percentage": "number",
  "overallGrade": "string",
  "gradingTime": "string",
  "parts": [
    {
      "partLabel": "string",
      "pointsEarned": "number",
      "maxPoints": "number",
      "feedback": "string",
      "strengths": ["string"],
      "improvements": ["string"],
      "suggestions": ["string"]
    }
  ],
  "overallFeedback": "string",
  "studyRecommendations": ["string"],
  "nextSteps": ["string"],
  "gradedAt": "string",
  "model": "string",
  "questionId": "string"
}
```

## Usage

### In FRQ Interface
1. Complete your responses to all parts
2. Click "Complete & Grade" to finish and get AI grading
3. Or click "Grade Current Response" to test individual parts
4. Review detailed feedback and scoring
5. Use "Re-grade" to get a fresh evaluation

### Grading Standards
The AI follows official AP exam grading standards:
- **Accuracy**: Correct mathematical/scientific content
- **Completeness**: Addressing all parts of the question
- **Clarity**: Clear reasoning and explanation
- **Method**: Appropriate problem-solving approach
- **Communication**: Proper use of terminology and notation

## Best Practices

### For Students
- **Show all work** and explain reasoning step-by-step
- **Use proper notation** and terminology
- **Answer completely** addressing all parts of each question
- **Write clearly** in complete sentences when appropriate

### For Implementation
- **Rate limiting**: Consider implementing rate limits for API calls
- **Error handling**: Graceful fallbacks for API failures
- **Caching**: Cache results to avoid re-grading identical responses
- **Monitoring**: Track API usage and costs

## Troubleshooting

### Common Issues
1. **API Key Invalid**: Verify the key is correct and has proper permissions
2. **Rate Limits**: Google AI has usage limits - implement proper throttling
3. **Response Parsing**: Ensure the AI response follows the expected JSON format
4. **Network Errors**: Handle timeouts and connection issues gracefully

### Error Messages
- `Missing required fields`: Check request body structure
- `Failed to parse AI response`: AI returned malformed JSON
- `Invalid grading response structure`: Missing required fields in response
- `Failed to grade FRQ`: General API or processing error

## Cost Considerations
- Google AI Studio offers free tier with generous limits
- Monitor usage through the Google AI Studio dashboard
- Consider implementing user limits or premium features for heavy usage

## Security Notes
- Keep your API key secure and never expose it client-side
- Use environment variables for all sensitive configuration
- Consider implementing user authentication for grading features
- Monitor for abuse or excessive usage patterns
