"use client";

import { useState } from "react";

const ecosystemFeatures = [
  {
    icon: "🧠",
    title: "AI Research Assistant",
    description: "Smart evidence cutting and case building with GPT-4",
    stat: "50K+ cards"
  },
  {
    icon: "🏆",
    title: "Tournament Hub",
    description: "Discover, register, and track all competitions",
    stat: "500+ tournaments"
  },
  {
    icon: "👨‍🏫",
    title: "Expert Coaching",
    description: "Connect with TOC champions and veteran coaches",
    stat: "95% success rate"
  },
  {
    icon: "🎯",
    title: "Practice Rounds",
    description: "Find practice partners and get real-time feedback",
    stat: "24/7 matching"
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    description: "Track progress with detailed insights and metrics",
    stat: "Real-time data"
  },
  {
    icon: "⚖️",
    title: "Judge Intelligence",
    description: "Comprehensive paradigm database and ratings",
    stat: "10K+ judges"
  }
];

export default function EcosystemOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to <span className="text-[#01459f]">win</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clusion brings together AI-powered research, expert coaching, tournament management, 
            and performance analytics in one seamless platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-[#01459f]/20 hover:-translate-y-1 cursor-pointer ${
                hoveredIndex === index ? 'shadow-xl border-[#01459f]/20 -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#01459f]/10 text-[#01459f] text-sm font-medium">
                  {feature.stat}
                </div>
              </div>
              
              {/* Hover effect gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#01459f]/5 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
