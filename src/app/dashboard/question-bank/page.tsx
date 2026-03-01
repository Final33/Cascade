"use client";

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Play, Shield, Plus, Edit } from "lucide-react";
import { Spinner } from "@/components/Chatbot/Components/Spinner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { QuestionTestScreen } from "@/components/question-test-dialog";
import { FRQTestInterface } from "@/components/frq-test-interface";
import { AdminQuestionDialog } from "@/components/admin-question-dialog";
import { EditQuestionDialog } from "@/components/edit-question-dialog";
import { AdminFRQDialog } from "@/components/admin-frq-dialog";
import { localFRQQuestions } from "@/data/local-frq-questions";
import { UserContext } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { getFRQTypesForClass } from '@/lib/frq-base-types';

const apClasses = [
  { value: 'AP Calculus AB', label: 'AP Calculus AB' },
  { value: 'AP Precalculus', label: 'AP Precalculus' },
  { value: 'AP Computer Science A', label: 'AP Computer Science A' },
  { value: 'AP Statistics', label: 'AP Statistics' },
  { value: 'AP World History', label: 'AP World History' },
  { value: 'AP US History', label: 'AP US History' },
  { value: 'AP US Government', label: 'AP US Government' },
  { value: 'AP Human Geography', label: 'AP Human Geography' },
  { value: 'AP Psychology', label: 'AP Psychology' },
  { value: 'AP Microeconomics', label: 'AP Microeconomics' },
  { value: 'AP Chemistry', label: 'AP Chemistry' },
  { value: 'AP Biology', label: 'AP Biology' },
  { value: 'AP Environmental Science', label: 'AP Environmental Science' },
  { value: 'AP Physics 1', label: 'AP Physics 1: Algebra-Based' },
  { value: 'AP Physics C: Mechanics', label: 'AP Physics C: Mechanics' },
];

// Updated data structure for hierarchical topics/subtopics
const categoriesByClass: Record<string, { name: string; count: number; subtopics?: { name: string; count: number }[] }[]> = {
  'AP Calculus AB': [
    {
      name: 'Limits & Continuity',
      count: 42,
      subtopics: [
        { name: 'One-Sided Limits', count: 10 },
        { name: 'Continuity', count: 12 },
        { name: 'Infinite Limits', count: 8 },
        { name: 'Limit Laws', count: 12 },
      ],
    },
    {
      name: 'Derivatives',
      count: 58,
      subtopics: [
        { name: 'Power Rule', count: 20 },
        { name: 'Product Rule', count: 18 },
        { name: 'Quotient Rule', count: 10 },
        { name: 'Chain Rule', count: 10 },
      ],
    },
    {
      name: 'Integrals',
      count: 36,
      subtopics: [
        { name: 'Definite Integrals', count: 14 },
        { name: 'Indefinite Integrals', count: 12 },
        { name: 'Substitution', count: 10 },
      ],
    },
    {
      name: 'Applications of Derivatives',
      count: 27,
      subtopics: [
        { name: 'Related Rates', count: 7 },
        { name: 'Optimization', count: 8 },
        { name: 'Curve Sketching', count: 12 },
      ],
    },
  ],
  'AP Computer Science A': [
    {
      name: 'Java Basics',
      count: 30,
      subtopics: [
        { name: 'Variables & Data Types', count: 12 },
        { name: 'Operators', count: 8 },
        { name: 'Input/Output', count: 10 },
      ],
    },
    {
      name: 'Control Structures',
      count: 25,
      subtopics: [
        { name: 'If Statements', count: 10 },
        { name: 'Loops', count: 15 },
      ],
    },
    {
      name: 'Data Structures',
      count: 20,
      subtopics: [
        { name: 'Arrays', count: 12 },
        { name: 'ArrayLists', count: 8 },
      ],
    },
    {
      name: 'Algorithms',
      count: 15,
      subtopics: [
        { name: 'Searching', count: 7 },
        { name: 'Sorting', count: 8 },
      ],
    },
  ],
  'AP Statistics': [
    {
      name: 'Exploring Data',
      count: 35,
      subtopics: [
        { name: 'Descriptive Statistics', count: 15 },
        { name: 'Graphical Displays', count: 10 },
        { name: 'Normal Distributions', count: 10 },
      ],
    },
    {
      name: 'Sampling & Experimentation',
      count: 25,
      subtopics: [
        { name: 'Sampling Methods', count: 10 },
        { name: 'Experimental Design', count: 15 },
      ],
    },
    {
      name: 'Probability',
      count: 30,
      subtopics: [
        { name: 'Probability Rules', count: 12 },
        { name: 'Random Variables', count: 18 },
      ],
    },
    {
      name: 'Statistical Inference',
      count: 40,
      subtopics: [
        { name: 'Confidence Intervals', count: 15 },
        { name: 'Hypothesis Testing', count: 25 },
      ],
    },
  ],
  'AP World History': [
    {
      name: 'The Global Tapestry',
      count: 30,
      subtopics: [
        { name: 'State Building', count: 10 },
        { name: 'Cultural Developments', count: 10 },
        { name: 'Economic Systems', count: 10 },
      ],
    },
    {
      name: 'Networks of Exchange',
      count: 25,
      subtopics: [
        { name: 'Silk Roads', count: 8 },
        { name: 'Indian Ocean Trade', count: 9 },
        { name: 'Trans-Saharan Trade', count: 8 },
      ],
    },
    {
      name: 'Land-Based Empires',
      count: 28,
      subtopics: [
        { name: 'Gunpowder Empires', count: 10 },
        { name: 'Administration', count: 9 },
        { name: 'Belief Systems', count: 9 },
      ],
    },
    {
      name: 'Transoceanic Interconnections',
      count: 32,
      subtopics: [
        { name: 'European Exploration', count: 12 },
        { name: 'Columbian Exchange', count: 10 },
        { name: 'Maritime Empires', count: 10 },
      ],
    },
  ],
};

const apStatsUnits = [
  {
    title: "Unit 1: Exploring One-Variable Data",
    description:
      "You'll be introduced to how statisticians approach variation and practice representing data, describing distributions of data, and drawing conclusions based on a theoretical distribution.",
  },
  {
    title: "Unit 2: Exploring Two-Variable Data",
    description:
      "You'll build on what you've learned by representing two-variable data, comparing distributions, describing relationships between variables, and using models to make predictions.",
  },
  {
    title: "Unit 3: Collecting Data",
    description:
      "You'll be introduced to study design, including the importance of randomization. You'll understand how to interpret the results of well-designed studies to draw appropriate conclusions and generalizations.",
  },
  {
    title: "Unit 4: Probability, Random Variables, and Probability Distributions",
    description:
      "You'll learn the fundamentals of probability and be introduced to the probability distributions that are the basis for statistical inference.",
  },
  {
    title: "Unit 5: Sampling Distributions",
    description:
      "As you build understanding of sampling distributions, you'll lay the foundation for estimating characteristics of a population and quantifying confidence.",
  },
  {
    title: "Unit 6: Inference for Categorical Data: Proportions",
    description:
      "You'll learn inference procedures for proportions of a categorical variable, building a foundation of understanding of statistical inference, a concept you'll continue to explore throughout the course.",
  },
  {
    title: "Unit 7: Inference for Quantitative Data: Means",
    description:
      "Building on lessons learned about inference in Unit 6, you'll learn to analyze quantitative data to make inferences about population means.",
  },
  {
    title: "Unit 8: Inference for Categorical Data: Chi-Square",
    description:
      "You'll learn about chi-square tests, which can be used when there are two or more categorical variables.",
  },
  {
    title: "Unit 9: Inference for Quantitative Data: Slopes",
    description:
      "You'll understand that the slope of a regression model is not necessarily the true slope but is based on a single sample from a sampling distribution, and you'll learn how to construct confidence intervals and perform significance tests for this slope.",
  },
];

// Map of class value to units (for the Unit filter dropdown)
const unitsByClass: Record<string, string[]> = {
  "AP Calculus AB": [
    "Unit 1: Limits and Continuity",
    "Unit 2: Differentiation: Definition and Fundamental Properties",
    "Unit 3: Differentiation: Composite, Implicit, and Inverse Functions",
    "Unit 4: Contextual Applications of Differentiation",
    "Unit 5: Analytical Applications of Differentiation",
    "Unit 6: Integration and Accumulation of Change",
    "Unit 7: Differential Equations",
    "Unit 8: Applications of Integration"
  ],
  "AP Precalculus": [
    "Unit 1: Polynomial and Rational Functions",
    "Unit 2: Exponential and Logarithmic Functions",
    "Unit 3: Trigonometric and Polar Functions"
  ],
  "AP Statistics": [
    "Unit 1: Exploring One-Variable Data",
    "Unit 2: Exploring Two-Variable Data",
    "Unit 3: Collecting Data",
    "Unit 4: Probability, Random Variables, and Probability Distributions",
    "Unit 5: Sampling Distributions",
  ],
  "AP Computer Science A": [
    "Unit 1: Primitive Types",
    "Unit 2: Using Objects",
    "Unit 3: Boolean Expressions and if Statements",
    "Unit 4: Iteration",
    "Unit 5: Writing Classes",
    "Unit 6: Array",
    "Unit 7: ArrayList",
    "Unit 8: 2D Array",
    "Unit 9: Inheritance",
    "Unit 10: Recursion"
  ],
  "AP World History": [
    "Unit 1: The Global Tapestry",
    "Unit 2: Networks of Exchange",
    "Unit 3: Land-Based Empires",
    "Unit 4: Transoceanic Interconnections",
    "Unit 5: Revolutions",
    "Unit 6: Consequences of Industrialization",
    "Unit 7: Global Conflict",
    "Unit 8: Cold War and Decolonization",
    "Unit 9: Globalization"
  ],
  "AP Chemistry": [
    "Unit 1: Atomic Structure and Properties",
    "Unit 2: Molecular and Ionic Compound Structure and Properties",
    "Unit 3: Intermolecular Forces and Properties",
    "Unit 4: Chemical Reactions",
    "Unit 5: Kinetics",
    "Unit 6: Thermodynamics",
    "Unit 7: Equilibrium",
    "Unit 8: Acids and Bases",
    "Unit 9: Applications of Thermodynamics"
  ],
  "AP Biology": [
    "Unit 1: Chemistry of Life",
    "Unit 2: Cell Structure and Function",
    "Unit 3: Cellular Energetics",
    "Unit 4: Cell Communication and Cell Cycle",
    "Unit 5: Heredity",
    "Unit 6: Gene Expression and Regulation",
    "Unit 7: Natural Selection",
    "Unit 8: Ecology"
  ],
  "AP Physics 1": [
    "Unit 1: Kinematics",
    "Unit 2: Forces and Newton's Laws of Motion",
    "Unit 3: Work, Energy, and Power",
    "Unit 4: Systems of Particles and Linear Momentum",
    "Unit 5: Rotation",
    "Unit 6: Oscillations",
    "Unit 7: Gravitation"
  ],
  "AP Physics C: Mechanics": [
    "Unit 1: Kinematics",
    "Unit 2: Newton's Laws of Motion",
    "Unit 3: Work, Energy and Power",
    "Unit 4: Systems of Particles and Linear Momentum",
    "Unit 5: Rotation",
    "Unit 6: Oscillations",
    "Unit 7: Gravitation"
  ],
  "AP US History": [
    "Unit 1: Period 1: 1491-1607",
    "Unit 2: Period 2: 1607-1754",
    "Unit 3: Period 3: 1754-1800",
    "Unit 4: Period 4: 1800-1848",
    "Unit 5: Period 5: 1844-1877",
    "Unit 6: Period 6: 1865-1898",
    "Unit 7: Period 7: 1890-1945",
    "Unit 8: Period 8: 1945-1980",
    "Unit 9: Period 9: 1980-Present"
  ],
  "AP Human Geography": [
    "Unit 1: Thinking Geographically",
    "Unit 2: Population and Migration Patterns and Processes",
    "Unit 3: Cultural Patterns and Processes",
    "Unit 4: Political Patterns and Processes",
    "Unit 5: Agriculture and Rural Land-Use Patterns and Processes",
    "Unit 6: Cities and Urban Land-Use Patterns and Processes",
    "Unit 7: Industrial and Economic Development Patterns and Processes"
  ],
  "AP Environmental Science": [
    "Unit 1: The Living World: Ecosystems",
    "Unit 2: The Living World: Biodiversity",
    "Unit 3: Populations",
    "Unit 4: Earth Systems and Resources",
    "Unit 5: Land and Water Use",
    "Unit 6: Energy Resources and Consumption",
    "Unit 7: Atmospheric Pollution",
    "Unit 8: Aquatic and Terrestrial Pollution",
    "Unit 9: Global Change"
  ],
  "AP Microeconomics": [
    "Unit 1: Basic Economic Concepts",
    "Unit 2: Supply and Demand",
    "Unit 3: Production, Cost, and the Perfect Competition Model",
    "Unit 4: Imperfect Competition",
    "Unit 5: Factor Markets",
    "Unit 6: Market Failure and the Role of Government"
  ],
  "AP US Government": [
    "Unit 1: Foundations of American Democracy",
    "Unit 2: Interactions Among Branches of Government",
    "Unit 3: Civil Liberties and Civil Rights",
    "Unit 4: American Political Ideologies and Beliefs",
    "Unit 5: Political Participation"
  ],
  "AP Psychology": [
    "Unit 1: Biological Bases of Behavior",
    "Unit 2: Cognition",
    "Unit 3: Development and Learning",
    "Unit 4: Social Psychology and Personality",
    "Unit 5: Mental and Physical Health"
  ]
};

const QUESTIONS_PER_PAGE = 7;

export default function APQuestionBankPage() {
  const [selectedClass, setSelectedClass] = useState(apClasses[0].value);
  const [selectedUnit, setSelectedUnit] = useState("All Units");
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Handle URL parameters for direct FRQ access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam === 'frq') {
      setQuestionType('Free Response (FRQ)');
    }
  }, []);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  // Dialog state
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testDialogStartIndex, setTestDialogStartIndex] = useState(0);
  const [frqDialogOpen, setFrqDialogOpen] = useState(false);
  const [frqStartIndex, setFrqStartIndex] = useState(0);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminFRQDialogOpen, setAdminFRQDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  // User performance tracking
  const [questionPerformance, setQuestionPerformance] = useState<Record<string, boolean>>({});

  // Get user context for admin check
  const { userData } = useContext(UserContext);

  // Get units for the selected class (use database units if available, fallback to hardcoded)
  const unitOptions = ["All Units", ...(availableUnits.length > 0 ? availableUnits : (unitsByClass[selectedClass] || []))];
  
  // Dynamic question type options based on selected class
  const getQuestionTypeOptions = (selectedClass: string) => {
    const options = ['Multiple Choice'];
    const frqTypes = getFRQTypesForClass(selectedClass);
    
    // Add available FRQ types for the selected class
    frqTypes.forEach(frqType => {
      if (frqType.id === 'frq') {
        options.push('Free Response (FRQ)');
      } else if (frqType.id === 'dbq') {
        options.push('Document-Based Question (DBQ)');
      } else if (frqType.id === 'leq') {
        options.push('Long Essay Question (LEQ)');
      } else if (frqType.id === 'saq') {
        options.push('Short Answer Question (SAQ)');
      }
    });
    
    return options;
  };

  const questionTypeOptions = getQuestionTypeOptions(selectedClass);

  // Load user performance from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && userData?.uid) {
      const savedPerformance = localStorage.getItem(`questionPerformance_${userData.uid}`);
      if (savedPerformance) {
        try {
          setQuestionPerformance(JSON.parse(savedPerformance));
        } catch (error) {
          console.error('Error loading question performance:', error);
        }
      }
    }
  }, [userData?.uid]);

  // Save performance to localStorage
  const savePerformance = useCallback((performance: Record<string, boolean>) => {
    if (typeof window !== 'undefined' && userData?.uid) {
      localStorage.setItem(`questionPerformance_${userData.uid}`, JSON.stringify(performance));
      setQuestionPerformance(performance);
    }
  }, [userData?.uid]);

  // Function to update question performance
  const updateQuestionPerformance = useCallback((questionId: string, correct: boolean) => {
    setQuestionPerformance(prev => {
      const updated = { ...prev, [questionId]: correct };
      if (typeof window !== 'undefined' && userData?.uid) {
        localStorage.setItem(`questionPerformance_${userData.uid}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [userData?.uid]);

  // Fetch available units for the selected class from database
  const fetchAvailableUnits = useCallback(async (className: string) => {
    try {
      const response = await fetch(`/api/questions/units?class=${encodeURIComponent(className)}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUnits(data.units || []);
      } else {
        // Fallback to hardcoded units if API fails
        setAvailableUnits([]);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      setAvailableUnits([]);
    }
  }, []);

  // Fetch available units when class changes
  useEffect(() => {
    fetchAvailableUnits(selectedClass);
  }, [selectedClass, fetchAvailableUnits]);

  // Fetch questions from Supabase
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      setQuestions([]);
      try {
        if (questionType === 'Free Response (FRQ)') {
          // Fetch FRQs from the new API
          const params = new URLSearchParams();
          params.set('subject', selectedClass);
          if (selectedUnit !== 'All Units') {
            params.set('unit', selectedUnit);
          }
          
          const response = await fetch(`/api/admin/frq?${params.toString()}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch FRQ questions');
          }
          
          const data = await response.json();
          setQuestions(data.frqs || []);
        } else {
          // Fetch MCQs from existing API
          const params = new URLSearchParams();
          params.set('class', selectedClass);
          if (selectedUnit !== 'All Units') {
            params.set('unit', selectedUnit);
          }
          params.set('type', 'MCQ');
          params.set('all', 'true');
          
          const response = await fetch(`/api/questions?${params.toString()}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch questions');
          }
          
          const data = await response.json();
          setQuestions(data.questions || []);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load questions.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [selectedClass, selectedUnit, questionType]);

  // Pagination logic
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE) || 1;
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedUnit, questionType]);

  // Handlers for opening the test dialog
  const handlePracticeSet = () => {
    if (questionType === 'Free Response (FRQ)') {
      // Use database FRQ questions
      if (questions.length > 0) {
        setFrqStartIndex(0);
        setFrqDialogOpen(true);
      }
    } else {
      setTestDialogStartIndex(0);
      setTestDialogOpen(true);
    }
  };
  const handleQuestionClick = (idx: number) => {
    setTestDialogStartIndex(idx + (currentPage - 1) * QUESTIONS_PER_PAGE);
    setTestDialogOpen(true);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setEditDialogOpen(true);
  };

  // Refresh questions after adding new one
  const refreshQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (questionType === 'Free Response (FRQ)') {
        // Fetch FRQs from the new API
        const params = new URLSearchParams();
        params.set('subject', selectedClass);
        if (selectedUnit !== 'All Units') {
          params.set('unit', selectedUnit);
        }
        
        const response = await fetch(`/api/admin/frq?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch FRQ questions');
        }
        
        const data = await response.json();
        setQuestions(data.frqs || []);
      } else {
        // Fetch MCQs from existing API
        const params = new URLSearchParams();
        params.set('class', selectedClass);
        if (selectedUnit !== 'All Units') {
          params.set('unit', selectedUnit);
        }
        params.set('type', 'MCQ');
        params.set('all', 'true');
        
        const response = await fetch(`/api/questions?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch questions');
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedUnit, questionType]);

  return (
            <div className="container py-8 space-y-8 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold mb-2">AP Question Bank</h1>
        <p className="text-gray-600">
          Browse and filter AP-style questions by class, unit, and topic.
        </p>
      </div>
      {/* Filters Bar */}
      <Card className="p-3 mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Class:</label>
          <select
            className="border rounded px-2 py-1.5 min-w-[160px] text-sm focus:ring-2 focus:ring-blue-400"
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              setSelectedUnit("All Units");
            }}
          >
            {apClasses.map(cls => (
              <option key={cls.value} value={cls.value}>{cls.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Unit:</label>
          <select
            className="border rounded px-2 py-1.5 max-w-[180px] min-w-[140px] text-sm focus:ring-2 focus:ring-blue-400 truncate"
            value={selectedUnit}
            onChange={e => {
              setSelectedUnit(e.target.value);
            }}
          >
            {unitOptions.map(unit => (
              <option key={unit} value={unit} className="truncate">{unit}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Type:</label>
          <select
            className="border rounded px-2 py-1.5 min-w-[140px] text-sm focus:ring-2 focus:ring-blue-400"
            value={questionType}
            onChange={e => {
              setQuestionType(e.target.value);
            }}
          >
            {questionTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="ml-auto text-sm" 
          onClick={() => { 
            setSelectedClass(apClasses[0].value); 
            setSelectedUnit("All Units"); 
            setQuestionType("Multiple Choice"); 
          }}
        >
          Reset
        </Button>
        
        {/* Admin Add Question Buttons - Only visible to admins */}
        {userData?.admin && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700 font-medium flex items-center gap-1.5 text-sm"
              onClick={() => questionType === 'Free Response (FRQ)' ? setAdminFRQDialogOpen(true) : setAdminDialogOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add {questionType === 'Free Response (FRQ)' ? 'FRQ' : 'MCQ'}
            </Button>
          </>
        )}
        
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5 text-sm shadow-none border-none"
          onClick={handlePracticeSet}
        >
          <Play className="w-4 h-4" fill="white" />
          Practice Set
        </Button>
      </Card>
      {/* Questions Table */}
      <Card className="overflow-x-auto p-0 min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner width={40} height={40} />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : questionType === 'Free Response (FRQ)' ? (
          // Show database FRQ questions
          questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No FRQ questions found for the selected filters.</p>
              <Button variant="outline" onClick={() => { setSelectedClass(apClasses[0].value); setSelectedUnit("All Units"); setQuestionType("Multiple Choice"); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {paginatedQuestions.map((frq, index) => {
                // Parse parts if they're stored as JSON string
                const parts = typeof frq.parts === 'string' ? JSON.parse(frq.parts) : (frq.parts || []);
                
                return (
                  <div key={frq.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" onClick={() => {
                    setFrqStartIndex(index + (currentPage - 1) * QUESTIONS_PER_PAGE);
                    setFrqDialogOpen(true);
                  }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{frq.topic}</h3>
                        <p className="text-gray-500 text-sm mb-2">{frq.unit}</p>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{frq.question}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                        <Badge variant="outline" className={cn(
                          "text-xs font-medium",
                          frq.difficulty === 'Easy' && "bg-green-50 text-green-700 border-green-200",
                          frq.difficulty === 'Medium' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                          frq.difficulty === 'Hard' && "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {frq.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {frq.total_points} pts
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                          {frq.time_limit} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="font-medium">{parts.length} parts</span>
                      <span>{frq.exam_type} • {frq.year}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Label</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit</th>
                {userData?.admin && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedQuestions.map((q, idx) => {
                const performance = questionPerformance[q.id];
                return (
                  <tr
                    key={q.id}
                    className={cn(
                      "transition cursor-pointer",
                      performance === true
                        ? "bg-green-50 hover:bg-green-100"
                        : performance === false
                        ? "bg-red-50 hover:bg-red-100"
                        : "bg-white hover:bg-blue-50"
                    )}
                    onClick={() => handleQuestionClick(idx)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">Q{q.label}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-purple-600 text-white text-xs font-bold px-3 py-1">
                        {q.unit}
                      </span>
                    </td>
                    {userData?.admin && (
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleEditQuestion(q);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {paginatedQuestions.length === 0 && !loading && (
                <tr>
                  <td colSpan={userData?.admin ? 3 : 2} className="px-6 py-8 text-center text-gray-500">No questions found for the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
      {/* Question Test Screen */}
      {testDialogOpen && (
        <QuestionTestScreen
          questions={questions}
          startIndex={testDialogStartIndex}
          onClose={() => setTestDialogOpen(false)}
          title="Question Bank Practice Test"
          onQuestionPerformanceUpdate={updateQuestionPerformance}
        />
      )}

      {/* FRQ Test Interface */}
      {frqDialogOpen && (
        <FRQTestInterface
          questions={questions.filter(q => questionType === 'Free Response (FRQ)')}
          startIndex={frqStartIndex}
          onClose={() => setFrqDialogOpen(false)}
          onComplete={(results) => {
            console.log('FRQ Test Results:', results);
            setFrqDialogOpen(false);
            // TODO: Save results to database
          }}
        />
      )}

      {/* Admin Question Dialog - Only for admins */}
      {userData?.admin && (
        <AdminQuestionDialog
          open={adminDialogOpen}
          onOpenChange={setAdminDialogOpen}
          onQuestionAdded={refreshQuestions}
        />
      )}

      {/* Admin FRQ Dialog - Only for admins */}
      {userData?.admin && (
        <AdminFRQDialog
          open={adminFRQDialogOpen}
          onOpenChange={setAdminFRQDialogOpen}
          onFRQAdded={refreshQuestions}
          initialSubject={selectedClass}
          initialUnit={selectedUnit !== 'All Units' ? selectedUnit : undefined}
        />
      )}

      {/* Edit Question Dialog - Only for admins */}
      {userData?.admin && (
        <EditQuestionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          question={editingQuestion}
          onQuestionUpdated={refreshQuestions}
        />
      )}
    </div>
  );
} 