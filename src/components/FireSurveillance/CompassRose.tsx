"use client";

import React from 'react';
import { Compass } from 'lucide-react';

export const CompassRose: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 z-30">
      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
        <Compass className="w-6 h-6 text-gray-300" />
      </div>
    </div>
  );
};

