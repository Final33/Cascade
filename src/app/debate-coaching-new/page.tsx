"use client";

import Link from "next/link";
import { useState } from "react";
import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import Footer from "@/components/Marketing/Footer";

export default function DebateCoachingPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = [
    {
      id: "foundation",
      name: "Foundation Builder",
      price: "$199/month",
      duration: "3-month program",
      description: "Transform debate fundamentals into competitive advantage",
      outcomes: [
        "Master case construction methodology",
        "Develop evidence evaluation frameworks", 
        "Build cross-examination confidence",
        "Achieve first tournament break"
      ],
      deliverables: [
        "Weekly 1-on-1 coaching sessions (60 min)",
        "Case development workshop series",
        "Evidence research training",
        "Tournament preparation roadmap"
      ],
      idealFor: "Novice to JV debaters seeking structured skill development"
    },
    {
      id: "circuit",
      name: "Circuit Accelerator", 
      price: "$399/month",
      duration: "6-month program",
      description: "Elevate to national circuit competitiveness with strategic depth",
      outcomes: [
        "Qualify for prestigious invitationals",
        "Master advanced argumentation theory",
        "Develop judge adaptation strategies",
        "Achieve consistent elimination rounds"
      ],
      deliverables: [
        "Bi-weekly intensive coaching (90 min)",
        "Advanced case strategy development",  
        "Judge paradigm analysis training",
        "Tournament strategy & prefs optimization"
      ],
      idealFor: "Varsity debaters targeting national circuit success"
    },
    {
      id: "elite",
      name: "Championship Track",
      price: "$799/month", 
      duration: "Full season",
      description: "Elite coaching for TOC qualification and championship performance",
      outcomes: [
        "TOC qualification pathway",
        "Championship round advancement",
        "College recruitment positioning",
        "Scholarship opportunity development"
      ],
      deliverables: [
        "Weekly intensive coaching (2 hours)",
        "Complete case file development",
        "Advanced theory & philosophy training",
        "College admissions strategy integration"
      ],
      idealFor: "Elite debaters pursuing TOC and championship-level success"
    }
  ];

  const coaches = [
    {
      name: "Sarah Chen",
      credentials: "TOC Champion '19, Harvard '23",
      specialty: "Policy Debate & Advanced Theory",
      experience: "5 years coaching, 15 TOC qualifiers",
      achievements: "Former national champion, published debate theory researcher"
    },
    {
      name: "Marcus Rodriguez", 
      credentials: "NDT Finalist '20, Yale '24",
      specialty: "Lincoln-Douglas & Philosophy",
      experience: "4 years coaching, 12 state champions",
      achievements: "Philosophy PhD candidate, ethics in debate expert"
    },
    {
      name: "Dr. Jennifer Park",
      credentials: "20+ years coaching experience",
      specialty: "Public Forum & Communication",
      experience: "Head coach, 50+ national qualifiers",
      achievements: "Published author on debate pedagogy, tournament director"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <DebateNavbar />
      
      {/* Hero Section - Conversion Focused */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Debate Talent Into <span className="text-[#01459f]">Championship Results</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              We help serious debaters achieve tournament success, college admissions advantages, 
              and scholarship opportunities through proven methodology and elite coaching.
            </p>
            
            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-8 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>500+ students coached</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>85% break rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>150+ TOC qualifiers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>$2M+ in scholarships</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/diagnostic-call"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Book Your Diagnostic & Roadmap Call
              </Link>
              <Link
                href="/success-guide"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 border-2 border-[#01459f] rounded-xl transition-all duration-200"
              >
                Download Success Guide
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              $49 diagnostic call • 90-day roadmap included • 100% satisfaction guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Path to Success Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Path to Championship Performance
            </h2>
            <p className="text-xl text-gray-600">
              Our proven 5-stage methodology transforms debate potential into measurable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                stage: "1",
                title: "Diagnostic & Goal Setting",
                description: "Comprehensive skill assessment and tournament goal mapping",
                timeline: "Week 1"
              },
              {
                stage: "2", 
                title: "Foundation Mastery",
                description: "Evidence evaluation, case construction, and argument frameworks",
                timeline: "Weeks 2-6"
              },
              {
                stage: "3",
                title: "Strategic Development", 
                description: "Advanced theory, judge adaptation, and competitive positioning",
                timeline: "Weeks 7-12"
              },
              {
                stage: "4",
                title: "Tournament Execution",
                description: "Live coaching, prefs strategy, and performance optimization",
                timeline: "Weeks 13-20"
              },
              {
                stage: "5",
                title: "Results & Advancement",
                description: "Tournament success, qualification achievement, and next-level planning",
                timeline: "Weeks 21+"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#01459f] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.stage}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                <p className="text-[#01459f] font-medium text-sm">{step.timeline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Championship Path
            </h2>
            <p className="text-xl text-gray-600">
              Structured programs designed for specific skill levels and competitive goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div 
                key={program.id}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedProgram === program.id 
                    ? 'border-[#01459f] shadow-xl' 
                    : 'border-gray-200 hover:border-[#01459f]/50 hover:shadow-lg'
                }`}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.name}</h3>
                  <div className="text-3xl font-bold text-[#01459f] mb-1">{program.price}</div>
                  <div className="text-gray-600 text-sm">{program.duration}</div>
                </div>

                <p className="text-gray-700 mb-6 text-center">{program.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Guaranteed Outcomes:</h4>
                    <ul className="space-y-1">
                      {program.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-[#01459f] rounded-full mt-2 flex-shrink-0"></div>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedProgram === program.id && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Program Includes:</h4>
                      <ul className="space-y-1 mb-4">
                        {program.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 italic">{program.idealFor}</p>
                    </div>
                  )}
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-[#01459f] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200">
                  Start {program.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Credentials */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn From Champions
            </h2>
            <p className="text-xl text-gray-600">
              Our coaches are former national champions, PhD researchers, and tournament directors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coaches.map((coach, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#01459f] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {coach.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{coach.name}</h3>
                  <p className="text-[#01459f] font-medium">{coach.credentials}</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Specialty: </span>
                    <span className="text-gray-600">{coach.specialty}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Experience: </span>
                    <span className="text-gray-600">{coach.experience}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Achievements: </span>
                    <span className="text-gray-600">{coach.achievements}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics Charter */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Coaching Ethics Charter
            </h2>
            <p className="text-xl text-gray-600">
              Transparent standards that ensure integrity and educational value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">What We Do:</h3>
              <ul className="space-y-3">
                {[
                  "Teach research methodology and source evaluation",
                  "Develop original argumentation strategies",
                  "Provide feedback on student-written cases",
                  "Coach presentation and cross-examination skills",
                  "Guide tournament strategy and judge adaptation"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">What We Don't Do:</h3>
              <ul className="space-y-3">
                {[
                  "Write cases or arguments for students",
                  "Fabricate or misrepresent evidence",
                  "Encourage unethical debate practices",
                  "Bypass school or tournament rules",
                  "Guarantee specific tournament outcomes"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Proof */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proven Results That Matter
            </h2>
            <p className="text-xl text-gray-600">
              Quantified outcomes from our coaching programs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-[#01459f] mb-2">85%</div>
              <div className="text-gray-600">Tournament Break Rate</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-[#01459f] mb-2">150+</div>
              <div className="text-gray-600">TOC Qualifiers</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-[#01459f] mb-2">$2M+</div>
              <div className="text-gray-600">Scholarships Earned</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-[#01459f] mb-2">95%</div>
              <div className="text-gray-600">College Admission Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#01459f]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Debate Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with a comprehensive diagnostic call and receive your personalized 90-day roadmap to tournament success.
          </p>
          
          <Link
            href="/diagnostic-call"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Book Your Diagnostic Call - $49
          </Link>
          
          <p className="text-blue-100 text-sm mt-4">
            100% satisfaction guarantee • Full refund if no actionable roadmap delivered
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
