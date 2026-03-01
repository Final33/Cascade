"use client";

import { useState } from "react";

export default function JudgeMarketplace() {
  const [activeFilter, setActiveFilter] = useState("all");

  const judges = [
    {
      name: "Dr. Michael Thompson",
      title: "Former TOC Director • 25+ Years",
      specialty: "Policy & LD",
      rate: 120,
      rating: 5.0,
      sessions: 340,
      image: "/judge-1.jpg",
      badges: ["TOC Director", "National Circuit", "Published Author"],
      bio: "Former Tournament of Champions Director with 25 years of judging experience. Expert in policy debate and Lincoln-Douglas with over 500 rounds judged at national tournaments.",
      availability: "Available this weekend",
      experience: "25+ years",
      tournaments: ["TOC", "NSDA Nationals", "Harvard", "Yale", "Stanford"]
    },
    {
      name: "Judge Sarah Kim",
      title: "Circuit Judge • Stanford '18",
      specialty: "Public Forum",
      rate: 95,
      rating: 4.9,
      sessions: 185,
      image: "/judge-2.jpg",
      badges: ["Circuit Judge", "Stanford Debate", "PF Expert"],
      bio: "Former Stanford debater and current circuit judge specializing in Public Forum. Known for detailed feedback and fair evaluation of progressive arguments.",
      availability: "Available today",
      experience: "8 years",
      tournaments: ["Berkeley", "Glenbrooks", "TOC", "NSDA"]
    },
    {
      name: "Prof. James Rodriguez",
      title: "University Professor • Yale '15",
      specialty: "All Events",
      rate: 110,
      rating: 4.8,
      sessions: 267,
      image: "/judge-3.jpg",
      badges: ["Professor", "Multi-Event", "Yale Debate"],
      bio: "Communication professor and former Yale debater. Judges all debate events with expertise in argumentation theory and public speaking evaluation.",
      availability: "Available next week",
      experience: "12 years",
      tournaments: ["Yale", "Harvard", "Princeton", "Columbia"]
    }
  ];

  const filters = [
    { id: "all", label: "All Judges" },
    { id: "policy", label: "Policy" },
    { id: "ld", label: "Lincoln-Douglas" },
    { id: "pf", label: "Public Forum" },
    { id: "experienced", label: "15+ Years" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Expert <span className="text-[#01459f]">Judges</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hire experienced judges for practice rounds, tournaments, and feedback sessions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeFilter === filter.id
                    ? "bg-[#01459f] text-white shadow-md"
                    : "text-gray-600 hover:text-[#01459f]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Judge Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {judges.map((judge, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#01459f]/30 hover:shadow-lg transition-all duration-200"
            >
              {/* Judge Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#01459f] to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {judge.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{judge.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{judge.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-900 font-semibold text-sm">{judge.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({judge.sessions} rounds)</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {judge.bio}
              </p>

              {/* Experience & Tournaments */}
              <div className="mb-4">
                <div className="text-gray-500 text-xs font-medium mb-2">Tournament Experience</div>
                <div className="flex flex-wrap gap-1">
                  {judge.tournaments.slice(0, 3).map((tournament, i) => (
                    <span key={i} className="px-2 py-1 bg-[#01459f]/10 text-[#01459f] text-xs rounded-md font-medium">
                      {tournament}
                    </span>
                  ))}
                  {judge.tournaments.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{judge.tournaments.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Specialty & Rate */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-xs font-medium mb-1">Specialty</div>
                  <div className="text-gray-900 font-semibold">{judge.specialty}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs font-medium mb-1">Rate</div>
                  <div className="text-gray-900 font-bold text-lg">${judge.rate}/round</div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-600 text-sm font-medium">{judge.availability}</span>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3 px-6 bg-[#01459f] hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg">
                Hire Judge
              </button>
            </div>
          ))}
        </div>

        {/* Judge Benefits */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Hire Professional Judges?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#01459f] to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                📝
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Detailed Feedback</h4>
              <p className="text-gray-600 text-sm">
                Get comprehensive written feedback on arguments, delivery, and strategy from experienced judges.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                🎯
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Tournament Prep</h4>
              <p className="text-gray-600 text-sm">
                Practice with judges who regularly judge at national tournaments and understand current trends.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                ⚡
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Flexible Scheduling</h4>
              <p className="text-gray-600 text-sm">
                Book judges for practice rounds, mock tournaments, or feedback sessions at your convenience.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#01459f]/5 to-blue-100/50 border border-[#01459f]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Elevate Your Debate?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
              Connect with professional judges and get the feedback you need to win.
            </p>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Find Judges
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
