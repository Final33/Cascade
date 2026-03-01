"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function Testimonials() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });

  const testimonials = [
    { 
      quote: "prepsy helped me go from a 3 to a 5 on AP Calc AB. The AI explanations are incredible - it's like having a personal tutor 24/7.",
      name: "Sarah Chen",
      role: "Senior",
      school: "Lincoln High School",
      avatar: "SC",
      score: "AP Calc AB: 5",
      gradient: "from-blue-400 to-cyan-400"
    },
    { 
      quote: "The practice questions are spot-on with the real exam. I felt so prepared walking into my AP Physics test thanks to this platform.",
      name: "Marcus Johnson",
      role: "Junior", 
      school: "Roosevelt Academy",
      avatar: "MJ",
      score: "AP Physics 1: 4",
      gradient: "from-cyan-400 to-teal-400"
    },
    { 
      quote: "As a teacher, I love how engaged my students are. The analytics help me see exactly where they need support.",
      name: "Ms. Rodriguez",
      role: "AP Chemistry Teacher",
      school: "Washington High",
      avatar: "MR",
      score: "95% pass rate",
      gradient: "from-teal-400 to-green-400"
    },
    { 
      quote: "The Discord community is amazing. Getting help from other students and tutors made all the difference in my AP Bio prep.",
      name: "Emma Davis",
      role: "Sophomore",
      school: "Jefferson Prep",
      avatar: "ED",
      score: "AP Biology: 5",
      gradient: "from-green-400 to-emerald-400"
    },
    { 
      quote: "I was struggling with FRQs until I found prepsy. The AI grading and feedback helped me understand exactly what I was missing.",
      name: "Alex Kim",
      role: "Senior",
      school: "Madison High",
      avatar: "AK",
      score: "AP Lang: 4",
      gradient: "from-emerald-400 to-blue-400"
    },
    { 
      quote: "The study streaks and challenges kept me motivated throughout the year. It made studying actually fun for once!",
      name: "Zoe Martinez",
      role: "Junior",
      school: "Franklin Academy",
      avatar: "ZM",
      score: "AP History: 5",
      gradient: "from-blue-400 to-indigo-400"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            loved by thousands
          </div>
          
          <h2 className="mt-6 text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            success <span className="text-green-600">stories</span>
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            real students, real results
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              
              {/* Content */}
              <div className="relative z-10">
                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-8 h-8 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <blockquote className="text-gray-700 leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.school}</div>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-full border border-blue-500/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {testimonial.score}
                </div>
              </div>


            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        {/* <div className={`mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-1200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 mb-2">95%</div>
            <div className="text-gray-600 text-sm">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 mb-2">4.8</div>
            <div className="text-gray-600 text-sm">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600 text-sm">Happy Students</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}


