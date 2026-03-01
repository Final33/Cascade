"use client";

import { useState } from "react";

export default function DebateFeatures() {
  const [activeTab, setActiveTab] = useState("coaching");

  const features = {
    coaching: [
      {
        title: "1-on-1 Live Coaching",
        description: "Get personalized feedback from TOC champions and national circuit coaches in real-time.",
        icon: "🎯"
      },
      {
        title: "Round Simulations",
        description: "Practice with realistic tournament conditions, complete with judge feedback and speaker points.",
        icon: "🏛️"
      },
      {
        title: "Case Development",
        description: "Build winning cases with expert guidance on research, structure, and strategic positioning.",
        icon: "📋"
      },
      {
        title: "Cross-Ex Mastery",
        description: "Master the art of cross-examination with targeted drills and strategic questioning techniques.",
        icon: "❓"
      }
    ],
    analytics: [
      {
        title: "Speaking Analytics",
        description: "Track your pace, clarity, and delivery with AI-powered speech analysis and improvement suggestions.",
        icon: "📊"
      },
      {
        title: "Argument Mapping",
        description: "Visualize your argument structure and identify logical gaps before they cost you rounds.",
        icon: "🗺️"
      },
      {
        title: "Judge Feedback Trends",
        description: "Understand what judges consistently praise or critique in your performance across tournaments.",
        icon: "📈"
      },
      {
        title: "Tournament Prep Dashboard",
        description: "Get personalized prep recommendations based on your upcoming tournament format and judges.",
        icon: "🎯"
      }
    ],
    community: [
      {
        title: "Practice Partner Matching",
        description: "Find debate partners at your skill level for regular scrimmages and case testing.",
        icon: "🤝"
      },
      {
        title: "Judge Pool Access",
        description: "Practice with real judges from the national circuit who provide authentic tournament feedback.",
        icon: "⚖️"
      },
      {
        title: "Team Workshops",
        description: "Join group sessions on advanced topics like theory, kritiks, and circuit-specific strategies.",
        icon: "👥"
      },
      {
        title: "Tournament Bootcamps",
        description: "Intensive prep sessions before major tournaments with coaches and former champions.",
        icon: "🏕️"
      }
    ]
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Everything You Need to Win Rounds
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From beginner fundamentals to national circuit mastery, our platform provides the tools and coaching to elevate your debate performance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-2xl p-1">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "coaching" && "Live Coaching"}
                {tab === "analytics" && "Performance Analytics"}
                {tab === "community" && "Debate Community"}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-800 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Join 10,000+ debaters already improving their skills
          </div>
          <div>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Start Your Coaching Journey
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
