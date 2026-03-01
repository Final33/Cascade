"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCursor } from './interactive-cursor';

interface StatPillProps {
  value: string;
  label: string;
  className?: string;
  delay?: number;
  countUp?: boolean;
}

const AnimatedStatPill: React.FC<StatPillProps> = ({ 
  value, 
  label, 
  className,
  delay = 0,
  countUp = false
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const { setCursorVariant } = useCursor();
    
  // Extract number from value for count-up animation
  const numericValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
  const suffix = value.replace(/[\d]/g, '');
  
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (isInView && !hasAnimated && countUp) {
      setHasAnimated(true);
      count.set(numericValue);
    }
  }, [isInView, hasAnimated, countUp, numericValue, count]);

  useEffect(() => {
    const unsubscribe = rounded.onChange((latest) => {
      // This will trigger re-renders for the count-up effect
    });
    return unsubscribe;
  }, [rounded]);

  const handleMouseEnter = () => {
    setCursorVariant('hover');
  };

  const handleMouseLeave = () => {
    setCursorVariant('default');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={cn(
        "relative backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl px-6 py-4 text-center shadow-lg group cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        y: -4, 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
        initial={{ x: "-100%" }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{
          duration: 1.5,
          delay: delay + 0.5,
          ease: "easeInOut"
        }}
      />

      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl"
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div 
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-1"
          initial={{ scale: 0.5 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: delay + 0.2,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {countUp && hasAnimated ? (
            <motion.span>
              {Math.round(rounded.get())}{suffix}
            </motion.span>
          ) : (
            value
          )}
        </motion.div>
        
        <motion.div 
          className="text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
        >
          {label}
        </motion.div>
      </div>

      {/* Floating Particles */}
      <motion.div
        className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
        animate={{
          y: [0, -8, 0],
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }}
      />
    </motion.div>
  );
};

interface StatPillsGroupProps {
  stats: Array<{
    value: string;
    label: string;
    countUp?: boolean;
  }>;
  className?: string;
}

const AnimatedStatPillsGroup: React.FC<StatPillsGroupProps> = ({ stats, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-4 justify-center", className)}>
      {stats.map((stat, index) => (
        <AnimatedStatPill
          key={stat.label}
          value={stat.value}
          label={stat.label}
          delay={index * 0.1}
          countUp={stat.countUp}
        />
      ))}
    </div>
  );
};

export { AnimatedStatPill, AnimatedStatPillsGroup };
