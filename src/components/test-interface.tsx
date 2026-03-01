"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bookmark,
  Bot,
  X,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { processLatex } from '@/lib/process-latex'
import { toast } from "@/components/ui/use-toast"
import { saveTestResults, updateTotalPracticeTime } from "@/lib/supabase/test-results"
import { gradeFRQResponse } from "@/lib/frq-grading"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { LatexContent } from './latex-content'
import { Question, TestResults, TestType, MCQQuestion, FRQQuestion } from "@/types/test"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "./ui/use-toast"

// Create a module-scoped holder for practice time to avoid SSR side-effects
export let allTestsTime: number;

export const fetchAllTestsTime = async () => {
  if (typeof window === 'undefined') return;
  const supabase = createSupabaseBrowserClient();
  const { data: userResp } = await supabase.auth.getUser();
  const userId = userResp?.user?.id;
  if (!userId) return;
  const { data, error } = await supabase
    .from('users')
    .select('totalPracticeTime')
    .eq('uid', userId)
    .single();
  if (error) {
    console.error('Error fetching all test times:', error);
    return;
  }
  allTestsTime = data?.totalPracticeTime || 0;
};

export const updatePracticeTime = async () => {
  if (typeof window === 'undefined') return;
  const supabase = createSupabaseBrowserClient();
  const { data: userResp } = await supabase.auth.getUser();
  const userId = userResp?.user?.id;
  if (!userId) return;
  const { error } = await supabase
    .from('tests')
    .select('total_time')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching all test times:', error);
  }
};

interface TestInterfaceProps {
  questions: FRQQuestion[];
  onComplete: (results: {
    score: number;
    totalPossiblePoints: number;
    totalTime: number;
    questions: Array<{
      id: string;
      score?: number;
      totalPoints: number;
      response: string;
      feedback?: string[];
    }>;
  }) => void;
  isFullscreen?: boolean;
  startIndex?: number;
}

interface FRQAnswer {
  response: string;
}

export function TestInterface({ questions: initialQuestions, onComplete, isFullscreen, startIndex = 0 }: TestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(startIndex);
  const [answers, setAnswers] = useState<Record<number, FRQAnswer>>({});
  const [startTime] = useState(Date.now());
  const [showReview, setShowReview] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    // Safely fetch totals on mount in the browser only
    fetchAllTestsTime();
  }, []);

  const validatedQuestions = useMemo(() => {
    return initialQuestions.filter((q): q is FRQQuestion => q.type === "frq");
  }, [initialQuestions]);

  const handleAnswer = useCallback((response: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: { response }
    }));
  }, [currentQuestion]);

  const handleSubmit = useCallback(async () => {
    const totalTime = Date.now() - startTime;
    
    try {
      const results = await Promise.all(
        validatedQuestions.map(async (question, index) => {
          const answer = answers[index]?.response || "";
          
          // Call AI grading endpoint
          const { data: gradeData, error: gradeError } = await supabase.functions.invoke('grade-frq', {
            body: {
              question,
              answer,
              rubric: question.rubric
            }
          });

          if (gradeError) throw gradeError;

          return {
            id: question.id,
            score: gradeData.score,
            totalPoints: question.rubric.points,
            response: answer,
            feedback: gradeData.feedback
          };
        })
      );

      const totalScore = results.reduce((sum, q) => sum + (q.score || 0), 0);
      const totalPossiblePoints = results.reduce((sum, q) => sum + q.totalPoints, 0);

      const finalResults = {
        score: totalScore,
        totalPossiblePoints,
        totalTime,
        questions: results
      };

      setTestResults(finalResults);
      setShowReview(true);

    } catch (error) {
      console.error('Error grading test:', error);
      toast({
        title: "Error Grading Test",
        description: "There was an error grading your test. Please try again.",
        variant: "destructive"
      });
    }
  }, [validatedQuestions, answers, startTime, supabase.functions, toast]);

  const renderQuestion = useCallback(() => {
    const question = validatedQuestions[currentQuestion];
    if (!question) return null;

    const questionHeader = (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Question {currentQuestion + 1}</h2>
          {question.title && (
            <span className="text-sm text-muted-foreground">{question.title}</span>
          )}
        </div>
        <div className="prose max-w-none mb-4">
          {processLatex(question.content)}
        </div>
      </div>
    );

    return (
      <div className="frq-question" id="frq-question-container">
        {questionHeader}
        
        {question.rubric && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">
              Rubric ({question.rubric.points || 'N/A'} points)
            </h3>
            {Array.isArray(question.rubric.criteria) && question.rubric.criteria.length > 0 ? (
              <ul className="text-xs space-y-1 list-disc list-inside">
                {question.rubric.criteria.map((criterion, idx) => (
                  <li key={idx}>{criterion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No specific criteria provided.</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Textarea
            id="frq-response-area"
            placeholder="Type your response here..."
            value={answers[currentQuestion]?.response || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="min-h-[200px] w-full resize-y font-mono text-sm p-4"
          />
        </div>
      </div>
    );
  }, [validatedQuestions, currentQuestion, answers, handleAnswer]);

  const renderPagination = useMemo(() => {
    return (
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {validatedQuestions.map((_, idx) => (
            <Button
              key={idx}
              variant={currentQuestion === idx ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setCurrentQuestion(idx)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
        
        {currentQuestion === validatedQuestions.length - 1 ? (
          <Button variant="default" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.min(validatedQuestions.length - 1, prev + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }, [currentQuestion, validatedQuestions.length, handleSubmit]);

  return (
    <div className={cn("flex flex-col h-full", isFullscreen && "bg-background")}>
      {showReview && testResults ? (
        <div className="flex flex-col h-full max-h-[calc(100vh-2rem)]">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Results</h2>
              <div className="px-3 py-1 bg-muted rounded-full text-sm">
                Score: {testResults.score} / {testResults.totalPossiblePoints} points
              </div>
            </div>
            <Button variant="outline" onClick={() => onComplete(testResults)}>
              Close Review
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="p-4 space-y-6">
              {testResults.questions.map((question: any, index: number) => (
                <div key={question.id || index} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <span className={cn(
                      "font-semibold px-2 py-0.5 rounded",
                      question.score === question.totalPoints ? "bg-green-100 text-green-700" :
                      question.score > 0 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {question.score} / {question.totalPoints} pts
                    </span>
                  </div>
                  
                  <div className="prose max-w-none mb-4">
                    <h4 className="text-sm font-medium mb-2">Your Response:</h4>
                    <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                      {question.response || "No response provided"}
                    </pre>
                  </div>
                  
                  {question.feedback && question.feedback.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Feedback:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {question.feedback.map((comment: string, i: number) => (
                          <li key={i} className="text-muted-foreground">{comment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full p-4">
          <div className="flex-1 overflow-y-auto min-h-0">
            {renderQuestion()}
          </div>
          {renderPagination}
        </div>
      )}
    </div>
  );
}
