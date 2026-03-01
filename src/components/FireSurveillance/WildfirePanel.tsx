"use client";

import React, { useState, useEffect } from 'react';
import {
    Wind,
    Thermometer,
    Eye,
    MapPin,
    AlertTriangle,
    Navigation,
    Flame,
    RefreshCw,
    Loader2
} from 'lucide-react';

interface WeatherData {
    wind: {
        speed: number;
        direction: string;
        degrees: number;
    };
    temperature: number;
    humidity: number;
    description: string;
    location: string;
    isDemo?: boolean;
}

interface AQIData {
    aqi: number;
    category: string;
    categoryNumber: number;
    pollutant: string;
    color: string;
    isDemo?: boolean;
}

interface FireIncident {
    id: string;
    name: string;
    acres: number;
    containment: number;
    startDate: string;
    fireType: string;
}

interface WildfireData {
    nearbyFires: FireIncident[];
    totalFires: number;
    lastUpdated: string;
    isDemo?: boolean;
}

interface WildfirePanelProps {
    latitude?: number;
    longitude?: number;
    className?: string;
}

export const WildfirePanel: React.FC<WildfirePanelProps> = ({
    latitude = 34.0522,
    longitude = -118.2437,
    className = ""
}) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aqi, setAqi] = useState<AQIData | null>(null);
    const [fires, setFires] = useState<WildfireData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all data in parallel
            const [weatherRes, aqiRes, firesRes] = await Promise.all([
                fetch(`/api/weather?lat=${latitude}&lon=${longitude}`),
                fetch(`/api/air-quality?lat=${latitude}&lon=${longitude}`),
                fetch(`/api/wildfire-data?lat=${latitude}&lon=${longitude}&radius=100`)
            ]);

            // Handle weather - use demo fallback if API fails
            if (weatherRes.ok) {
                const weatherData = await weatherRes.json();
                if (!weatherData.error) {
                    setWeather(weatherData);
                } else {
                    // API returned error, use demo data
                    setWeather({
                        wind: { speed: 12, direction: 'NW', degrees: 315 },
                        temperature: 78,
                        humidity: 35,
                        description: 'Clear',
                        location: 'Demo',
                        isDemo: true
                    });
                }
            } else {
                // Request failed, use demo data
                setWeather({
                    wind: { speed: 12, direction: 'NW', degrees: 315 },
                    temperature: 78,
                    humidity: 35,
                    description: 'Clear',
                    location: 'Demo',
                    isDemo: true
                });
            }

            if (aqiRes.ok) {
                setAqi(await aqiRes.json());
            }
            if (firesRes.ok) {
                setFires(await firesRes.json());
            }

            setLastRefresh(new Date());
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Wildfire panel error:', err);
            // Set demo weather on error
            setWeather({
                wind: { speed: 12, direction: 'NW', degrees: 315 },
                temperature: 78,
                humidity: 35,
                description: 'Clear',
                location: 'Demo',
                isDemo: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    const getAqiColor = (categoryNumber: number) => {
        switch (categoryNumber) {
            case 1: return 'text-green-400';
            case 2: return 'text-yellow-400';
            case 3: return 'text-orange-400';
            case 4: return 'text-red-400';
            case 5: return 'text-purple-400';
            case 6: return 'text-red-600';
            default: return 'text-gray-400';
        }
    };

    const getWindRotation = (direction: string): number => {
        const dirMap: Record<string, number> = {
            'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
            'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
            'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
            'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
        };
        return dirMap[direction] || 0;
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-800/40 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-200">Wildfire Conditions</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {weather?.isDemo || aqi?.isDemo ? 'Demo data' : 'Live data'}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-1.5 text-gray-500 rounded transition-colors"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                </button>
            </div>

            {error && (
                <div className="px-4 py-2 text-xs text-red-400 bg-red-500/10">
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {/* Wind Conditions */}
                <div className="p-4 border-b border-gray-800/40">
                    <div className="flex items-center gap-2 mb-3">
                        <Wind className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-500">Wind Conditions</span>
                    </div>
                    {weather ? (
                        <div className="flex items-center gap-4">
                            {/* Wind Direction Compass */}
                            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center relative bg-gray-800/30">
                                <Navigation
                                    className="w-5 h-5 text-blue-400"
                                    style={{ transform: `rotate(${getWindRotation(weather.wind.direction)}deg)` }}
                                />
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-gray-200">
                                    {weather.wind.speed} <span className="text-sm text-gray-500">mph</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    From {weather.wind.direction}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">Loading...</div>
                    )}
                </div>

                {/* Air Quality */}
                <div className="p-4 border-b border-gray-800/40">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Air Quality Index</span>
                    </div>
                    {aqi ? (
                        <>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-semibold ${getAqiColor(aqi.categoryNumber)}`}>
                                    {aqi.aqi}
                                </span>
                                <span className={`text-xs ${getAqiColor(aqi.categoryNumber)}`}>
                                    {aqi.category}
                                </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                Primary: {aqi.pollutant}
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all"
                                    style={{
                                        width: `${Math.min(aqi.aqi / 3, 100)}%`,
                                        backgroundColor: aqi.color
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-sm">Loading...</div>
                    )}
                </div>

                {/* Nearby Fires */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-gray-500">Active Fires Nearby</span>
                        </div>
                        {fires && (
                            <span className="text-xs text-orange-400 font-medium">
                                {fires.totalFires} detected
                            </span>
                        )}
                    </div>

                    {fires && fires.nearbyFires.length > 0 ? (
                        <div className="space-y-2">
                            {fires.nearbyFires.slice(0, 5).map((fire) => (
                                <div
                                    key={fire.id}
                                    className="bg-gray-800/30 border border-gray-700/30 rounded px-3 py-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">{fire.name}</span>
                                        <span className="text-xs text-orange-400">
                                            {fire.containment}% contained
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {fire.acres.toLocaleString()} acres • Started {fire.startDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : fires?.nearbyFires.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            No active fires within 100 miles
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">Loading...</div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800/40">
                <p className="text-[10px] text-gray-600 text-center">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};
