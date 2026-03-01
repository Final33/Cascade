"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function FAQ() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: "Is this free to use?", 
      a: "Yes! We have a generous forever-free plan that includes access to practice questions, basic analytics, and our community. You can upgrade anytime for AI-powered explanations, unlimited practice, and advanced features."
    },
    { 
      q: "Which courses and subjects are supported?", 
      a: "We support all major AP courses including Calculus AB/BC, Computer Science A, Statistics, Physics, Chemistry, Biology, World History, US History, English Language & Literature, and more. We also cover SAT Math and Reading & Writing."
    },
    { 
      q: "How does the AI tutoring work?", 
      a: "Our AI provides instant, personalized explanations for every question. It adapts to your learning style and identifies knowledge gaps. Plus, our Discord community offers 24/7 peer and expert tutoring support."
    },
    { 
      q: "Can I track my progress over time?", 
      a: "Absolutely! Our analytics dashboard shows your improvement trends, identifies weak areas, tracks study streaks, and provides personalized recommendations to optimize your study plan."
    },
    { 
      q: "Is this suitable for different grade levels?", 
      a: "prepsy is designed for high school students of all levels. Our adaptive difficulty system ensures appropriate challenges whether you're a sophomore starting AP prep or a senior doing final review."
    },
    { 
      q: "How accurate are the practice questions?", 
      a: "Our questions are created by AP teachers and former College Board contributors. They're continuously updated to reflect current exam formats and difficulty levels, ensuring the most realistic practice experience."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-white">
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            FAQ
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.q}
                </h3>
                
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'rotate-180 bg-blue-100' : ''
                }`}>
                  <svg 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-600'
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
          <p className="text-gray-700 mb-6">don't feel like buying?</p>
          <a
            href="https://discord.gg/Zwg47nxxcG"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-blue-600 rounded-xl text-gray-700 font-medium shadow-[0_4px_0_0_rgba(156,163,175,0.6)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
             free tutoring + lively community :)
          </a>
        </div>
      </div>
    </section>
  );
}


