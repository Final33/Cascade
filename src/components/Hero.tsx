"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Users, Trophy, BookOpen, Gavel } from 'lucide-react';
import CTAButton from './ui/cta-button';

interface MockCard {
  id: string;
  type: 'student' | 'coach' | 'judge';
  content: React.ReactNode;
}

const Hero: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const mockCards: MockCard[] = [
    {
      id: 'student-card',
      type: 'student',
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
              <p className="text-sm text-gray-600">Debate Coach</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Specialized in Policy Debate • 8+ years experience • Harvard Debate Team
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">$45/hour</span>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Book Trial
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'coach-card',
      type: 'coach',
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Coach Dashboard</h3>
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">This Month's Earnings</span>
              <span className="text-lg font-bold text-green-600">$2,340</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Students</span>
              <span className="text-lg font-bold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg. Rating</span>
              <span className="text-lg font-bold text-purple-600">4.8★</span>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-4 hover:bg-primary/90 transition-colors">
            View All Students
          </button>
        </div>
      )
    },
    {
      id: 'judge-card',
      type: 'judge',
      content: (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Tournaments</h3>
            <Gavel className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">State Championships</p>
                <p className="text-sm text-gray-600">March 15-16, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">$150/day</p>
                <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1">
                  Accept
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Regional Qualifier</p>
                <p className="text-sm text-gray-600">March 22, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">$120/day</p>
                <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1">
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-cycle through cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % mockCards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [mockCards.length]);

  const handleScrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-10rem)]">
          
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                The Ultimate{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Debate Marketplace
                </span>
              </motion.h1>
            </motion.div>

            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Whether you're a student looking for a coach, a coach looking for students, 
              or a judge looking for opportunities — DebateMatch connects the debate 
              community in one place.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <CTAButton 
                variant="primary" 
                size="lg" 
                href="/get-started"
                ariaLabel="Get started with DebateMatch"
                className="text-lg px-8 py-4"
              >
                Get Started
              </CTAButton>
              <CTAButton 
                variant="secondary" 
                size="lg"
                onClick={handleScrollToHowItWorks}
                ariaLabel="Learn how DebateMatch works"
                className="text-lg px-8 py-4"
              >
                How It Works
              </CTAButton>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">2K+</div>
                <div className="text-sm text-muted-foreground">Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Judges</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Animated Cards */}
          <div className="flex justify-center lg:justify-end">
            <motion.div 
              className="relative w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  exit={{ opacity: 0, y: -50, rotateY: 15 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    rotateY: { duration: 0.8 }
                  }}
                  className="transform-gpu"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotateX: [0, 2, 0],
                      rotateY: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="transform-gpu"
                  >
                    {mockCards[currentCardIndex].content}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Card Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {mockCards.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentCardIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => setCurrentCardIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`View ${mockCards[index].type} preview`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border lg:hidden z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <CTAButton 
          variant="primary" 
          size="lg"
          href="/get-started"
          ariaLabel="Get started with DebateMatch"
          className="w-full text-lg py-4"
        >
          Get Started
        </CTAButton>
      </motion.div>
    </section>
  );
};

export default Hero;
