"use client";

import { useState, useEffect } from "react";

export default function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      quote: "I went from never breaking at tournaments to earning my first TOC bid in 8 months. My coach helped me completely rebuild my case structure and cross-ex strategy. Now I'm headed to Harvard with a full debate scholarship.",
      author: "Alex Chen",
      title: "TOC Qualifier • Harvard '25",
      achievement: "TOC Bid + Harvard Admission",
      beforeAfter: "0 breaks → TOC Bid",
      image: "/student-1.jpg",
      coachName: "Sarah Martinez"
    },
    {
      quote: "The judge practice sessions were game-changing. Getting real ballots and feedback from circuit judges helped me understand exactly what they're looking for. I improved my speaker points by 3.2 points in one season.",
      author: "Maya Patel",
      title: "State Champion • Yale '24",
      achievement: "State Championship + Yale Admission",
      beforeAfter: "26.8 avg → 30.0 avg speaker points",
      image: "/student-2.jpg",
      coachName: "Dr. Jennifer Park"
    },
    {
      quote: "My coach didn't just teach me debate theory - they helped me craft a narrative for college applications. The combination of tournament success and compelling essays got me into Stanford with significant financial aid.",
      author: "Jordan Williams",
      title: "National Semifinalist • Stanford '26",
      achievement: "NSDA Semifinals + Stanford Admission",
      beforeAfter: "Local competitor → National semifinalist",
      image: "/student-3.jpg",
      coachName: "Marcus Rodriguez"
    }
  ];

  const outcomes = [
    {
      metric: "89%",
      description: "of students improve speaker points within 3 months",
      icon: "📈"
    },
    {
      metric: "$2.4M",
      description: "in debate scholarships earned by our students",
      icon: "💰"
    },
    {
      metric: "340+",
      description: "TOC bids earned by DebateMatch students",
      icon: "🏆"
    },
    {
      metric: "95%",
      description: "college admission rate for active students",
      icon: "🎓"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Success Stories
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Students earning TOC bids and getting into top colleges.
          </p>
        </div>

        {/* Main Success Story */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <div className="text-center">
              <blockquote className="text-xl md:text-2xl text-gray-900 leading-relaxed font-medium mb-6">
                "{stories[currentStory].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {stories[currentStory].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {stories[currentStory].author}
                  </div>
                  <div className="text-gray-600">
                    {stories[currentStory].title}
                  </div>
                  <div className="text-blue-500 text-sm font-semibold mt-1">
                    {stories[currentStory].achievement}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Navigation */}
        <div className="flex justify-center gap-3 mb-12">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStory(index)}
              className={`transition-all duration-200 ${
                index === currentStory
                  ? "w-8 h-3 bg-blue-500 rounded-full"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {outcomes.map((outcome, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 border border-gray-200 rounded-2xl p-6"
            >
              <div className="text-3xl font-black text-gray-900 mb-2">{outcome.metric}</div>
              <div className="text-gray-600 text-sm">{outcome.description}</div>
            </div>
          ))}
        </div>

        {/* Conversion CTA */}
        <div className="text-center">
          <a
            href="/get-started"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors duration-200"
          >
            Find Your Coach
          </a>
        </div>
      </div>
    </section>
  );
}
