"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const demoScenario = {
  situation: "You're in cross-examination and your opponent just claimed: 'Economic sanctions never work because they hurt innocent civilians more than governments.'",
  responses: [
    { 
      label: "A", 
      text: "But sanctions worked against South Africa during apartheid!", 
      quality: "weak",
      feedback: "This is a single example that doesn't address their broader claim. Your opponent can easily dismiss this as an exception."
    },
    { 
      label: "B", 
      text: "So you're saying we should never try to pressure authoritarian regimes?", 
      quality: "good",
      feedback: "Good strategic question that forces them to defend an extreme position, but could be stronger with evidence."
    },
    { 
      label: "C", 
      text: "The Peterson study from 2019 shows targeted sanctions achieve policy changes in 34% of cases while minimizing civilian impact through smart targeting. How do you account for this data?", 
      quality: "excellent",
      feedback: "Excellent! You cited specific evidence, provided a statistic, addressed their concern about civilians, and ended with a direct question they must answer."
    },
    { 
      label: "D", 
      text: "That's not true, sanctions work all the time.", 
      quality: "weak",
      feedback: "Too vague and confrontational. No evidence provided and you're making an absolute claim that's easy to attack."
    },
  ],
  context: "Policy Debate - Sanctions Topic",
  skill: "Cross-Examination Strategy"
};

export default function DebateDemo() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });
  const [picked, setPicked] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (picked) {
      const timer = setTimeout(() => setShowFeedback(true), 500);
      return () => clearTimeout(timer);
    }
  }, [picked]);

  const handleReset = () => {
    setPicked(null);
    setShowFeedback(false);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "weak": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "excellent": return "🏆";
      case "good": return "👍";
      case "weak": return "⚠️";
      default: return "❓";
    }
  };

  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            interactive coaching demo
          </div>
          
          <h2 className="mt-6 text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            see coaching in <span className="text-blue-600">action</span>
          </h2>
          
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our AI-powered coaching provides instant feedback on your debate performance. Try this cross-examination scenario:
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Interface */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500">DebateMatch Coaching</div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {demoScenario.context}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {demoScenario.skill}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">🎯 Scenario:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {demoScenario.situation}
                </p>
              </div>

              <h4 className="font-bold text-gray-900 mb-4">How would you respond?</h4>
              
              <div className="space-y-3">
                {demoScenario.responses.map((response) => (
                  <button
                    key={response.label}
                    onClick={() => setPicked(response.label)}
                    disabled={picked !== null}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                      picked === response.label
                        ? `${getQualityColor(response.quality)} border-current`
                        : picked
                        ? "border-gray-200 bg-gray-50 text-gray-400"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-lg">{response.label}</span>
                      <span className="flex-1">{response.text}</span>
                      {picked === response.label && (
                        <span className="text-xl">{getQualityIcon(response.quality)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {picked && (
                <button
                  onClick={handleReset}
                  className="mt-6 w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-300"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🤖 AI Coach Feedback
              </h3>
              
              {!picked ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Select a response to see instant coaching feedback
                  </p>
                </div>
              ) : (
                <div className={`transition-all duration-500 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}>
                  {showFeedback && (
                    <>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${
                        getQualityColor(demoScenario.responses.find(r => r.label === picked)?.quality || "")
                      }`}>
                        <span>{getQualityIcon(demoScenario.responses.find(r => r.label === picked)?.quality || "")}</span>
                        <span className="font-semibold capitalize">
                          {demoScenario.responses.find(r => r.label === picked)?.quality} Response
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {demoScenario.responses.find(r => r.label === picked)?.feedback}
                      </p>

                      <div className="bg-blue-50 rounded-2xl p-6">
                        <h4 className="font-bold text-blue-900 mb-3">💡 Key Learning:</h4>
                        <p className="text-blue-800">
                          The best cross-examination questions combine specific evidence, address opponent concerns, and end with a direct question they must answer. This forces them into a defensive position while demonstrating your preparation.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Features Highlight */}
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                This is just the beginning
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time feedback on full practice rounds
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1-on-1 coaching with TOC champions
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tournament prep with real judges
                </li>
              </ul>
              <a
                href="/get-started"
                className="inline-flex items-center justify-center w-full py-3 px-6 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                Start Your Coaching Journey
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
