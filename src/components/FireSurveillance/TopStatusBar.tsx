"use client";

import React, { useState, useEffect } from 'react';
import { MaydayBanner } from './MaydayBanner';
import { ForensicsPanel } from './ForensicsPanel';
import { Menu, Wifi, Compass } from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      const dayStr = now.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      setCurrentTime(`${timeStr} ${dayStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-md border-b border-gray-800/50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors" />
        <span className="text-sm text-gray-300 font-mono">
          {currentTime || '9:41 Mon May 3'}
        </span>
      </div>
      
      {/* Center - MAYDAY Banner */}
      <div className="flex-1 flex justify-center">
        <MaydayBanner isActive={true} />
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ForensicsPanel count={23} />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-300 font-semibold">100%</span>
          </div>
          <Compass className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

