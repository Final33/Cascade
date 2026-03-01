"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';

const EnhancedHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { label: 'For Students', href: '/students' },
    { label: 'For Coaches', href: '/coaches' },
    { label: 'For Judges', href: '/judges' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg'
            : 'backdrop-blur-sm bg-white/60'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">DM</span>
                </div>
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  DebateMatch
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <EnhancedButton variant="ghost" size="sm" href="/login">
                Login
              </EnhancedButton>
              <EnhancedButton variant="primary" size="sm" href="/get-started" shimmer>
                Get Started
              </EnhancedButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 origin-left"
          style={{ scaleX }}
        />
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="absolute top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full p-6">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4 mb-8">
                {navigationLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 mt-auto">
                <EnhancedButton 
                  variant="ghost" 
                  size="md" 
                  href="/login"
                  className="w-full justify-center"
                >
                  Login
                </EnhancedButton>
                <EnhancedButton 
                  variant="primary" 
                  size="md" 
                  href="/get-started"
                  className="w-full justify-center"
                  shimmer
                >
                  Get Started
                </EnhancedButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export { EnhancedHeader };
