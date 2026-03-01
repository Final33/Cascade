"use client";

import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function Features() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });

  const features = [
    { 
      title: "AI-Powered Practice", 
      desc: "Get personalized questions that adapt to your learning style and target your weak spots.",
      icon: "🧠",
      gradient: "from-blue-400 to-cyan-400"
    },
    { 
      title: "Instant Feedback", 
      desc: "Understand your mistakes immediately with detailed explanations and step-by-step solutions.",
      icon: "⚡",
      gradient: "from-cyan-400 to-teal-400"
    },
    { 
      title: "Real Exam Simulation", 
      desc: "Practice with timed tests that mirror the actual AP exam format and difficulty.",
      icon: "📊",
      gradient: "from-teal-400 to-green-400"
    },
    { 
      title: "24/7 Tutoring", 
      desc: "Get help from expert tutors and peer mentors whenever you need it through Discord.",
      icon: "🎓",
      gradient: "from-green-400 to-emerald-400"
    },
    { 
      title: "Progress Analytics", 
      desc: "Track your improvement with detailed analytics and personalized study recommendations.",
      icon: "📈",
      gradient: "from-emerald-400 to-blue-400"
    },
    { 
      title: "Study Community", 
      desc: "Join study groups, participate in challenges, and learn with thousands of motivated students.",
      icon: "👥",
      gradient: "from-blue-400 to-indigo-400"
    },
  ];

  return (
    <section id="features" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-green-50/20 to-cyan-50/30" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-600 shadow-lg transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Everything you need to succeed
          </div>
          
          <h2 className={`mt-6 text-4xl md:text-6xl font-black text-gray-900 tracking-tight transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Built for <span className="gradient-text-blue">Excellence</span>
          </h2>
          
          <p className={`mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Every feature is designed to help you master AP exams faster and more effectively than traditional study methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative glass-card rounded-3xl p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="relative mb-6">
                  <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${feature.gradient} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300`} />
                  <div className="relative w-16 h-16 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="absolute inset-0 rounded-3xl shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 text-gray-500 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-20" />
              <span className="text-sm font-medium">Ready to get started?</span>
              <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-20" />
            </div>
            <p className="text-gray-600 mb-6">Join thousands of students already improving their AP scores with prepsy</p>
            <Link
              href="/dashboard/home"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-xl shadow-[0_4px_0_0_rgba(29,78,216,0.8)] hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
            >
              Start Your Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


