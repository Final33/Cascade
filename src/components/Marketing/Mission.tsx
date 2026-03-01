"use client";

export default function Mission() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Our Mission.
          </h2>
        </div>
        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Pearson Seoul and Aarnav Trivedi</span> became friends online despite living on separate coasts—Aarnav from Virginia and Pearson from California. Together they founded <span className="font-semibold"><span className="text-green-600">prep</span><span className="text-blue-600">sy</span></span> with one mission: make AP exam prep simple, engaging and 
            affordable for every single student. They started in August 2025, and after helping 100s 
            of students achieve perfect scores for free online, developing their platform, and improving their service, <span className="font-semibold"><span className="text-green-600">prep</span><span className="text-blue-600">sy </span></span> 
            launched in August 2025.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AP students struggle without proper resources.</h3>
              <p>
                Most students rely on <span className="font-bold text-gray-900">outdated textbooks</span> and <span className="font-bold text-gray-900">generic practice tests</span>. 
                When they need help, expensive tutoring can cost <span className="font-bold text-gray-900">$100+/hr</span>, making quality AP support 
                inaccessible for many students.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You don't need to overpay to get a 5.</h3>
              <p>
                Pearson and Aarnav both achieved <span className="font-bold text-gray-900">perfect 5s</span> on multiple AP exams and helped their friends also score <span className="font-bold text-gray-900">5s</span> by 
                using effective study methods.                 Based on the strategies we used to achieve our scores, we built 
                <span className="font-semibold"><span className="text-green-600"> prep</span><span className="text-blue-600">sy</span></span>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Don't over-complicate studying for AP exams.</h3>
              <p>
                Many students and parents go searching for a "new strategy", but the answer is 
                straightforward—a simple <span className="font-bold text-gray-900">study plan</span>, <span className="font-bold text-gray-900">consistent practice</span>, and someone to hold you 
                <span className="font-bold text-gray-900"> accountable</span>. This is the core of what we accomplish with each of our students.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn from perfect scorers and peers.</h3>
              <p>
                We want to make sure each student has access to tutors who scored 5s and a 
                community of students all with the same goal—ace their AP exams.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AP scores matter more than ever for college admissions.</h3>
              <p>
                Top universities value AP scores as indicators of college readiness, and a strong AP portfolio 
                increases your chances of standing out from the pool of applicants. 
                Average AP score for T20 college admits is <span className="font-bold text-gray-900">4.2+</span> across multiple subjects.
              </p>
            </div>
          </div>

          <div className="mt-12 h-32 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-gray-900 mb-2">We win, together.</p>
            <div className="flex items-center justify-center gap-1 text-xl">
              <span className="text-gray-600">With care, the</span>
              <span className="font-bold text-xl"><span className="text-green-600">prep</span><span className="text-blue-600">sy</span></span>
              <span className="text-gray-600">team</span>
              <span className="text-3xl ml-2">🐐</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
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
                  Pearson Seoul is a rising senior, and he scored perfect 5s on all of his AP exams. 
                  He likes to drink boba and make funny videos on Instagram.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-green-200">
                <img 
                  src="/Aarnav.png" 
                  alt="Aarnav Trivedi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Aarnav Trivedi</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Aarnav Trivedi is a rising junior, and he scored perfect 5s on all his AP exams 
                  (except a 4 on CSP, but we don't talk about that). He likes drinking smoothies and playing basketball.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="h-px bg-gray-300 mb-12"></div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            Ready to get that <span className="text-blue-600">5</span>?
          </h2>
          <a
            href="/dashboard/home"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            get started - it's free
          </a>
        </div>
      </div>
    </section>
  );
}
