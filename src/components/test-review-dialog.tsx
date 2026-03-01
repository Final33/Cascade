import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import { processLatex } from '@/lib/process-latex';

interface TestReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testResults: any;
  onClose: () => void;
}

export const TestReviewDialog = React.memo(function TestReviewDialog({
  open,
  onOpenChange,
  testResults,
  onClose
}: TestReviewDialogProps) {
  if (!testResults) return null;
  
  const { questions, score, totalTime } = testResults;
  const validQuestions = Array.isArray(questions) ? questions : [];
  const totalPossibleScore = testResults.totalPossibleScore ?? validQuestions.length;
  const scorePercentage = totalPossibleScore > 0
    ? Math.round((score / totalPossibleScore) * 100)
    : 0;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60); // Use Math.round for cleaner display
    return `${mins}m ${secs}s`;
  };
  
  // Render a single question review (memoized)
  const renderQuestionReview = React.useCallback((question: any, index: number) => {
    const userAnswer = question.userAnswer;
    const isMCQ = question.type === 'mcq';
    const isFRQ = question.type === 'frq';

    // Process content/answers using LaTeX
    const processedQuestionContent = processLatex(question.content);
    const processedUserAnswer = isMCQ
      ? userAnswer?.selected ? processLatex(question.options?.find((opt: any) => opt.label === userAnswer.selected)?.text || userAnswer.selected) : <span className="italic text-muted-foreground">Not Answered</span>
      : processLatex(userAnswer?.text || ""); // For FRQ
    const processedCorrectAnswer = isMCQ
      ? processLatex(question.options?.find((opt: any) => opt.label === question.correctAnswer)?.text || question.correctAnswer)
      : null; // No single "correct" answer text for FRQ, use sample response
    const processedSampleResponse = question.sampleResponse ? processLatex(question.sampleResponse) : null; // For FRQ

    // Determine correctness indicator
    let correctnessIndicator;
    let scoreDisplay = null;
    if (isMCQ) {
      correctnessIndicator = question.isCorrect ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      );
    } else if (isFRQ) {
      // For FRQ, show score and use color based on score vs total points
      const totalPoints = question.rubric?.points || 0;
      const scoreValue = question.score ?? 0; // Use nullish coalescing
      scoreDisplay = (
         <span className={`font-semibold ${scoreValue === totalPoints ? 'text-green-600' : scoreValue > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
           {scoreValue} / {totalPoints} points
         </span>
      );
       correctnessIndicator = scoreValue === totalPoints ? (
         <CheckCircle className="h-5 w-5 text-green-600" />
       ) : scoreValue > 0 ? (
         <Circle className="h-5 w-5 text-yellow-600" /> // Indicate partial credit
       ) : (
         <XCircle className="h-5 w-5 text-red-600" />
       );
    }

    // 3. Ensure a stable and unique key for each rendered question item
    const itemKey = `q-review-${question.id || `idx-${index}`}`;

    return (
      <div key={itemKey} className="p-4 border rounded-lg bg-card shadow-sm mb-4 last:mb-0">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-lg">Question {index + 1}</h4>
          <div className="flex items-center gap-2">
             {scoreDisplay} {/* Show score for FRQ */}
             {correctnessIndicator}
          </div>
        </div>

        {/* Question Content */}
        <div className="prose prose-sm max-w-none mb-4">{processedQuestionContent}</div>

        {/* User Answer */}
        <div className="mb-4">
          <h5 className="font-medium text-sm mb-1">Your Answer:</h5>
          <div className={`p-3 border rounded text-sm ${isMCQ ? (question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-muted/50'}`}>
            {processedUserAnswer || <span className="italic text-muted-foreground">Not Answered</span>}
          </div>
        </div>

        {/* Correct Answer / Sample Response */}
        {isMCQ && !question.isCorrect && processedCorrectAnswer && ( // Added check for processedCorrectAnswer
          <div className="mb-4">
            <h5 className="font-medium text-sm mb-1">Correct Answer:</h5>
            <div className="p-3 border rounded text-sm bg-green-50 border-green-200">
              {processedCorrectAnswer}
            </div>
          </div>
        )}
         {isFRQ && processedSampleResponse && (
           <div className="mb-4">
             <h5 className="font-medium text-sm mb-1">Sample Response:</h5>
             <div className="p-3 border rounded text-sm bg-blue-50 border-blue-200">
               {processedSampleResponse}
             </div>
           </div>
         )}


        {/* Explanation / Feedback */}
        {(question.explanation || question.feedback) && (
          <div>
            <h5 className="font-medium text-sm mb-1">Explanation & Feedback:</h5>
            <div className="p-3 border rounded text-sm bg-amber-50 border-amber-200 prose prose-sm max-w-none">
               {/* Process explanation/feedback for LaTeX too */}
               {processLatex(question.explanation || question.feedback)}
            </div>
          </div>
        )}
      </div>
    );
  // Dependency array for useCallback - include dependencies if they exist outside the function
  }, []); // Assuming processLatex is stable and question structure is consistent

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 2. Add forceMount to DialogContent */}
      <DialogContent forceMount className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Test Results</DialogTitle>
            <Button variant="outline" onClick={onClose}>
              Close Review
            </Button>
          </div>
        </DialogHeader>
        
        {/* Summary stats - fixed height */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 border-y flex-shrink-0">
          {/* Score */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className={`text-2xl font-bold ${scorePercentage >= 80 ? 'text-green-600' : scorePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {scorePercentage}%
            </p>
            <p className="text-xs text-muted-foreground">({score} / {totalPossibleScore} points)</p>
          </div>
          
          {/* Time */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Time Taken</p>
            <p className="text-2xl font-bold">
              {formatTime(totalTime)}
            </p>
          </div>
          
          {/* Questions */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-2xl font-bold">{validQuestions.length}</p>
          </div>
        </div>
        
        {/* Question Review Title */}
        <div className="p-4 border-b flex-shrink-0">
          <h3 className="font-medium">Question Review</h3>
        </div>
        
        {/* Question list - native scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto overflow-x-hidden"
          style={{ 
            height: 'calc(90vh - 220px)',
            scrollBehavior: 'smooth',
            willChange: 'scroll-position'
          }}
        >
          <div className="p-4 space-y-0"> {/* Removed space-y-4, margin is on items now */}
            {validQuestions.map((question, index) => (
              // Render the memoized component
              renderQuestionReview(question, index)
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

// Add display name for better debugging
TestReviewDialog.displayName = 'TestReviewDialog';