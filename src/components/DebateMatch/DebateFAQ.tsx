"use client";

import { useState } from "react";

export default function DebateFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: "How do I find the right coach for my debate style?", 
      a: "Our matching system considers your experience level, debate format (Policy, LD, PF, etc.), goals, and learning preferences. You can browse coach profiles, read reviews, and schedule trial sessions to find your perfect match."
    },
    { 
      q: "What debate formats do your coaches specialize in?", 
      a: "Our coaches cover all major formats including Policy Debate, Lincoln-Douglas, Public Forum, Parliamentary, World Schools, and more. Each coach's profile clearly lists their specializations and tournament experience."
    },
    { 
      q: "How much does coaching cost?", 
      a: "Coaching rates vary by experience level and session type. Most coaches charge $30-100 per hour, with package deals available. Many offer free 15-minute consultations to discuss your goals and fit."
    },
    { 
      q: "Can I get help with tournament preparation?", 
      a: "Absolutely! Our coaches provide comprehensive tournament prep including case writing, research strategies, cross-examination practice, and mental preparation. Many coaches also offer tournament-day support."
    },
    { 
      q: "Do you have judges available for practice rounds?", 
      a: "Yes! We have experienced judges available for hire who can provide detailed feedback on your arguments, speaking style, and overall performance. Perfect for pre-tournament preparation."
    },
    { 
      q: "What if I'm a complete beginner to debate?", 
      a: "We have coaches who specialize in working with beginners. They'll teach you the fundamentals, help you understand different formats, and build your confidence step by step. Everyone starts somewhere!"
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about finding your debate coach
          </p>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.q}
                </h3>
                
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-180 bg-[#01459f]/10' : ''
                }`}>
                  <svg 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      openIndex === index ? 'text-[#01459f]' : 'text-gray-600'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-200 mb-4" />
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-700 mb-6">Still have questions?</p>
          <a
            href="mailto:support@debatematch.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#01459f] hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}