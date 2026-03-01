export interface FRQQuestion {
  id: string;
  subject: string;
  unit: string;
  topic: string;
  question: string;
  parts: FRQPart[];
  totalPoints: number;
  timeLimit: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year?: number;
  examType: 'AP Exam' | 'Practice' | 'College Board';
  rubric?: string;
  sampleResponse?: string;
}

export interface FRQPart {
  id: string;
  label: string; // e.g., "(a)", "(b)", "(c)"
  question: string;
  points: number;
  expectedLength?: 'short' | 'medium' | 'long'; // Expected response length
  hints?: string[];
}

export const localFRQQuestions: FRQQuestion[] = [
  {
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
    rubric: 'Part (a): 3 points for correct function setup. Part (b): 4 points for optimization process. Part (c): 2 points for final calculation.',
    sampleResponse: 'This is a classic optimization problem involving rectangular areas with constraints...'
  },
  {
    id: 'stats-frq-1',
    subject: 'AP Statistics',
    unit: 'Inference for Quantitative Data: Means',
    topic: 'Hypothesis Testing',
    question: 'A coffee shop claims that their espresso machine produces shots with an average volume of 30 mL. A quality control inspector suspects the machine is producing shots with less volume than claimed.',
    parts: [
      {
        id: 'part-a',
        label: '(a)',
        question: 'State the null and alternative hypotheses for this test.',
        points: 2,
        expectedLength: 'short',
        hints: [
          'H₀ represents the claim being tested',
          'H₁ represents what the inspector suspects',
          'Use proper notation with μ'
        ]
      },
      {
        id: 'part-b',
        label: '(b)',
        question: 'The inspector takes a random sample of 25 espresso shots and finds a mean volume of 28.5 mL with a standard deviation of 2.1 mL. Calculate the test statistic.',
        points: 3,
        expectedLength: 'medium',
        hints: [
          'Use the t-test statistic formula',
          't = (x̄ - μ₀) / (s / √n)',
          'Show your calculation steps clearly'
        ]
      },
      {
        id: 'part-c',
        label: '(c)',
        question: 'Using α = 0.05, what is your conclusion? Justify your answer.',
        points: 4,
        expectedLength: 'long',
        hints: [
          'Find the critical value or p-value',
          'Compare with α = 0.05',
          'State conclusion in context of the problem'
        ]
      }
    ],
    totalPoints: 9,
    timeLimit: 20,
    difficulty: 'Medium',
    year: 2024,
    examType: 'Practice',
    rubric: 'Part (a): 2 points for correct hypotheses. Part (b): 3 points for correct calculation. Part (c): 4 points for proper conclusion with justification.'
  },
  {
    id: 'cs-a-frq-1',
    subject: 'AP Computer Science A',
    unit: 'Writing Classes',
    topic: 'Class Design',
    question: 'You are designing a class to represent a Student in a school management system.',
    parts: [
      {
        id: 'part-a',
        label: '(a)',
        question: 'Write the complete Student class with appropriate instance variables, constructor, and getter methods. A student has a name, student ID, grade level (9-12), and GPA.',
        points: 5,
        expectedLength: 'long',
        hints: [
          'Include private instance variables',
          'Create a constructor that initializes all variables',
          'Add getter methods for each instance variable',
          'Consider data validation in the constructor'
        ]
      },
      {
        id: 'part-b',
        label: '(b)',
        question: 'Add a method called updateGPA that takes a new GPA as a parameter and updates the student\'s GPA only if the new GPA is valid (between 0.0 and 4.0).',
        points: 3,
        expectedLength: 'medium',
        hints: [
          'Check if the new GPA is in valid range',
          'Only update if valid',
          'Consider returning a boolean to indicate success'
        ]
      },
      {
        id: 'part-c',
        label: '(c)',
        question: 'Write a toString method that returns a string representation of the student in the format: "Name: [name], ID: [id], Grade: [grade], GPA: [gpa]"',
        points: 2,
        expectedLength: 'short',
        hints: [
          'Use string concatenation or String.format',
          'Include all instance variables in the specified format'
        ]
      }
    ],
    totalPoints: 10,
    timeLimit: 30,
    difficulty: 'Easy',
    year: 2024,
    examType: 'Practice',
    rubric: 'Part (a): 5 points for complete class structure. Part (b): 3 points for validation logic. Part (c): 2 points for correct string format.'
  }
];
