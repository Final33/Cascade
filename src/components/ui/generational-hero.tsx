"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { InteractiveButton } from './interactive-button';
import { AnimatedStatPillsGroup } from './animated-stat-pills';
import { InteractiveCardCarousel } from './interactive-card-carousel';
import { useCursor } from './interactive-cursor';

const GenerationalHero: React.FC = () => {
  const { mousePosition } = useCursor();
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax effect for background elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const backgroundY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Subtle parallax movement
        const deltaX = (mousePosition.x - centerX) / rect.width * 20;
        const deltaY = (mousePosition.y - centerY) / rect.height * 20;
        
        mouseX.set(deltaX);
        mouseY.set(deltaY);
      }
    };

    handleMouseMove();
  }, [mousePosition.x, mousePosition.y, mouseX, mouseY]);

  const handleScrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { value: "10K+", label: "Students", countUp: true },
    { value: "2K+", label: "Coaches", countUp: true },
    { value: "500+", label: "Judges", countUp: true },
    { value: "$2M+", label: "Scholarships Won", countUp: false }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden flex items-center pt-20"
      style={{ willChange: 'transform' }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {/* Primary Gradient Orb */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, rgba(99,102,241,0.3) 50%, rgba(168,85,247,0.2) 100%)',
            x: backgroundX,
            y: backgroundY,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Secondary Gradient Orb */}
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.3) 50%, rgba(251,146,60,0.2) 100%)',
            x: backgroundX.get() * -0.5,
            y: backgroundY.get() * -0.5,
          }}
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Tertiary Accent Orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{
            background: 'conic-gradient(from 0deg, rgba(20,184,166,0.3), rgba(99,102,241,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(20,184,166,0.3))',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left Column - Hero Content */}
          <div className="space-y-10">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/70 border border-white/30 rounded-full px-6 py-3 text-sm font-semibold text-gray-800 shadow-lg"
            >
              <motion.span 
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Built by debate champions for debate champions
            </motion.div>

            {/* Main Headline with Character Animation */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="block text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  The Ultimate
                </motion.span>
                
                <motion.span 
                  className="block relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <span 
                    className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent relative"
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent"
                      style={{
                        backgroundSize: '200% 200%',
                      }}
                    >
                      Debate Marketplace
                    </motion.span>
                  </span>
                  
                  {/* Shimmer Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </motion.span>
              </motion.h1>
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              style={{ lineHeight: '1.6' }}
            >
              Where debate champions, coaches, and judges connect to shape the future. 
              <span className="text-indigo-600 font-semibold"> Transform your debate journey</span> with 
              world-class coaching and proven results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <InteractiveButton 
                variant="primary" 
                size="xl"
                href="/get-started"
                shimmer
                className="group text-xl px-12 py-6"
              >
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </InteractiveButton>
              
              <InteractiveButton 
                variant="secondary" 
                size="xl"
                onClick={handleScrollToHowItWorks}
                className="group text-xl px-12 py-6"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                See How It Works
              </InteractiveButton>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="pt-8"
            >
              <AnimatedStatPillsGroup 
                stats={stats}
                className="justify-start"
              />
            </motion.div>
          </div>

          {/* Right Column - Interactive Card Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.6, type: "spring", stiffness: 200, damping: 25 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Enhanced Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-teal-500/30 via-indigo-500/30 to-purple-500/30 rounded-3xl blur-3xl scale-110"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1.1, 1.2, 1.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Interactive Card Carousel */}
              <div className="relative z-10">
                <InteractiveCardCarousel />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center backdrop-blur-sm bg-white/20"
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-gradient-to-b from-teal-500 to-indigo-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export { GenerationalHero };
