"use client";

import { useState, useEffect } from "react";

export default function DebateTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "DebateMatch helped me break at TOC my junior year. The 1-on-1 coaching sessions were game-changing - my coach helped me refine my cross-ex strategy and I went from clearing at locals to semifinals at nationals.",
      author: "Sarah Chen",
      title: "TOC Semifinalist, Harvard '25",
      achievement: "🏆 TOC Semifinalist",
      image: "/testimonial-1.jpg"
    },
    {
      quote: "The round simulations felt exactly like real tournaments. Having access to actual circuit judges for practice rounds gave me the confidence to perform under pressure. I improved my speaker points by 2 full points in one season.",
      author: "Marcus Rodriguez",
      title: "State Champion, Yale '24",
      achievement: "🥇 State Champion",
      image: "/testimonial-2.jpg"
    },
    {
      quote: "As a coach, DebateMatch has revolutionized how I work with students. The analytics dashboard shows me exactly where each debater needs improvement, and the scheduling system makes 1-on-1s seamless.",
      author: "Dr. Jennifer Park",
      title: "Head Coach, Lincoln High School",
      achievement: "🎓 20+ Years Coaching",
      image: "/testimonial-3.jpg"
    },
    {
      quote: "I went from never breaking at tournaments to winning my first bid in 6 months. The case development workshops and argument mapping tools helped me build cases that actually win rounds.",
      author: "Alex Thompson",
      title: "Bid Winner, Stanford '26",
      achievement: "🎯 First Bid Winner",
      image: "/testimonial-4.jpg"
    },
    {
      quote: "The judge feedback system is incredible. Instead of wondering what went wrong after a loss, I get detailed analytics on my speaking, argument structure, and strategic choices. It's like having a coach in every round.",
      author: "Maya Patel",
      title: "Circuit Debater, MIT '25",
      achievement: "📈 +3.2 Speaker Points",
      image: "/testimonial-5.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Success Stories from Champions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From first-time breakers to TOC champions, see how debaters across the country are achieving their goals with DebateMatch.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
            <div className="text-center">
              <div className="text-6xl text-blue-600 mb-6">"</div>
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                {testimonials[currentTestimonial].quote}
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonials[currentTestimonial].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].title}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">
                    {testimonials[currentTestimonial].achievement}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center gap-3 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-black text-blue-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Tournament Wins</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-black text-green-600 mb-2">$2M+</div>
            <div className="text-gray-600 font-medium">Scholarships Earned</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-black text-purple-600 mb-2">95%</div>
            <div className="text-gray-600 font-medium">Improved Speaker Points</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-black text-orange-600 mb-2">200+</div>
            <div className="text-gray-600 font-medium">TOC Qualifiers</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-6 py-3 text-sm font-semibold text-green-800 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Your success story could be next
          </div>
          <div>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Join the Winners Circle
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
