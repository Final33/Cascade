"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({ className = "" }) => {
  return (
    <div className={`relative bg-gray-800/30 border border-gray-700 rounded overflow-hidden ${className}`}>
      {/* Map/Floor Plan */}
      <div className="relative w-full h-full p-4">
        {/* Street names */}
        <div className="absolute top-2 left-4 text-gray-500 text-xs font-semibold">
          Vallejo St
        </div>
        <div className="absolute top-2 right-4 text-gray-500 text-xs font-semibold">
          Capp St
        </div>

        {/* Building/Zone rectangles */}
        <div className="grid grid-cols-3 gap-2 h-full mt-8">
          {/* Zone 1 */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>

          {/* Zone 2 */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>

          {/* Zone 3 */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>

          {/* Zone 4 */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>

          {/* Zone 5 */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>

          {/* Zone 6 - with unit marker */}
          <motion.div
            className="bg-gray-700/50 border border-gray-600 rounded relative"
            whileHover={{ borderColor: '#22c55e' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-1 right-1">
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
            {/* Unit marker */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <motion.div
                className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-400 flex items-center justify-center text-xs font-bold text-black"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                A
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

