"use client";

import Link from "next/link";
import { useState } from "react";
import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import Footer from "@/components/Marketing/Footer";

export default function ParentDebateCoachingPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ecosystemFeatures = [
    {
      icon: "🔍",
      title: "Smart Coach Matching",
      description: "Our platform matches your child with the perfect coach based on goals, style, and experience",
      stat: "200+ coaches",
      parentBenefit: "Find the ideal coach fit for your child's success"
    },
    {
      icon: "⭐",
      title: "Verified Coach Profiles",
      description: "Browse detailed profiles with credentials, specialties, ratings, and student success stories",
      stat: "4.8+ avg rating",
      parentBenefit: "Choose from only the highest-rated coaches"
    },
    {
      icon: "📅",
      title: "Flexible Scheduling",
      description: "Book sessions that work with your family's schedule through our easy booking system",
      stat: "24/7 booking",
      parentBenefit: "Convenient scheduling that fits your life"
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description: "Message coaches directly, track progress, and stay updated on your child's development",
      stat: "Real-time chat",
      parentBenefit: "Stay connected with your child's coaching journey"
    },
    {
      icon: "🏆",
      title: "Success Tracking",
      description: "Monitor tournament results, skill improvements, and scholarship opportunities",
      stat: "95% success rate",
      parentBenefit: "See measurable results from your investment"
    },
    {
      icon: "🎓",
      title: "College Guidance",
      description: "Many coaches provide college application support and scholarship guidance",
      stat: "$2M+ earned",
      parentBenefit: "Turn debate success into college opportunities"
    }
  ];

  const parentTestimonials = [
    {
      quote: "Through Clusion, we found an amazing coach who helped my daughter earn a full ride to Northwestern. The platform made finding the right match so easy.",
      author: "Jennifer Martinez",
      role: "Parent, Northwestern Scholar",
      avatar: "JM"
    },
    {
      quote: "The coaches on Clusion don't just teach debate - they develop leaders. My son's transformation has been incredible to watch.",
      author: "Robert Chen", 
      role: "Parent, Harvard-Westlake",
      avatar: "RC"
    },
    {
      quote: "We tried other coaching services, but Clusion's platform and coach quality are in a different league. Worth every penny.",
      author: "Sarah Johnson",
      role: "Parent, Stanford Admit", 
      avatar: "SJ"
    }
  ];

  const availableCoaches = [
    {
      name: "Sarah Chen",
      credentials: "TOC Champion '19, Harvard '23",
      specialty: "Policy Debate & Advanced Theory",
      experience: "5 years coaching",
      achievements: "15 TOC qualifiers, $500K+ scholarships earned",
      rating: "4.9",
      sessions: "200+"
    },
    {
      name: "Marcus Rodriguez", 
      credentials: "NDT Finalist '20, Yale '24",
      specialty: "Lincoln-Douglas & Philosophy",
      experience: "4 years coaching",
      achievements: "12 state champions, $300K+ scholarships",
      rating: "4.8",
      sessions: "150+"
    },
    {
      name: "Dr. Jennifer Park",
      credentials: "20+ years coaching experience",
      specialty: "Public Forum & Communication",
      experience: "Head coach experience",
      achievements: "50+ national qualifiers, tournament director",
      rating: "4.9",
      sessions: "500+"
    },
    {
      name: "Alex Thompson",
      credentials: "NSDA Champion '18, Stanford '22",
      specialty: "Cross-Examination & Research",
      experience: "3 years coaching",
      achievements: "8 TOC qualifiers, research methodology expert",
      rating: "4.7",
      sessions: "100+"
    },
    {
      name: "Emily Rodriguez",
      credentials: "National Circuit Finalist, Northwestern '21",
      specialty: "Novice Development & Fundamentals",
      experience: "4 years coaching",
      achievements: "25+ first-year breakers, skill building specialist",
      rating: "4.8",
      sessions: "180+"
    },
    {
      name: "David Kim",
      credentials: "TOC Semifinalist '17, MIT '21",
      specialty: "STEM Argumentation & Tech Policy",
      experience: "5 years coaching",
      achievements: "Tech policy expert, 20+ qualifiers",
      rating: "4.9",
      sessions: "220+"
    }
  ];

  return (
    <main className="relative min-h-screen bg-white">
      <DebateNavbar />
      
      {/* Hero Section - Matching Main Landing Page Structure */}
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
              Find your child's <span className="text-[#01459f]">dream</span> debate coach.
            </h1>

            <div className="mt-6 max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with elite debate coaches who will help your child achieve tournament success, 
                build confidence, and unlock scholarship opportunities.
              </p>
            </div>

            {/* Parent Trust Signals */}
            {/* <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>200+ expert coaches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>$2.3M+ in scholarships earned</span>
                  </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>1,000+ successful students</span>
              </div>
            </div> */}

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Our Coaches
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 border-2 border-[#01459f] rounded-xl transition-colors duration-200"
                >
                  How it works
                </Link>
              </div>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section - Matching EcosystemOverview */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to find the <span className="text-[#01459f]">perfect</span> coach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to discover, connect with, and book sessions with 
              elite debate coaches who match your child's specific goals and learning style.
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
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#01459f]/10 text-[#01459f] text-sm font-medium mb-3">
                    {feature.stat}
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    {feature.parentBenefit}
                  </div>
                </div>
                
                {/* Hover effect gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#01459f]/5 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Showcase Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet our <span className="text-[#01459f]">elite</span> coaches
            </h2>
            <p className="text-xl text-gray-600">
              Browse profiles of champion debaters and experienced coaches ready to help your child succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCoaches.map((coach, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-xl hover:border-[#01459f]/20 transition-all duration-300"
              >
                {/* Coach Avatar */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#01459f] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {coach.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
                  <p className="text-[#01459f] font-medium text-sm mb-2">{coach.credentials}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium text-gray-700">{coach.rating}</span>
                    <span className="text-xs text-gray-500">({coach.sessions} sessions)</span>
                  </div>
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
                    <span className="font-semibold text-gray-900">Results: </span>
                    <span className="text-gray-600">{coach.achievements}</span>
                  </div>
                  </div>

                <button className="w-full mt-6 px-4 py-2 bg-[#01459f] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm">
                  View Profile
                </button>
                
                {/* Hover effect gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#01459f]/5 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Browse All 200+ Coaches
            </Link>
          </div>
        </div>
      </section>

      {/* Parent Testimonials - Matching SimpleTestimonials Structure */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-[#01459f]">families</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what parents are saying about their children's success on Clusion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                {/* Quote */}
                <div className="mb-6">
                  <div className="text-[#01459f] text-4xl font-serif mb-4">"</div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {testimonial.quote}
                  </p>
        </div>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#01459f] flex items-center justify-center text-white font-semibold text-sm mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                  </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role}
                  </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#01459f]/5 to-blue-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
              </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#01459f]">95%</div>
              <div className="text-gray-600 text-sm">College Acceptance</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01459f]">1K+</div>
              <div className="text-gray-600 text-sm">Students Coached</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01459f]">$45K</div>
              <div className="text-gray-600 text-sm">Avg. Scholarships</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01459f]">200+</div>
              <div className="text-gray-600 text-sm">Elite Coaches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Platform CTA - Matching SimpleCTA Structure */}
      <section className="py-24 bg-gradient-to-br from-[#01459f] to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to find your child's dream coach?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have found success through our coaching platform. 
            Browse profiles, read reviews, and book your first session today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join Our Platform
            </Link>
            <Link
              href="/browse-coaches"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              Browse Coaches
            </Link>
          </div>
          
          <p className="text-blue-100 text-sm">
            Create your account • Browse coach profiles • Book your first session • No setup fees
          </p>
    </div>
      </section>

      <Footer />
    </main>
  );
}