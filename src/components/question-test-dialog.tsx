"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { processLatex } from "@/lib/process-latex";
import { 
  ArrowLeft, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Calculator, 
  FileText, 
  MoreHorizontal,
  Highlighter,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DesmosCalculator } from "./desmos-calculator";
import { Notepad } from "./notepad";

export interface QuestionTestScreenProps {
  questions: any[];
  startIndex?: number;
  onClose: () => void;
  title?: string;
  onQuestionPerformanceUpdate?: (questionId: string, correct: boolean) => void;
}

export function QuestionTestScreen({ 
  questions, 
  startIndex = 0, 
  onClose, 
  title = "Practice Test",
  onQuestionPerformanceUpdate
}: QuestionTestScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(startIndex);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  // Memoized function to get current question's subject and topic
  const currentSubjectAndTopic = React.useMemo(() => {
    const question = questions[currentQuestion];
    if (!question) return { subject: "Practice Test", topic: "" };

    // Extract subject from class field or default mappings
    let subject = "Practice Test";
    let topic = "";

    // Handle different question data structures
    if (question.class) {
      subject = question.class;
    } else if (question.course) {
      subject = question.course;
    } else if (question.content && question.content.includes("AP")) {
      // Try to extract AP subject from content
      const apMatch = question.content.match(/AP\s+([A-Za-z\s]+)/i);
      if (apMatch) {
        subject = `AP ${apMatch[1].trim()}`;
      }
    }

    // Get topic from various possible fields
    if (question.topic) {
      topic = question.topic;
    } else if (question.unit) {
      topic = question.unit;
    } else if (question.topics && Array.isArray(question.topics) && question.topics.length > 0) {
      topic = question.topics[0];
    }

    // Clean up and format the subject name
    if (subject && !subject.startsWith("AP") && (subject.toLowerCase().includes("calculus") || subject.toLowerCase().includes("statistics") || subject.toLowerCase().includes("physics"))) {
      subject = `AP ${subject.replace(/^ap\s*/i, "")}`;
    }

    return { subject: subject || "Practice Test", topic: topic || "" };
  }, [questions, currentQuestion]);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [isStrikethroughMode, setIsStrikethroughMode] = useState(false);
  const [crossedOutAnswers, setCrossedOutAnswers] = useState<Record<number, Set<string>>>({});
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const isMarked = markedForReview.has(currentQuestion);
  const isChecked = checkedQuestions.has(currentQuestion);

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const toggleStrikethrough = () => {
    setIsStrikethroughMode(prev => !prev);
  };

  const toggleAnswerCrossOut = (answerChoice: string) => {
    setCrossedOutAnswers(prev => {
      const questionCrossedOut = prev[currentQuestion] || new Set();
      const newSet = new Set(questionCrossedOut);
      
      if (newSet.has(answerChoice)) {
        newSet.delete(answerChoice);
      } else {
        newSet.add(answerChoice);
      }
      
      return {
        ...prev,
        [currentQuestion]: newSet
      };
    });
  };

  const isAnswerCrossedOut = (answerChoice: string) => {
    return crossedOutAnswers[currentQuestion]?.has(answerChoice) || false;
  };

  const toggleTimerVisibility = () => {
    setIsTimerVisible(prev => !prev);
  };

  const handleAnswerSelect = (option: string) => {
    // Prevent selection of crossed-out answers
    if (isAnswerCrossedOut(option)) {
      return;
    }
    
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index);
    }
  };

  // Mock multiple choice options - you'll need to adapt this to your question structure
  const getMultipleChoiceOptions = (question: any) => {
    // This is a placeholder - adapt to your actual question structure
    if (question.options && Array.isArray(question.options)) {
      return question.options;
    }
    // Fallback to default options
    return [
      { id: "A", text: "Option A" },
      { id: "B", text: "Option B" },
      { id: "C", text: "Option C" },
      { id: "D", text: "Option D" }
    ];
  };

  const options = getMultipleChoiceOptions(currentQ);

  // Don't render on server side
  if (!isMounted) return null;

  const testInterface = (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-white z-50 flex flex-col" 
      style={{ 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      {/* AP-Style Header */}
      <div className="bg-blue-50 border-b-2 border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            
            {/* Timer with Eye Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimerVisibility}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                {isTimerVisible ? (
                  <Eye className="h-4 w-4 text-gray-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-600" />
                )}
              </button>
              <div className="w-20 text-xl font-mono font-bold text-gray-900">
                {isTimerVisible ? formatTime(timeElapsed) : ''}
              </div>
            </div>
          </div>

          {/* Center - Course Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-2 text-lg font-bold text-gray-900">
              <span>{currentSubjectAndTopic.subject}</span>
              {currentSubjectAndTopic.topic && (
                <span className="text-base text-gray-600 font-medium">• {currentSubjectAndTopic.topic}</span>
              )}
            </div>
          </div>

          {/* Right Section - Tools */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowNotepad(true)}
            >
              <StickyNote className="h-4 w-4" />
              Highlights & Notes
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reference
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Toggle Button - Always Visible */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className={cn(
            "absolute top-4 z-10 bg-white border border-gray-300 rounded-lg p-2 shadow-sm hover:shadow-md transition-all hover:bg-gray-50 duration-300",
            showLeftPanel ? "left-36" : "left-4"
          )}
        >
          {showLeftPanel ? <PanelLeftClose className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
        </button>

        {/* Left Sidebar - Question Navigation */}
        <div
          className={cn(
            "bg-gray-100 border-r border-gray-300 overflow-y-auto transition-all duration-300",
            showLeftPanel ? "w-32" : "w-0"
          )}
        >
          {showLeftPanel && (
            <div className="p-4 pt-16">
              <div className="space-y-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={cn(
                      "w-full px-3 py-2 text-sm font-medium rounded transition-all",
                      index === currentQuestion
                        ? "bg-blue-500 text-white"
                        : checkedQuestions.has(index) && correctAnswers[index] === true
                        ? "bg-green-100 text-green-800"
                        : checkedQuestions.has(index) && correctAnswers[index] === false
                        ? "bg-red-100 text-red-800"
                        : answers[questions[index].id]
                        ? "bg-gray-100 text-gray-700"
                        : markedForReview.has(index)
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Q{index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

              {/* Right Panel - Question Text and Answer Choices */}
              <div className="flex-1 flex flex-col overflow-hidden">
         <div className="flex-1 overflow-y-auto p-6">


           {/* Question Header */}
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 ml-16">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-medium text-base">
                 {currentQuestion + 1}
               </div>
               <button
                 onClick={toggleMarkForReview}
                 className={cn(
                   "flex items-center justify-center p-2 rounded-full transition-colors",
                   isMarked ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-gray-500 hover:bg-gray-50"
                 )}
               >
                 {isMarked ? <BookmarkCheck className="h-6 w-6" /> : <Bookmark className="h-6 w-6 stroke-2" />}
               </button>
               <button
                 onClick={() => setShowCalculator(true)}
                 className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
               >
                 <Calculator className="h-6 w-6" />
               </button>
             </div>


             <div className="flex items-center mr-4">
               {/* Strikethrough Icon */}
               <button
                 onClick={toggleStrikethrough}
                 className={cn(
                   "flex items-center justify-center p-2 rounded-full transition-colors",
                   isStrikethroughMode ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-gray-500 hover:bg-gray-50"
                 )}
               >
                 <div className="relative flex items-center justify-center w-7 h-7">
                   <span className="text-base font-medium line-through decoration-2 decoration-current">abc</span>
                 </div>
               </button>
             </div>
           </div>


           {/* Render Stimulus Blocks */}
           {[currentQ.question_stimulus, currentQ.question_stimulus_2].map((stimulus, index) =>
             stimulus ? (
               <div className="mb-6" key={index}>
                 {stimulus.startsWith('http') || stimulus.startsWith('data:') ? (
                   // Image stimulus
                   <div className="mb-4">
                     <img
                       src={stimulus}
                       alt={`Stimulus ${index + 1}`}
                       className="max-w-full h-auto rounded-lg border border-gray-200"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                       }}
                     />
                     {index === 0 && currentQ.image_desc && (
                       <div className="mt-2 text-sm italic text-gray-600">{currentQ.image_desc}</div>
                     )}
                     {index === 1 && currentQ.image_desc_2 && (
                       <div className="mt-2 text-sm italic text-gray-600">{currentQ.image_desc_2}</div>
                     )}
                   </div>
                 ) : (
                   // Text stimulus with attribution formatting (HTML content)
                   <div
                     className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-base leading-relaxed text-gray-800 whitespace-pre-line"
                     dangerouslySetInnerHTML={{ __html: stimulus }}
                   ></div>
                 )}
               </div>
             ) : null
           )}


           {/* Question Text */}
           <div className="text-lg leading-relaxed text-gray-900 font-normal mb-4">
             {processLatex(currentQ.question_text?.trim() || "Question text not available.")}
           </div>
         { /*currentQ.question_text?.trim()*/}
           {/* <div
             className="text-lg leading-relaxed text-gray-900 font-normal mb-4"
             style={{ whiteSpace: "pre-wrap" }}
           >
             {currentQ.question_text?.trim() || "Question text not available."}
           </div> */}




           




          {/* Answer Choices - Only shown when not checked */}
          {!isChecked && (
            <div className="space-y-4">
              {options.map((option: any, index: number) => {
                const optionId = option.id || String.fromCharCode(65 + index);
                const isSelected = answers[currentQ.id] === optionId;
                const isCrossedOut = isAnswerCrossedOut(optionId);

                const isImage =
                  typeof option.text === "string" &&
                  /\.(jpeg|jpg|gif|png|svg)$/.test(option.text.toLowerCase());

                return (
                  <div
                    key={optionId}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-full border-2 transition-all min-h-[60px] relative",
                      isCrossedOut
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm cursor-pointer"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm cursor-pointer"
                    )}
                  >
                    <div
                      onClick={() => handleAnswerSelect(optionId)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0",
                        isCrossedOut
                          ? "border-gray-300 text-gray-400 bg-gray-100"
                          : isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-600 text-gray-800 bg-white"
                      )}
                    >
                      {optionId}
                    </div>
                    <div 
                      onClick={() => handleAnswerSelect(optionId)}
                      className={cn(
                        "flex-1 text-base leading-relaxed font-normal",
                        isCrossedOut ? "text-gray-400 line-through" : "text-gray-900"
                      )}
                    >
                      {isImage ? (
                        <img
                          src={option.text}
                          alt={`Option ${optionId}`}
                          className="max-h-20 object-contain"
                        />
                      ) : (
                        <div>
                          {processLatex(option.text || option)}
                        </div>
                      )}
                    </div>
                    
                    {/* Strikethrough Circle - Only show when strikethrough mode is active */}
                    {isStrikethroughMode && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAnswerCrossOut(optionId);
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-110",
                          "animate-in slide-in-from-right-2 fade-in duration-300",
                          isCrossedOut
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-gray-400 bg-white text-gray-600 hover:border-red-400 hover:bg-red-50"
                        )}
                      >
                        {isCrossedOut ? (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        ) : (
                          <div className="w-2 h-0.5 bg-current"></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          



           {/* Answer Choices - Only shown when checked */}
          {isChecked && (
            <div className="space-y-2">
              {options.map((option: any, index: number) => {
                const optionId = option.id || String.fromCharCode(65 + index);
                const isSelected = answers[currentQ.id] === optionId;
                const isCorrect = optionId === currentQ.correct_option;
                const isCrossedOut = isAnswerCrossedOut(optionId);

                return (
                  <div
                    key={optionId}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded border cursor-default transition-all relative",
                      isSelected && isCorrect
                        ? "border-green-500 bg-green-50"
                        : isSelected && !isCorrect
                        ? "border-red-500 bg-red-50"
                        : isCorrect
                        ? "border-green-300 bg-green-25"
                        : "border-gray-300",
                      isCrossedOut && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5",
                        isSelected && isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : isSelected && !isCorrect
                          ? "border-red-500 bg-red-500 text-white"
                          : isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : isCrossedOut
                          ? "border-gray-300 text-gray-400 bg-gray-100"
                          : "border-gray-500 text-gray-700 bg-white"
                      )}
                    >
                      {optionId}
                    </div>
                    <div className={cn(
                      "flex-1 text-base leading-relaxed font-normal",
                      isCrossedOut ? "text-gray-400 line-through" : "text-gray-900"
                    )}>
                      {processLatex(option.text || option)}
                    </div>
                    
                    {/* Strikethrough Circle - Only show when strikethrough mode is active */}
                    {isStrikethroughMode && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAnswerCrossOut(optionId);
                        }}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-110",
                          "animate-in slide-in-from-right-2 fade-in duration-300",
                          isCrossedOut
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-gray-400 bg-white text-gray-600 hover:border-red-400 hover:bg-red-50"
                        )}
                      >
                        {isCrossedOut ? (
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        ) : (
                          <div className="w-1.5 h-0.5 bg-current"></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}




            {/* Explanation Section - After checking */}
            {isChecked && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">{answers[currentQ.id] === currentQ.correct_option ? "👍" : "👎"}</span>
                  Explanation
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-base leading-relaxed text-gray-800">
                    {processLatex(currentQ.explanation?.trim() || "No explanation available for this question.")}
                  </div>
                </div>
              </div>
            )}

            {/* Check Button - Only shown when option is selected and not yet checked */}
            {answers[currentQ.id] && !isChecked && (
              <div className="flex justify-end mt-8">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  onClick={() => {
                    setCheckedQuestions((prev) => new Set(Array.from(prev).concat(currentQuestion)));
                    // Track if the answer is correct
                    const isCorrect = answers[currentQ.id] === currentQ.correct_option;
                    setCorrectAnswers((prev) => ({ ...prev, [currentQuestion]: isCorrect }));
                    // Update performance in parent component
                    onQuestionPerformanceUpdate?.(currentQ.id, isCorrect);
                  }}
                >
                  Check Answer →
                </Button>
              </div>
            )}

            {/* Understanding Button - Only shown when checked */}
            {isChecked && (
              <div className="flex justify-center mt-8">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  onClick={() => {
                    // Move to next question or handle completion
                    if (currentQuestion < questions.length - 1) {
                      goToQuestion(currentQuestion + 1);
                    }
                  }}
                >
                  ✓ I understand this problem
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-2">
        <div className="w-full flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Answered: {Object.keys(answers).length}/{questions.length}
            </span>
            <span>Marked for Review: {markedForReview.size}</span>
          </div>
        </div>
      </div>

      {/* Desmos Calculator Modal */}
      <DesmosCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
      />

      {/* Notepad Modal */}
      <Notepad 
        isOpen={showNotepad} 
        onClose={() => setShowNotepad(false)} 
      />
    </div>
  );

  // Render using portal to break out of any parent containers
  return createPortal(testInterface, document.body);
} 