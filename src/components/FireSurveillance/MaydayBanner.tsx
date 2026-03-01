"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface MaydayBannerProps {
  isActive?: boolean;
}

export const MaydayBanner: React.FC<MaydayBannerProps> = ({ isActive = true }) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
      <motion.button
        className="relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Professional, muted red button */}
        <div
          className="relative flex items-center gap-2 px-5 py-2.5 rounded-md bg-red-900/90 border border-red-800/60"
          style={{
            boxShadow: isActive
              ? '0 2px 8px rgba(127, 29, 29, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Subtle pulse indicator instead of glowing effect */}
          {isActive && (
            <motion.div
              className="w-2 h-2 rounded-full bg-red-400"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* MAYDAY text - professional styling */}
          <span className="relative text-red-100 font-semibold text-sm tracking-wide select-none">
            Mayday
          </span>

          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
      </motion.button>
    </div>
  );
};
