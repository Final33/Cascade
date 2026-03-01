"use client";

import React, { useState, useEffect } from 'react';
import { VideoFeed } from '@/components/FireSurveillance/VideoFeed';
import { SlidingSidebar } from '@/components/FireSurveillance/SlidingSidebar';
import { MapboxMap } from '@/components/FireSurveillance/MapboxMap';
import { MaydayBanner } from '@/components/FireSurveillance/MaydayBanner';
import { CompassRose } from '@/components/FireSurveillance/CompassRose';
import { IncidentTimeline } from '@/components/FireSurveillance/IncidentTimeline';
import { SetupModal } from '@/components/FireSurveillance/SetupModal';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Building, GripVertical } from 'lucide-react';

type FeedType = 'object-detection' | 'edge-detection' | '3d-mapping';

interface FeedPosition {
  x: number;
  y: number;
}

interface Unit {
  id: string;
  code: string;
  status: 'active' | 'standby' | 'critical';
}

interface Personnel {
  id: string;
  name: string;
  status: 'active' | 'critical';
}

const AVAILABLE_UNITS: Unit[] = [
  { id: 'E1', code: 'E1', status: 'active' },
  { id: 'E2', code: 'E2', status: 'active' },
  { id: 'E3', code: 'E3', status: 'active' },
  { id: 'E4', code: 'E4', status: 'standby' },
  { id: 'E5', code: 'E5', status: 'standby' },
  { id: 'T1', code: 'T1', status: 'standby' },
  { id: 'T2', code: 'T2', status: 'standby' },
  { id: 'R1', code: 'R1', status: 'standby' },
  { id: 'B1', code: 'B1', status: 'standby' },
  { id: 'L1', code: 'L1', status: 'standby' },
  { id: 'HM172', code: 'HM172', status: 'standby' },
  { id: 'MED1', code: 'MED1', status: 'standby' },
];

const DEFAULT_PERSONNEL: Personnel[] = [
  { id: 'Lee', name: 'Lee', status: 'active' },
  { id: 'Johnson', name: 'Johnson', status: 'active' },
  { id: 'Smith', name: 'Smith', status: 'active' },
  { id: 'Matthews', name: 'Matthews', status: 'active' },
];

export default function FireSurveillanceDashboard() {
  // Setup modal state
  const [showSetup, setShowSetup] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<string>('E1');
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<string>('0:00:00');
  const [startTime, setStartTime] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [expandedFeed, setExpandedFeed] = useState<FeedType | null>(null);
  const [incidentType, setIncidentType] = useState<'structure' | 'wildfire'>('structure');

  // User's geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number }>({
    lat: 38.9893242, // Default: Ashburn, VA area
    lon: -77.6106188
  });

  // Draggable feed positions (relative to initial position)
  const [feedPositions, setFeedPositions] = useState<Record<FeedType, FeedPosition>>({
    'object-detection': { x: 0, y: 0 },
    'edge-detection': { x: 0, y: 0 },
    '3d-mapping': { x: 0, y: 0 },
  });
  const [draggingFeed, setDraggingFeed] = useState<FeedType | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Handle setup completion
  const handleSetupComplete = (selectedUnits: Unit[], selectedPersonnel: Personnel[]) => {
    setUnits(selectedUnits);
    setPersonnel(selectedPersonnel);
    if (selectedPersonnel.length > 0) {
      setSelectedPersonnel(selectedPersonnel[0].id);
    }
    if (selectedUnits.length > 0) {
      setSelectedUnit(selectedUnits[0].id);
    }
    setShowSetup(false);
  };

  // Get user's actual location via browser geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error, using default location:', error.message);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  // API base URL - can be configured via environment variable
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  // Initialize start time and calculate elapsed time
  useEffect(() => {
    const start = new Date();
    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setStartTime(startTimeStr);

    const updateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setElapsedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setElapsedSeconds(totalSeconds);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate timeline position (simulate 30 minute total incident for demo)
  const timelinePosition = Math.min((elapsedSeconds / 1800) * 100, 100);

  const getFeedLabel = (feedType: FeedType) => {
    switch (feedType) {
      case 'object-detection': return 'Thermal';
      case 'edge-detection': return 'Edge Detection';
      case '3d-mapping': return '3D Mapping';
    }
  };

  // Handle drag start
  const handleDragStart = (feedType: FeedType, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingFeed(feedType);
    setDragStart({ x: e.clientX - feedPositions[feedType].x, y: e.clientY - feedPositions[feedType].y });
  };

  // Handle drag move
  useEffect(() => {
    if (!draggingFeed || !dragStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      setFeedPositions(prev => ({
        ...prev,
        [draggingFeed]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        }
      }));
    };

    const handleMouseUp = () => {
      setDraggingFeed(null);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingFeed, dragStart]);

  const renderDraggableFeed = (feedType: FeedType, index: number) => {
    const position = feedPositions[feedType];
    const isDragging = draggingFeed === feedType;

    return (
      <div
        key={feedType}
        className={`relative ${isDragging ? 'z-50' : 'z-20'}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {/* Drag handle */}
        <div
          className="absolute top-1 left-1 p-1 bg-black/60 rounded cursor-grab z-20 flex items-center gap-0.5"
          onMouseDown={(e) => handleDragStart(feedType, e)}
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>

        <VideoFeed
          feedType={feedType}
          label={feedType === 'object-detection' ? 'E1' : undefined}
          isMain={feedType === 'object-detection'}
          isActive={true}
          statusIcons={feedType === 'object-detection' ? ['D', 'E', 'R'] : ['E', 'R']}
          className="w-72 h-40"
          apiBaseUrl={apiBaseUrl}
          onExpand={() => setExpandedFeed(feedType)}
        />
      </div>
    );
  };

  return (
    <>
      {/* Setup Modal - Shows on initial load */}
      <SetupModal
        isOpen={showSetup}
        onClose={handleSetupComplete}
        availableUnits={AVAILABLE_UNITS}
        availablePersonnel={DEFAULT_PERSONNEL}
      />

      <div className="fixed inset-0 w-full h-full bg-black overflow-hidden flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Mapbox Map - Full Screen Background */}
          <MapboxMap />

          {/* MAYDAY Button - Top Center Overlay */}
          <MaydayBanner isActive={true} />

          {/* Incident Type Toggle - Top Left */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <button
              onClick={() => setIncidentType('structure')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${incidentType === 'structure'
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-gray-800/60 text-gray-400 border border-gray-700/40'
                }`}
            >
              <Building className="w-3 h-3" />
              Structure
            </button>
            <button
              onClick={() => setIncidentType('wildfire')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${incidentType === 'wildfire'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'bg-gray-800/60 text-gray-400 border border-gray-700/40'
                }`}
            >
              <Flame className="w-3 h-3" />
              Wildfire
            </button>
          </div>

          {/* Compass Rose - Top Right Overlay */}
          <CompassRose />

          {/* Left Panel - Draggable Video Feeds */}
          <div className="absolute left-4 top-16 bottom-28 z-20 w-80 flex flex-col gap-2 pointer-events-auto">
            {(['object-detection', 'edge-detection', '3d-mapping'] as FeedType[]).map((feedType, index) => {
              const position = feedPositions[feedType];
              const isDragging = draggingFeed === feedType;

              return (
                <div
                  key={feedType}
                  className={`relative flex-1 min-h-[120px] ${isDragging ? 'z-50' : 'z-20'}`}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'default',
                  }}
                >
                  {/* Drag handle */}
                  <div
                    className="absolute top-1 left-1 p-1 bg-black/60 rounded cursor-grab z-20 flex items-center gap-0.5"
                    onMouseDown={(e) => handleDragStart(feedType, e)}
                  >
                    <GripVertical className="w-3 h-3 text-gray-400" />
                  </div>

                  <VideoFeed
                    feedType={feedType}
                    label={feedType === 'object-detection' ? 'E1' : undefined}
                    isMain={feedType === 'object-detection'}
                    isActive={true}
                    statusIcons={feedType === 'object-detection' ? ['D', 'E', 'R'] : ['E', 'R']}
                    className="w-full h-full"
                    apiBaseUrl={apiBaseUrl}
                    onExpand={() => setExpandedFeed(feedType)}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Panel - Sliding Sidebar - Overlay */}
          <div className="absolute right-0 top-12 bottom-16 z-20 pointer-events-auto">
            <SlidingSidebar
              commandUnit="A"
              commandName="In command"
              units={units}
              personnel={personnel}
              selectedUnit={selectedUnit}
              selectedPersonnel={selectedPersonnel}
              onUnitSelect={setSelectedUnit}
              onPersonnelSelect={setSelectedPersonnel}
              incidentType={incidentType}
              userLocation={userLocation}
            />
          </div>

          {/* Expanded Feed Modal */}
          <AnimatePresence>
            {expandedFeed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setExpandedFeed(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative w-[70%] max-w-4xl aspect-video"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setExpandedFeed(null)}
                    className="absolute -top-10 right-0 p-2 text-gray-400 z-10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Feed Label */}
                  <div className="absolute -top-10 left-0 text-white text-sm font-medium">
                    {getFeedLabel(expandedFeed)}
                  </div>

                  {/* Expanded Video Feed */}
                  <VideoFeed
                    feedType={expandedFeed}
                    isActive={true}
                    statusIcons={expandedFeed === 'object-detection' ? ['D', 'E', 'R'] : ['E', 'R']}
                    className="w-full h-full"
                    apiBaseUrl={apiBaseUrl}
                    isExpanded={true}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar - Time Indicators + Timeline */}
        <div className="relative z-30 bg-black/80">
          {/* Time indicators row */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/40">
            {/* Started Time - Left */}
            <div className="text-green-400 text-xs font-mono">
              {startTime} Started
            </div>

            {/* Elapsed Time - Right */}
            <div className="text-red-400 text-xs font-mono">
              {elapsedTime} Elapsed
            </div>
          </div>

          {/* Timeline */}
          <IncidentTimeline
            currentPosition={timelinePosition}
          />
        </div>
      </div>
    </>
  );
}
