"use client";

import React, { useEffect, useRef, useState } from 'react';
// Use ! prefix to exclude from webpack loaders as per Mapbox docs
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  className?: string;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ className = "" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      // Fallback to a default location (San Francisco)
      setUserLocation([-122.4194, 37.7749]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        console.log('User location:', longitude, latitude);
        setUserLocation([longitude, latitude]);
      },
      (error) => {
        console.warn('Error getting location:', error);
        // Fallback to default location
        setUserLocation([-122.4194, 37.7749]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current || !userLocation) return;

    // Set your Mapbox access token from .env.local
    const token = process.env.NEXT_PUBLIC_MAPBOX || '';
    mapboxgl.accessToken = token;
    
    if (!token) {
      const errorMsg = 'Mapbox access token not found. Please add NEXT_PUBLIC_MAPBOX to your .env.local file';
      console.error(errorMsg);
      setMapError(errorMsg);
      return;
    }

    try {
      console.log('Initializing Mapbox map at location:', userLocation);

      // Create map with dark tactical style at user's location
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark tactical style
        center: userLocation, // User's current location
        zoom: 17, // Close zoom for immediate surroundings
        pitch: 0,
        bearing: 0,
        antialias: true,
      });

      // Disable map rotation via right click drag
      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();

      // Add error handler
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        setMapError(null);
        
        // Add custom dark tactical styling modifications
        if (map.current) {
          try {
            // These properties may not exist on all styles, so we wrap in try-catch
            const style = map.current.getStyle();
            if (style.layers) {
              // Make buildings darker and more tactical
              if (style.layers.find(l => l.id === 'building')) {
                map.current.setPaintProperty('building', 'fill-color', '#1a1a1a');
                map.current.setPaintProperty('building', 'fill-opacity', 0.6);
              }
              
              // Style roads for tactical view
              if (style.layers.find(l => l.id === 'road-street')) {
                map.current.setPaintProperty('road-street', 'line-color', '#2d2d2d');
              }
              if (style.layers.find(l => l.id === 'road-primary')) {
                map.current.setPaintProperty('road-primary', 'line-color', '#3a3a3a');
              }
              
              // Darken water
              if (style.layers.find(l => l.id === 'water')) {
                map.current.setPaintProperty('water', 'fill-color', '#0a0a0a');
              }
              
              // Darken land
              if (style.layers.find(l => l.id === 'landcover')) {
                map.current.setPaintProperty('landcover', 'fill-color', '#1a1a1a');
              }
            }
          } catch (styleError) {
            console.warn('Error applying custom styles:', styleError);
          }
        }
      });

      map.current.on('style.load', () => {
        console.log('Mapbox style loaded');
      });

    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  return (
    <>
      <div 
        ref={mapContainer} 
        className={`absolute inset-0 ${className}`}
        style={{ 
          zIndex: 0,
          width: '100%',
          height: '100%'
        }}
      />
      {mapError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-900/90 text-white p-4 rounded-lg border border-red-500 max-w-md">
          <p className="font-bold mb-2">Map Error</p>
          <p className="text-sm">{mapError}</p>
          <p className="text-xs mt-2 opacity-75">Check console for details</p>
        </div>
      )}
    </>
  );
};

