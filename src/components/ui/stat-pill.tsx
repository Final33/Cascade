"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatPillProps {
  value: string;
  label: string;
  className?: string;
  delay?: number;
}

const StatPill: React.FC<StatPillProps> = ({ 
  value, 
  label, 
  className,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl px-6 py-4 text-center shadow-lg",
        className
      )}
    >
      <motion.div 
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
    </motion.div>
  );
};

export { StatPill };
