"use client";

const schools = [
  { name: "Harper Valley HS", students: "2.3K+" },
  { name: "North Ridge Academy", students: "1.8K+" },
  { name: "Bayview STEM", students: "3.1K+" },
  { name: "Lincoln Prep", students: "1.5K+" },
  { name: "Evergreen Charter", students: "2.7K+" },
  { name: "Horizon Public Schools", students: "4.2K+" },
  { name: "Summit Academy", students: "1.9K+" },
  { name: "Valley Academy", students: "2.8K+" },
];

export default function Marquee() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-600 shadow-lg mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            trusted by schools nationwide
          </div> */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">join <span className="text-blue-600">10,000+</span> students already succeeding</h2>
        </div>

        {/* Enhanced Marquee */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade */}
          <div className="absolute left-0 top-0 z-10 w-20 h-full bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 z-10 w-20 h-full bg-gradient-to-l from-white to-transparent" />
          
          <div className="whitespace-nowrap will-change-transform animate-[marquee_30s_linear_infinite]">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-8">
                {schools.map((school) => (
                  <div key={`${i}-${school.name}`} className="group inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
                    {/* School Icon */}
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {school.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                    
                    {/* School Info */}
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800">
                        {school.name}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {school.students} students
                      </div>
                    </div>
                    
                    {/* Success indicator */}
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stats Row */}
        {/* <div className="flex items-center justify-center gap-8 mt-8 text-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">95% pass rate</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '1s'}} />
            <span className="text-sm font-medium text-gray-600">4.8/5 rating</span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" style={{animationDelay: '2s'}} />
            <span className="text-sm font-medium text-gray-600">24/7 support</span>
          </div>
        </div> */}
      </div>
      
      <style>{`@keyframes marquee { 0% { transform: translateX(0);} 100% { transform: translateX(-33.333%);} }`}</style>
    </section>
  );
}


