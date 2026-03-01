"use client";

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

interface VideoFeedProps {
  feedType: 'object-detection' | 'edge-detection' | '3d-mapping';
  label?: string;
  isMain?: boolean;
  isActive?: boolean;
  statusIcons?: string[];
  className?: string;
  apiBaseUrl?: string;
  onExpand?: () => void;
  isExpanded?: boolean;
}

const API_ENDPOINTS = {
  'object-detection': '/video/thermal_yolo',
  'edge-detection': '/video/edge',
  '3d-mapping': '/video/recon3d',
};

export const VideoFeed: React.FC<VideoFeedProps> = ({
  feedType,
  label,
  isMain = false,
  isActive = true,
  statusIcons = [],
  className = "",
  apiBaseUrl = 'http://localhost:8000',
  onExpand,
  isExpanded = false
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Get the API endpoint for this feed type (MJPEG stream URL)
  const videoUrl = `${apiBaseUrl}${API_ENDPOINTS[feedType]}`;

  // Handle image load success (for MJPEG streams)
  const handleLoad = useCallback(() => {
    console.log(`MJPEG stream loaded: ${feedType} from ${videoUrl}`);
    setIsVideoLoaded(true);
    setVideoError(false);
  }, [feedType, videoUrl]);

  // Handle image error
  const handleError = useCallback(() => {
    console.error(`Failed to load MJPEG stream from ${videoUrl}`);
    setVideoError(true);
    setIsVideoLoaded(false);
  }, [videoUrl]);
  const getFeedTypeLabel = () => {
    switch (feedType) {
      case 'object-detection':
        return 'Thermal';
      case 'edge-detection':
        return 'Edge Detection';
      case '3d-mapping':
        return '3D Mapping';
      default:
        return 'Camera Feed';
    }
  };

  const getFeedTypeStyle = () => {
    switch (feedType) {
      case 'object-detection':
        return {
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%),
            linear-gradient(180deg, rgba(34, 197, 94, 0.15) 0%, transparent 50%, rgba(220, 38, 38, 0.1) 100%)
          `
        };
      case 'edge-detection':
        return {
          background: `
            linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%),
            repeating-linear-gradient(0deg, transparent 0px, rgba(34, 197, 94, 0.05) 1px, transparent 2px)
          `
        };
      case '3d-mapping':
        return {
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)
          `
        };
      default:
        return {};
    }
  };
  return (
    <motion.div
      className={`relative ${isMain ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : 'border border-gray-700/50'} 
        bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* MJPEG Stream container */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        {/* MJPEG stream via img element - browsers natively support MJPEG streams */}
        <img
          ref={imgRef}
          src={videoUrl}
          alt={`${feedType} stream`}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 1 }}
        />

        {/* Fallback visualization when stream is not loaded */}
        {(!isVideoLoaded || videoError) && (
          <div className="absolute inset-0 bg-black" style={{ zIndex: 2 }}>
            {/* Base gradient overlay */}
            <div className="absolute inset-0" style={getFeedTypeStyle()} />

            {/* Noise/grain effect */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay'
              }}
            />

            {/* Feed-specific visualization fallback */}
            {feedType === 'object-detection' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Thermal signature with YOLO bounding boxes */}
                  <div className="w-14 h-14 rounded-full mx-auto mb-1 relative"
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(34, 197, 94, 0.3) 50%, transparent 100%)',
                      boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4)',
                      border: '2px solid rgba(34, 197, 94, 0.6)'
                    }}
                  />
                  <div className="w-18 h-28 mx-auto relative"
                    style={{
                      background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.4) 50%, rgba(34, 197, 94, 0.2) 100%)',
                      boxShadow: '0 0 25px rgba(34, 197, 94, 0.7), 0 0 50px rgba(34, 197, 94, 0.3)',
                      border: '2px solid rgba(34, 197, 94, 0.5)',
                      borderRadius: '8px'
                    }}
                  />
                  {/* YOLO bounding box overlay */}
                  <div className="absolute inset-0 border-2 border-yellow-400 rounded"
                    style={{
                      boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)',
                      margin: '8px'
                    }}
                  />
                  {/* Object label */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-yellow-400/90 text-black text-xs px-2 py-0.5 rounded font-bold">
                    PERSON
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500/60"
                    style={{ boxShadow: '0 0 15px rgba(220, 38, 38, 0.8)' }}
                  />
                </div>
              </div>
            )}

            {feedType === 'edge-detection' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-40">
                  {/* Edge detection outline */}
                  <svg className="w-full h-full" viewBox="0 0 100 120">
                    <path
                      d="M 30 20 L 70 20 L 70 40 L 50 50 L 30 40 Z M 30 40 L 30 100 L 70 100 L 70 40"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))' }}
                    />
                    {/* Edge detection lines */}
                    <line x1="30" y1="20" x2="50" y2="30" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />
                    <line x1="70" y1="20" x2="50" y2="30" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />
                    <line x1="30" y1="100" x2="50" y2="90" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />
                    <line x1="70" y1="100" x2="50" y2="90" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            )}

            {feedType === '3d-mapping' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-40" style={{ transform: 'perspective(200px) rotateY(-15deg) rotateX(5deg)' }}>
                  {/* 3D reconstruction/mapping visualization */}
                  <svg className="w-full h-full" viewBox="0 0 100 120">
                    {/* 3D reconstructed environment */}
                    <path
                      d="M 20 30 L 80 30 L 80 90 L 20 90 Z M 20 30 L 30 20 L 90 20 L 80 30 M 80 30 L 90 20 L 90 80 L 80 90 M 80 90 L 90 80 L 30 80 L 20 90 M 20 90 L 30 80 L 30 20 L 20 30"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                    />
                    {/* Depth/height lines for 3D mapping */}
                    <line x1="20" y1="30" x2="30" y2="20" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                    <line x1="80" y1="30" x2="90" y2="20" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                    <line x1="80" y1="90" x2="90" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                    <line x1="20" y1="90" x2="30" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                    {/* Additional mapping points */}
                    <circle cx="50" cy="60" r="3" fill="rgba(34, 197, 94, 0.8)" style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }} />
                    <circle cx="35" cy="50" r="2" fill="rgba(34, 197, 94, 0.6)" />
                    <circle cx="65" cy="70" r="2" fill="rgba(34, 197, 94, 0.6)" />
                  </svg>
                </div>
              </div>
            )}

            {/* Loading/Error indicator */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-gray-400 text-xs text-center px-4">
                  <div className="mb-2 text-red-400">Stream unavailable</div>
                  <div className="text-gray-600 text-[10px] font-mono break-all">{videoUrl}</div>
                  <div className="text-gray-700 text-[10px] mt-2">Check API server connection</div>
                </div>
              </div>
            )}

            {!videoError && !isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-gray-400 text-xs">
                  <div className="animate-pulse">Connecting to stream...</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overlay effects for video (when loaded) */}
        {isVideoLoaded && !videoError && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
            {/* Subtle overlay based on feed type */}
            {feedType === 'object-detection' && (
              <div className="absolute inset-0 opacity-5" style={getFeedTypeStyle()} />
            )}
          </div>
        )}

        {/* Label on left edge if main feed */}
        {isMain && label && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-r">
              {label}
            </div>
          </div>
        )}

        {/* Fullscreen button */}
        {onExpand && !isExpanded && (
          <button
            onClick={onExpand}
            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded transition-colors z-10"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Feed type label and status icons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-semibold tracking-wide">{getFeedTypeLabel()}</span>
          <div className="flex gap-1.5">
            {statusIcons.map((icon, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-xs font-bold text-green-400"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pulsing indicator if active */}
      {isActive && (
        <motion.div
          className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

