"use client";

export default function ClusionMission() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Our Mission
          </h2>
        </div>
        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <p>
            We founded <span className="font-semibold text-[#01459f]">Clusion</span> with one mission: make <span className="font-bold text-gray-900">elite debate coaching</span> accessible, effective and 
            affordable for every single student. After first starting in August 2024, and after helping 100s 
            of students achieve tournament success for free online, developing our platform, and improving the service, <span className="font-semibold text-[#01459f]">Clusion </span> 
            was proudly launched in November 2025.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Debate students struggle without proper coaching resources.</h3>
              <p>
                Most students rely on <span className="font-bold text-gray-900">outdated debate handbooks</span> and <span className="font-bold text-gray-900">generic online tutorials</span>. 
                When they need help, expensive private coaching can cost <span className="font-bold text-gray-900">$150+/hr</span>, making quality debate support 
                inaccessible for many students.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You don't need to overpay to reach TOC.</h3>
              <p>
                Our founders both achieved <span className="font-bold text-gray-900">national circuit success</span> and helped their friends also reach <span className="font-bold text-gray-900">elimination rounds</span> by 
                using effective coaching methods. Based on the strategies we used to achieve our success, we built 
                <span className="font-semibold text-[#01459f]"> Clusion</span>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Don't over-complicate debate preparation.</h3>
              <p>
                Many students and parents go searching for a "magic strategy", but the answer is 
                straightforward—a simple <span className="font-bold text-gray-900">practice plan</span>, <span className="font-bold text-gray-900">consistent coaching</span>, and someone to hold you 
                <span className="font-bold text-gray-900"> accountable</span>. This is the core of what we accomplish with each of our students.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn from champions and experienced coaches.</h3>
              <p>
                We want to make sure each student has access to coaches who reached TOC and a 
                community of debaters all with the same goal—excel in competitive debate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Debate success matters more than ever for college admissions.</h3>
              <p>
                Top universities value debate achievements as indicators of critical thinking and leadership, and a strong debate portfolio 
                increases your chances of standing out from the pool of applicants. 
                Average debate experience for T20 college admits includes <span className="font-bold text-gray-900">2+ years</span> of competitive participation.
              </p>
            </div>
          </div>

          <div className="mt-12 h-32 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-gray-900 mb-2">We win, together.</p>
            <div className="flex items-center justify-center gap-1 text-xl">
              <span className="text-gray-600">With care, the</span>
              <span className="font-bold text-xl text-[#01459f]">Clusion</span>
              <span className="text-gray-600">team</span>
              <span className="text-3xl ml-2">🏆</span>
            </div>
          </div>
        </div>

        {/* <div className="mt-16">
          <div className="h-px bg-gray-300 mb-16"></div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            the founders
          </h2>
          
          <div className="space-y-12">
            <div className="flex items-start gap-8">
              <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-blue-200">
                <img 
                  src="/Pearson.png" 
                  alt="Pearson Hong" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pearson Hong</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Pearson Seoul is a rising senior who achieved national circuit success in debate. 
                  He likes to drink boba and make funny videos on Instagram.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-blue-200">
                <img 
                  src="/Aarnav.png" 
                  alt="Aarnav Trivedi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Aarnav Trivedi</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Aarnav Trivedi is a rising junior who reached elimination rounds at multiple national tournaments 
                  (except at Harvard, but we don't talk about that). He likes drinking smoothies and playing basketball.
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="mt-20 text-center">
          <div className="h-px bg-gray-300 mb-12"></div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            Ready to find your <span className="text-[#01459f]">dream coach</span>?
          </h2>
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#01459f] hover:bg-blue-700 rounded-2xl shadow-[0_4px_0_0_rgba(1,69,159,0.8)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            get started - it's free
          </a>
        </div>
      </div>
    </section>
  );
}
