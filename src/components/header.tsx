"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import CTAButton from './ui/cta-button';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { label: 'For Students', href: '/students' },
    { label: 'For Coaches', href: '/coaches' },
    { label: 'For Judges', href: '/judges' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DM</span>
            </div>
            <span className="text-xl font-bold text-foreground">DebateMatch</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <CTAButton variant="ghost" size="sm" href="/login" ariaLabel="Login to DebateMatch">
            Login
          </CTAButton>
          <CTAButton variant="primary" size="sm" href="/get-started" ariaLabel="Get started with DebateMatch">
            Get Started
          </CTAButton>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
          onClick={handleToggleMobileMenu}
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMobileMenu}
            />
            
            {/* Mobile Menu Drawer */}
            <motion.div
              className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background border-l border-border shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full p-6">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 mb-8">
                  {navigationLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 py-2"
                      onClick={handleCloseMobileMenu}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 mt-auto">
                  <CTAButton 
                    variant="ghost" 
                    size="md" 
                    href="/login" 
                    ariaLabel="Login to DebateMatch"
                    className="w-full"
                  >
                    Login
                  </CTAButton>
                  <CTAButton 
                    variant="primary" 
                    size="md" 
                    href="/get-started" 
                    ariaLabel="Get started with DebateMatch"
                    className="w-full"
                  >
                    Get Started
                  </CTAButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;