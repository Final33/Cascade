"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function DebateHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[#01459f]/3 to-blue-400/3 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Circular connecting path */}
        <svg className="absolute inset-0 w-full h-full opacity-8" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#01459f" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="75%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#01459f" />
            </linearGradient>
          </defs>
          <ellipse
            cx="600"
            cy="400"
            rx="450"
            ry="280"
            fill="none"
            stroke="url(#circularGradient)"
            strokeWidth="2"
            strokeDasharray="8,12"
            opacity="0.15"
          />
        </svg>
      </div>


 
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900">
              Master the <span className="text-[#01459f]">Debate</span> ecosystem.
          </h1>

          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
            Research evidence, craft winning cases, and prepare for rounds with ease.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Find Your Coach
              </Link>
              <Link
                href="/judges"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 border-2 border-[#01459f] rounded-xl transition-colors duration-200"
              >
                How it works
              </Link>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
