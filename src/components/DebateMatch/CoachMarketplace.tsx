"use client";

import { useState } from "react";

export default function CoachMarketplace() {
  const [activeFilter, setActiveFilter] = useState("all");

  const coaches = [
    {
      name: "Sarah Chen",
      title: "TOC Champion • Harvard '22",
      specialty: "Policy Debate",
      rate: 85,
      rating: 4.9,
      sessions: 247,
      image: "/coach-1.jpg",
      badges: ["TOC Champion", "National Circuit", "Ivy League"],
      bio: "2x TOC finalist with 4 years coaching experience. Specializes in advanced policy strategy and case construction.",
      availability: "Available today"
    },
    {
      name: "Marcus Rodriguez",
      title: "State Champion • Yale '21",
      specialty: "Lincoln-Douglas",
      rate: 75,
      rating: 4.8,
      sessions: 189,
      image: "/coach-2.jpg",
      badges: ["State Champion", "Philosophy Expert", "Yale Debate"],
      bio: "Former Yale debate captain. Expert in moral philosophy and advanced LD theory.",
      availability: "Available tomorrow"
    },
    {
      name: "Dr. Jennifer Park",
      title: "20+ Years Coaching",
      specialty: "Public Forum",
      rate: 95,
      rating: 5.0,
      sessions: 412,
      image: "/coach-3.jpg",
      badges: ["Master Coach", "Tournament Director", "Published Author"],
      bio: "Head coach at Lincoln High. Author of 'Winning Public Forum Strategies'. 50+ national qualifiers.",
      availability: "Available this week"
    }
  ];

  const filters = [
    { id: "all", label: "All Coaches" },
    { id: "policy", label: "Policy" },
    { id: "ld", label: "Lincoln-Douglas" },
    { id: "pf", label: "Public Forum" },
    { id: "novice", label: "Novice Friendly" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Expert Coaches
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with TOC champions and national circuit veterans.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 border border-gray-200">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeFilter === filter.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coach Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {coaches.map((coach, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-colors duration-200"
            >
              {/* Coach Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {coach.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{coach.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-900 font-semibold text-sm">{coach.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({coach.sessions} sessions)</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {coach.bio}
              </p>

              {/* Specialty & Rate */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-xs font-medium mb-1">Specialty</div>
                  <div className="text-gray-900 font-semibold">{coach.specialty}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs font-medium mb-1">Rate</div>
                  <div className="text-gray-900 font-bold text-lg">${coach.rate}/hr</div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200">
                Book Session
              </button>
            </div>
          ))}
        </div>

        {/* Conversion CTA */}
        <div className="text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
              Join thousands of students working with expert coaches.
            </p>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
