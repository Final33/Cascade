"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorContextType {
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
  mousePosition: { x: number; y: number };
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Smooth spring animation for cursor movement
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Hide cursor on keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsVisible(false);
      }
    };

    const handleMouseMove = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cursorX, cursorY, prefersReducedMotion]);

  const cursorVariants = {
    default: {
      scale: 1,
      opacity: 0.8,
    },
    hover: {
      scale: 1.2,
      opacity: 1,
    },
    click: {
      scale: 0.8,
      opacity: 1,
    },
    card: {
      scale: 1.5,
      opacity: 0.9,
    }
  };

  if (prefersReducedMotion || !isVisible) {
    return (
      <CursorContext.Provider value={{ cursorVariant, setCursorVariant, mousePosition }}>
        {children}
      </CursorContext.Provider>
    );
  }

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant, mousePosition }}>
      {children}
      
      {/* Custom Cursor */}
      <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
        {/* Outer Aura */}
        <motion.div
          className="fixed w-12 h-12 rounded-full pointer-events-none mix-blend-difference"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            x: '-50%',
            y: '-50%',
          }}
          animate={cursorVariants[cursorVariant as keyof typeof cursorVariants]}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 opacity-30 blur-sm" />
        </motion.div>

        {/* Inner Dot */}
        <motion.div
          className="fixed w-1 h-1 rounded-full bg-white pointer-events-none z-[10000]"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: cursorVariant === 'click' ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </CursorContext.Provider>
  );
};
