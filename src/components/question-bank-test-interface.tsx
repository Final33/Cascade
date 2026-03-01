"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface QuestionBankTestInterfaceProps {
  questions: any[]; // Array of question objects with label, unit, topic, question_text, id
  startIndex?: number;
}

export function QuestionBankTestInterface({ questions, startIndex = 0 }: QuestionBankTestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(startIndex);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Navigation handlers
  const goToQuestion = (idx: number) => setCurrentQuestion(idx);
  const goNext = () => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
  const goPrev = () => setCurrentQuestion((prev) => Math.max(0, prev - 1));

  // Handle answer change
  const handleAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: val }));
  };

  // Progress
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Sidebar/Table of Questions */}
      <div className="md:w-1/3 w-full md:border-r border-b md:border-b-0 bg-gray-50">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Label</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Topic</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr
                  key={q.id}
                  className={cn(
                    "cursor-pointer hover:bg-blue-100 transition",
                    idx === currentQuestion ? "bg-blue-50 font-semibold" : ""
                  )}
                  onClick={() => goToQuestion(idx)}
                >
                  <td className="px-4 py-2">Q{q.label}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block rounded-full bg-purple-600 text-white text-xs font-bold px-3 py-1">
                      {q.unit}
                    </span>
                  </td>
                  <td className="px-4 py-2">{q.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Main Question Area */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="prose max-w-none mb-4">
            <h2 className="text-xl font-semibold mb-2">Q{questions[currentQuestion].label}: {questions[currentQuestion].topic}</h2>
            <div className="text-gray-700 text-base whitespace-pre-line">
              {questions[currentQuestion].question_text || "No question text provided."}
            </div>
          </div>
        </div>
        <Textarea
          id="response-area"
          placeholder="Type your response here..."
          value={answers[questions[currentQuestion].id] || ""}
          onChange={(e) => handleAnswer(e.target.value)}
          className="min-h-[200px] w-full resize-y font-mono text-sm p-4 mb-6"
        />
        {/* Navigation */}
        <div className="flex items-center justify-between mt-auto">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionBankTestInterface; 