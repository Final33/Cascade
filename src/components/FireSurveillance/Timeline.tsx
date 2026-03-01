"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, HelpCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  type: 'target' | 'fire' | 'question';
  label?: string;
  isActive?: boolean;
}

interface TimelineProps {
  startTime?: string;
  elapsedTime?: string;
  events?: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({
  startTime = "13:05:12 STARTED",
  elapsedTime = "1:15:59 ELAPSED",
  events = []
}) => {
  const defaultEvents: TimelineEvent[] = [
    { id: '1', time: '13:05:30', type: 'target', isActive: false },
    { id: '2', time: '13:10:45', type: 'fire', isActive: true },
    { id: '3', time: '13:15:20', type: 'question', isActive: false },
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'target':
        return <Target className="w-4 h-4" />;
      case 'fire':
        return <Flame className="w-4 h-4" />;
      case 'question':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getEventColor = (type: string, isActive: boolean) => {
    if (isActive) return 'text-red-400';
    switch (type) {
      case 'target':
        return 'text-white';
      case 'fire':
        return 'text-red-400';
      case 'question':
        return 'text-white';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/70 backdrop-blur-md border-t border-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-green-400 text-xs font-mono">{startTime}</div>
        <div className="text-green-400 text-xs font-mono">{elapsedTime}</div>
      </div>

      {/* Timeline track */}
      <div className="relative h-8 flex items-center">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 h-0.5 bg-gray-700" />

        {/* Event markers */}
        {timelineEvents.map((event, index) => {
          const position = ((index + 1) / (timelineEvents.length + 1)) * 100;
          return (
            <motion.div
              key={event.id}
              className="absolute"
              style={{ left: `${position}%` }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`flex flex-col items-center -translate-x-1/2 ${
                getEventColor(event.type, event.isActive || false)
              }`}>
                {getEventIcon(event.type)}
                {event.label && (
                  <span className="text-xs mt-1">{event.label}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Device scale indicator */}
      <div className="text-center mt-2">
        <span className="text-gray-500 text-xs">Device scale: Fill screen</span>
      </div>
    </div>
  );
};

