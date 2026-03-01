"use client";

const testimonials = [
  {
    quote: "Clusion's AI research assistant cut my prep time in half. I qualified for TOC in my first year using it.",
    author: "Sarah Chen",
    role: "TOC Qualifier, Harvard-Westlake",
    avatar: "SC"
  },
  {
    quote: "The coaching marketplace connected me with a former national champion. My speaks jumped 2 points in one semester.",
    author: "Marcus Johnson",
    role: "State Champion, Lincoln High",
    avatar: "MJ"
  },
  {
    quote: "As a coach, Clusion helps me manage my entire team's progress and connect them with the best resources.",
    author: "Dr. Jennifer Park",
    role: "Head Coach, Debate Academy",
    avatar: "JP"
  }
];

export default function SimpleTestimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-[#01459f]">champions</span>
          </h2>
          <p className="text-xl text-gray-600">
            See what top debaters and coaches are saying about Clusion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
            <div className="text-gray-600 text-sm">Break Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#01459f]">10K+</div>
            <div className="text-gray-600 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#01459f]">500+</div>
            <div className="text-gray-600 text-sm">Tournaments</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#01459f]">24/7</div>
            <div className="text-gray-600 text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
