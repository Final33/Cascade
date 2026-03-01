"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const question = {
  stem: "If f(x) = 3x² - 2x + 1, what is the value of f'(2)?",
  choices: [
    { label: "A", text: "8", correct: false },
    { label: "B", text: "10", correct: true },
    { label: "C", text: "12", correct: false },
    { label: "D", text: "14", correct: false },
  ],
  rationale: "To find f'(2), first find the derivative: f'(x) = 6x - 2. Then substitute x = 2: f'(2) = 6(2) - 2 = 12 - 2 = 10.",
  subject: "AP Calculus AB",
  difficulty: "Medium"
};

export default function LiveDemo() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });
  const [picked, setPicked] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (picked) {
      const timer = setTimeout(() => setShowExplanation(true), 500);
      return () => clearTimeout(timer);
    }
  }, [picked]);

  const handleReset = () => {
    setPicked(null);
    setShowExplanation(false);
  };

  return (
    <section id="demo" className="py-24 bg-white">
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            interactive demo
          </div>
          
          <h2 className="mt-6 text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            see it in <span className="text-blue-600">action</span>
          </h2>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            get a taste of our instant feedback system
          </p>
        </div>

        {/* Demo Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12">
          {/* Question Header */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-blue-600 font-semibold text-sm">{question.subject}</span>
            </div>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-300">
              {question.difficulty}
            </div>
            {picked && (
              <button
                onClick={handleReset}
                className="ml-auto px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                Try Again
              </button>
            )}
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {question.stem}
            </h3>
          </div>

          {/* Answer Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {question.choices.map((choice, index) => {
              const chosen = picked === choice.label;
              const correct = choice.correct;
              const isRevealed = picked !== null;
              
              let stateClasses = "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400";
              
              if (isRevealed) {
                if (correct) {
                  stateClasses = "border-green-400 bg-green-400/20 shadow-lg shadow-green-400/25";
                } else if (chosen) {
                  stateClasses = "border-red-400 bg-red-400/20 shadow-lg shadow-red-400/25";
                } else {
                  stateClasses = "border-gray-200 bg-gray-100 opacity-60";
                }
              }

              return (
                <button
                  key={choice.label}
                  onClick={() => !picked && setPicked(choice.label)}
                  disabled={picked !== null}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 ${stateClasses}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isRevealed && correct 
                        ? "border-green-400 bg-green-400 text-black" 
                        : isRevealed && chosen 
                        ? "border-red-400 bg-red-400 text-white"
                        : "border-gray-400 text-gray-700"
                    }`}>
                      {isRevealed && correct ? "✓" : isRevealed && chosen ? "✗" : choice.label}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      isRevealed && correct 
                        ? "text-green-700" 
                        : isRevealed && chosen 
                        ? "text-red-700"
                        : "text-gray-900"
                    }`}>
                      {choice.text}
                    </span>
                  </div>
                  

                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="relative overflow-hidden">
              <div className={`p-6 rounded-2xl border border-green-400/30 bg-green-400/10 backdrop-blur-sm transition-all duration-700 ${showExplanation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-700 font-bold mb-2">Explanation</h4>
                    <p className="text-gray-800 leading-relaxed">{question.rationale}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {!picked && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">Select an answer to see the explanation</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {/* <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-gray-600 mb-6">ready to practice with thousands more questions?</p>
          <a
            href="/dashboard/home"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-2xl hover:shadow-blue-400/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <span className="relative z-10">Start Practicing Free</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          </a>
        </div> */}
      </div>
    </section>
  );
}


