// Test script for AI grading system
// Run this with: node src/test/test-ai-grading.js

const testGrading = async () => {
  console.log('🧪 Testing AI Grading System...\n');

  // Test data - sample responses for the Calculus FRQ
  const testQuestion = {
    id: 'calc-ab-frq-1',
    subject: 'AP Calculus AB',
    unit: 'Applications of Derivatives',
    topic: 'Optimization',
    question: 'A farmer has 200 feet of fencing and wants to enclose a rectangular area and then divide it into two equal parts with a fence parallel to one of the sides.',
    parts: [
      {
        id: 'part-a',
        label: '(a)',
        question: 'Express the area of the enclosed region as a function of the width x of the rectangle.',
        points: 3,
        expectedLength: 'medium',
        hints: [
          'Let x be the width and y be the length',
          'Consider how much fencing is used for the perimeter and divider',
          'Total fencing: 2x + 3y = 200'
        ]
      },
      {
        id: 'part-b',
        label: '(b)',
        question: 'Find the dimensions that maximize the area.',
        points: 4,
        expectedLength: 'medium',
        hints: [
          'Take the derivative of the area function',
          'Set the derivative equal to zero',
          'Verify it\'s a maximum using the second derivative test'
        ]
      },
      {
        id: 'part-c',
        label: '(c)',
        question: 'What is the maximum area that can be enclosed?',
        points: 2,
        expectedLength: 'short',
        hints: [
          'Substitute the optimal dimensions into the area function'
        ]
      }
    ],
    totalPoints: 9,
    timeLimit: 25,
    difficulty: 'Medium',
    year: 2023,
    examType: 'Practice',
    rubric: 'Part (a): 3 points for correct function setup. Part (b): 4 points for optimization process. Part (c): 2 points for final calculation.'
  };

  // Test Case 1: Excellent Response
  const excellentResponses = [
    {
      partId: 'part-a',
      response: 'Let x be the width and y be the length of the rectangle. The farmer needs fencing for the perimeter plus one divider parallel to the width. So the total fencing used is: 2x + 3y = 200. Solving for y: y = (200 - 2x)/3. The area function is A(x) = x * y = x * (200 - 2x)/3 = (200x - 2x²)/3.',
      timeSpent: 180,
      wordCount: 65
    },
    {
      partId: 'part-b',
      response: 'To find the maximum area, I need to take the derivative of A(x) and set it equal to zero. A(x) = (200x - 2x²)/3, so A\'(x) = (200 - 4x)/3. Setting A\'(x) = 0: (200 - 4x)/3 = 0, which gives 200 - 4x = 0, so x = 50. When x = 50, y = (200 - 2(50))/3 = 100/3 ≈ 33.33. To verify this is a maximum, A\'\'(x) = -4/3 < 0, confirming a maximum.',
      timeSpent: 240,
      wordCount: 95
    },
    {
      partId: 'part-c',
      response: 'The maximum area is A(50) = (200(50) - 2(50)²)/3 = (10000 - 5000)/3 = 5000/3 ≈ 1666.67 square feet.',
      timeSpent: 60,
      wordCount: 25
    }
  ];

  // Test Case 2: Poor Response
  const poorResponses = [
    {
      partId: 'part-a',
      response: 'Area = length times width',
      timeSpent: 30,
      wordCount: 5
    },
    {
      partId: 'part-b',
      response: 'Take derivative and set to zero',
      timeSpent: 20,
      wordCount: 7
    },
    {
      partId: 'part-c',
      response: 'The answer is big',
      timeSpent: 15,
      wordCount: 4
    }
  ];

  // Test Case 3: Partial Credit Response
  const partialResponses = [
    {
      partId: 'part-a',
      response: 'Let x be width and y be length. The fencing constraint is 2x + 2y + x = 200, so 3x + 2y = 200. Therefore y = (200 - 3x)/2. Area = xy = x(200 - 3x)/2.',
      timeSpent: 120,
      wordCount: 40
    },
    {
      partId: 'part-b',
      response: 'A(x) = x(200 - 3x)/2 = (200x - 3x²)/2. A\'(x) = (200 - 6x)/2 = 100 - 3x. Setting equal to zero: 100 - 3x = 0, so x = 100/3. Then y = (200 - 3(100/3))/2 = (200 - 100)/2 = 50.',
      timeSpent: 180,
      wordCount: 55
    },
    {
      partId: 'part-c',
      response: 'Maximum area = (100/3)(50) = 5000/3 square feet.',
      timeSpent: 45,
      wordCount: 10
    }
  ];

  const testCases = [
    { name: 'Excellent Response', responses: excellentResponses },
    { name: 'Poor Response', responses: poorResponses },
    { name: 'Partial Credit Response', responses: partialResponses }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log('=' .repeat(50));

    try {
      const response = await fetch('http://localhost:3000/api/grade-frq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: testQuestion,
          responses: testCase.responses,
          rubric: testQuestion.rubric
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        continue;
      }

      const gradingResult = await response.json();
      
      console.log(`\n🎯 Overall Score: ${gradingResult.totalScore}/${gradingResult.maxScore} (${gradingResult.percentage}%)`);
      console.log(`📊 Grade: ${gradingResult.overallGrade}`);
      console.log(`⏱️  Grading Time: ${gradingResult.gradingTime}`);
      
      console.log('\n📋 Part Breakdown:');
      gradingResult.parts.forEach((part, index) => {
        console.log(`\n  Part ${part.partLabel}: ${part.pointsEarned}/${part.maxPoints} points`);
        console.log(`  📝 Feedback: ${part.feedback.substring(0, 100)}...`);
        if (part.strengths.length > 0) {
          console.log(`  ✅ Strengths: ${part.strengths[0]}`);
        }
        if (part.improvements.length > 0) {
          console.log(`  🔧 Improvements: ${part.improvements[0]}`);
        }
      });

      console.log(`\n💬 Overall Feedback: ${gradingResult.overallFeedback.substring(0, 150)}...`);
      
      if (gradingResult.studyRecommendations.length > 0) {
        console.log(`\n📚 Study Recommendations:`);
        gradingResult.studyRecommendations.slice(0, 2).forEach((rec, i) => {
          console.log(`  ${i + 1}. ${rec}`);
        });
      }

    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }

  console.log('\n🎉 AI Grading Test Complete!');
};

// Run the test
testGrading().catch(console.error);
