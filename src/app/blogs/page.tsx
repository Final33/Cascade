"use client";

import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import Footer from "@/components/Marketing/Footer";
import Link from "next/link";

export default function BlogsPage() {
  const blogPosts = [
    {
      title: "The Science of Argument Construction: Building Unbreakable Cases",
      excerpt: "Learn the systematic approach to building compelling arguments that judges can't ignore.",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Strategy"
    },
    {
      title: "Tournament Psychology: Managing Pressure in Elimination Rounds",
      excerpt: "Mental strategies used by TOC champions to perform under pressure.",
      date: "March 10, 2024", 
      readTime: "6 min read",
      category: "Performance"
    },
    {
      title: "Evidence Quality vs. Quantity: What Actually Wins Rounds",
      excerpt: "Why one perfectly-cut card beats ten mediocre ones every time.",
      date: "March 5, 2024",
      readTime: "5 min read", 
      category: "Research"
    },
    {
      title: "Judge Adaptation: Reading the Room in Real Time",
      excerpt: "How to adjust your strategy based on judge paradigms and reactions.",
      date: "February 28, 2024",
      readTime: "7 min read",
      category: "Strategy"
    },
    {
      title: "The Economics of Tournament Success: ROI on Coaching Investment",
      excerpt: "Breaking down the scholarship and admissions value of competitive debate.",
      date: "February 22, 2024",
      readTime: "10 min read",
      category: "Career"
    },
    {
      title: "Cross-Examination Mastery: The Art of Strategic Questioning",
      excerpt: "Advanced techniques for extracting concessions and setting up arguments.",
      date: "February 15, 2024",
      readTime: "9 min read",
      category: "Skills"
    }
  ];

  const categories = ["All", "Strategy", "Performance", "Research", "Career", "Skills"];

  return (
    <main className="min-h-screen bg-white">
      <DebateNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 mt-20">
              Blog <span className="text-[#01459f]">Coming Soon...</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Strategic insights, performance psychology, and winning methodologies from 
              championship-level coaches and competitors.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:border-[#01459f] hover:text-[#01459f] transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#01459f]/10 text-[#01459f]">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link 
                      href={`/blogs/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="text-[#01459f] hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      {/* <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Ahead of the Competition
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get weekly insights on debate strategy, tournament updates, and coaching tips delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#01459f] focus:border-transparent"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-[#01459f] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Join 5,000+ debaters getting weekly insights. Unsubscribe anytime.
          </p>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}
