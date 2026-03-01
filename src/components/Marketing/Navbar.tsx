"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50"
          : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={smoothScrollToTop} className="flex items-center gap-3 group">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                DebateMatch
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/students"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
            >
              For Students
            </Link>
            <Link
              href="/coaches"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
            >
              For Coaches
            </Link>
            <Link
              href="/judges"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
            >
              For Judges
            </Link>
            <button
              onClick={() => smoothScrollTo('how-it-works')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
            >
              How It Works
            </button>
            <button
              onClick={() => smoothScrollTo('pricing')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-[1.02] transform"
            >
              Pricing
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard/home"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              get started
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-6 h-6 text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`absolute left-0 top-0 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-5 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            />
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-b-lg">
            <button
              onClick={() => smoothScrollTo('features')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => smoothScrollTo('demo')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Demo
            </button>
            <button
              onClick={() => smoothScrollTo('pricing')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Pricing
            </button>
            <Link
              href="/mission"
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mission
            </Link>
            <Link
              href="/free-tutoring"
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Free Tutoring
            </Link>
            <div className="pt-4 border-t border-gray-200/50 space-y-3 px-4">
              <Link
                href="/dashboard/home"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/dashboard/home"
                className="block w-full text-center px-6 py-3 text-sm font-bold text-black bg-white rounded-xl transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


