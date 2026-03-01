"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function Outcomes() {
  const { ref, isIntersecting: inView } = useIntersectionObserver({ threshold: 0.1 });

  const stats = [
    { 
      kpi: "95%", 
      label: "Pass Rate", 
      description: "Students who use prepsy consistently",
      gradient: "from-blue-400 to-cyan-400",
      icon: "🎯"
    },
    { 
      kpi: "+1.2", 
      label: "Average Score Improvement", 
      description: "Points gained on AP exams",
      gradient: "from-cyan-400 to-teal-400",
      icon: "📈"
    },
    { 
      kpi: "50%", 
      label: "Less Study Time", 
      description: "More efficient than traditional methods",
      gradient: "from-teal-400 to-green-400",
      icon: "⚡"
    },
  ];

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/20 via-blue-50/30 to-green-50/20" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative glass-card rounded-3xl p-8 text-center transition-all duration-1000 hover:scale-105 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                
                {/* KPI */}
                <div className="text-5xl md:text-6xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                  {stat.kpi}
                </div>
                
                {/* Label */}
                <div className="text-xl font-bold text-gray-700 mb-3">
                  {stat.label}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {stat.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


