"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Spotlight from "@/components/Marketing/Spotlight";
import Footer from "@/components/Marketing/Footer";

export default function FreeTutoringPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-cyan-50/40" />
      <div className="fixed inset-0 notebook-lines opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-green-100/20" />
      
      <Spotlight />
      
      {/* Header Structure */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50"
            : "bg-white/50 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-xl font-black text-gray-900 tracking-tight">
                <span className="text-green-600">prep</span><span className="text-blue-600">sy :)</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
              >
                Home
              </Link>
              <Link
                href="/mission"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
              >
                Mission
              </Link>
              <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Free Tutoring
              </span>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard/home"
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                get started
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Free Tutoring
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
                Chat with<br />
                Perfect scorers <span className="text-blue-600">daily</span>.
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We empower each other. High schoolers and college students help other high schoolers achieve their academic goals.
              </p>
            </div>
          </div>
        </section>

        {/* Private Tutoring Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                  Private One-on-One Tutoring
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Every student gets a private chat in Discord with tutors who have scored in the <span className="text-blue-600 font-bold">top 1%</span>.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Connect with fellow high schoolers who already mastered the subject you need help with. Our peer tutors scored 5s on their AP exams and understand exactly what it takes to succeed.
                </p>
              </div>
              <div className="relative">
                {/* Placeholder for tutor profile images */}
                <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                  <div className="flex justify-center mb-8">
                    <div className="flex -space-x-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">5</span>
                      </div>
                      <div className="w-20 h-20 bg-green-600 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 z-10">
                        <span className="text-white font-bold text-lg">5</span>
                      </div>
                      <div className="w-20 h-20 bg-cyan-600 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">5</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xl leading-relaxed">
                      <span className="font-bold text-gray-900">Perfect scorers</span> ready to help you succeed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discord Chat Example Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                {/* Placeholder for Discord chat screenshot */}
                <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">T</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">AP Calc Tutor</p>
                        <p className="text-gray-400 text-sm">Perfect Scorer • Online</p>
                      </div>
                    </div>
                    <div className="bg-blue-600 rounded-2xl p-4 mb-4">
                      <p className="text-white">
                        "Let's work through this derivative step by step. First, identify the function type..."
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-2xl p-4">
                      <p className="text-gray-300">
                        "Here's a practice problem set to help you master this concept 📚"
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-center text-sm">
                    example chat with student in our Discord
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                  Daily Check-ins & Support
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  We check in daily, assign practice sets, and review problems just like an in-person tutor. Message us anytime, anywhere — we typically respond <span className="text-blue-600 font-bold">within a few hours</span>!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Personalized study plans</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">24/7 Discord support</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Practice problem reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Speakers Section */}
        <section className="py-20 bg-blue-50/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                Learn from <span className="text-blue-600">Top 25</span> University Students
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our guest speaker events feature college content creators who share their journey from high school to college.
              </p>
            </div>
            
            <div className="flex justify-center mb-12">
              <div className="w-full max-w-4xl rounded-3xl overflow-hidden border-4 border-blue-200 shadow-2xl">
                <img 
                  src="/HenryPan.png" 
                  alt="Guest Speaker Event with Henry Pan" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">College Applications</h3>
                <p className="text-gray-600">Get insider tips on essays, interviews, and standing out</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Study Strategies</h3>
                <p className="text-gray-600">Learn proven methods that got them into top schools</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Life Advice</h3>
                <p className="text-gray-600">Navigate the transition from high school to college</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                  Want to give back?<br />
                  <span className="text-green-600">Become a tutor</span>.
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Need an extracurricular activity and want to tutor other high schoolers in high-level subjects that you mastered?
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Build Leadership Experience</h3>
                      <p className="text-gray-600">Develop mentoring and communication skills</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Make Meaningful Impact</h3>
                      <p className="text-gray-600">Help fellow students achieve their academic goals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Strengthen Your Knowledge</h3>
                      <p className="text-gray-600">Teaching others reinforces your own understanding</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                {/* Placeholder for tutor application visual */}
                <div className="bg-green-50/50 rounded-3xl p-8 border border-green-200">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Tutor Team</h3>
                    <p className="text-gray-600">Help 2,700+ ambitious high schoolers succeed</p>
                  </div>
                  <a
                    href="https://docs.google.com/forms/d/1OqvX_fFHTAGrmqPlYhpdYXq3CLfMxU1BkODwBKw9dGw/edit?pli=1&authuser=0"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
                  >
                    Apply to Tutor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gray-800 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              Ready to join our <span className="text-blue-400">community</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Connect with 2,700+ ambitious high schoolers and get the support you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://discord.gg/Zwg47nxxcG"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-gray-800 bg-white hover:bg-gray-100 rounded-2xl shadow-[0_4px_0_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.30z"/>
                </svg>
                Join Discord Community
              </a>
              <a
                href="/dashboard/home"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Start Learning Free
              </a>
            </div>
            <p className="mt-8 text-gray-400">
              Questions? Reach out to{" "}
              <a 
                href="mailto:aarnavtrivedi@gmail.com" 
                className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors duration-200"
              >
                joshuatp709@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
