"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = true,
  glow = false 
}) => {
  return (
    <motion.div
      className={cn(
        "relative backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-xl",
        glow && "shadow-2xl shadow-blue-500/10",
        className
      )}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        boxShadow: glow 
          ? "0 25px 50px rgba(59, 130, 246, 0.15)" 
          : "0 25px 50px rgba(0, 0, 0, 0.1)"
      } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export { GlassCard };
