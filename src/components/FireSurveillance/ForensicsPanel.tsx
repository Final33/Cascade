"use client";

import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  AlertTriangle,
  Activity,
  Thermometer
} from 'lucide-react';

interface Personnel {
  id: string;
  name: string;
  unit?: string;
  status: 'active' | 'critical';
}

interface ForensicsPanelProps {
  personnel?: Personnel[];
  className?: string;
}

export const ForensicsPanel: React.FC<ForensicsPanelProps> = ({
  personnel = [],
  className = ""
}) => {
  const [selectedFirefighter, setSelectedFirefighter] = useState<string>(personnel[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Mock data for demonstration
  const exposureLevel = 3;
  const readinessPercent = 66;
  const maxExposure = 5;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800/40">
        <h3 className="text-sm font-medium text-gray-200">Incident Forensics</h3>
        <p className="text-xs text-gray-500 mt-1">Playback & analysis</p>
      </div>

      {/* Firefighter Selector */}
      <div className="px-4 py-3 border-b border-gray-800/40">
        <label className="text-xs text-gray-500 mb-2 block">Firefighter POV</label>
        <div className="flex flex-wrap gap-1">
          {personnel.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedFirefighter(person.id)}
              className={`
                px-2 py-1 text-xs rounded transition-colors
                ${selectedFirefighter === person.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-gray-800/40 text-gray-400 border border-gray-700/30'
                }
              `}
            >
              {person.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 border-b border-gray-800/40">
        <div className="grid grid-cols-2 gap-3">
          {/* Exposure */}
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-500">Exposure</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-red-400">{exposureLevel}</span>
              <span className="text-xs text-gray-600">/ {maxExposure}</span>
            </div>
            {/* Exposure bar */}
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all"
                style={{ width: `${(exposureLevel / maxExposure) * 100}%` }}
              />
            </div>
          </div>

          {/* Readiness */}
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-500">Readiness</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-green-400">{readinessPercent}</span>
              <span className="text-xs text-gray-600">%</span>
            </div>
            {/* Readiness bar */}
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="px-4 py-3 border-b border-gray-800/40">
        <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs">High heat exposure detected at 14:32:15</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mt-auto p-4 border-t border-gray-800/40">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button className="p-2 text-gray-400 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-green-500/20 text-green-400 rounded-full border border-green-500/40 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button className="p-2 text-gray-400 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="relative">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500/60 transition-all"
              style={{ width: `${playbackTime}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={playbackTime}
            onChange={(e) => setPlaybackTime(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
          <span>00:00:00</span>
          <span>00:15:32</span>
        </div>
      </div>
    </div>
  );
};
