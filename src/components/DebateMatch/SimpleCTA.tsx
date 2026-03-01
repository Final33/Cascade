"use client";

import Link from "next/link";

export default function SimpleCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#01459f] to-blue-700">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to transform your debate game?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of debaters who are already using Clusion to research smarter, 
          practice better, and win more rounds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Free Today
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            Watch Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
