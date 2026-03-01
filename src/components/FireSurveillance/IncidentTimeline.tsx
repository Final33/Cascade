"use client";

import React, { useState } from 'react';
import {
    AlertTriangle,
    Flag,
    MessageSquare,
    Activity
} from 'lucide-react';

interface TimelineEvent {
    id: string;
    type: 'mayday' | 'milestone' | 'communication' | 'alert';
    label: string;
    time: string;
    position: number; // 0-100 percentage
}

interface IncidentTimelineProps {
    duration?: string;
    currentPosition?: number;
    events?: TimelineEvent[];
    className?: string;
}

const MOCK_EVENTS: TimelineEvent[] = [
    { id: '1', type: 'milestone', label: 'Water Supply', time: '00:02:15', position: 8 },
    { id: '2', type: 'communication', label: 'IC Update', time: '00:05:30', position: 20 },
    { id: '3', type: 'milestone', label: 'Interior Attack', time: '00:08:45', position: 32 },
    { id: '4', type: 'alert', label: 'High Heat', time: '00:12:00', position: 44 },
    { id: '5', type: 'mayday', label: 'MAYDAY - Smith', time: '00:14:32', position: 55 },
    { id: '6', type: 'milestone', label: 'Victim Located', time: '00:18:00', position: 68 },
    { id: '7', type: 'milestone', label: 'Knockdown', time: '00:22:15', position: 85 },
];

const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
        case 'mayday':
            return <AlertTriangle className="w-3 h-3" />;
        case 'milestone':
            return <Flag className="w-3 h-3" />;
        case 'communication':
            return <MessageSquare className="w-3 h-3" />;
        case 'alert':
            return <Activity className="w-3 h-3" />;
    }
};

const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
        case 'mayday':
            return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500' };
        case 'milestone':
            return { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500' };
        case 'communication':
            return { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500' };
        case 'alert':
            return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500' };
    }
};

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
    duration = "00:26:45",
    currentPosition = 65,
    events = MOCK_EVENTS,
    className = ""
}) => {
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

    return (
        <div className={`bg-black/70 backdrop-blur-sm border-t border-gray-800/40 px-4 py-3 ${className}`}>
            {/* Timeline Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 font-medium">Incident Timeline</span>
                <span className="text-[10px] text-gray-500 font-mono">Duration: {duration}</span>
            </div>

            {/* Timeline Track */}
            <div className="relative h-8">
                {/* Background track */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 rounded-full transform -translate-y-1/2" />

                {/* Progress fill */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500/40 rounded-full transform -translate-y-1/2"
                    style={{ width: `${currentPosition}%` }}
                />

                {/* Current position marker */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
                    style={{ left: `${currentPosition}%` }}
                >
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>

                {/* Event markers */}
                {events.map((event) => {
                    const colors = getEventColor(event.type);
                    return (
                        <div
                            key={event.id}
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10"
                            style={{ left: `${event.position}%` }}
                            onMouseEnter={() => setHoveredEvent(event.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                        >
                            {/* Marker */}
                            <div className={`w-2 h-2 ${colors.bg} rounded-full cursor-pointer`} />

                            {/* Tooltip */}
                            {hoveredEvent === event.id && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none z-30">
                                    <div className={`px-2 py-1 bg-gray-900 border ${colors.border} rounded text-[10px] whitespace-nowrap`}>
                                        <div className={`flex items-center gap-1 ${colors.text}`}>
                                            {getEventIcon(event.type)}
                                            <span>{event.label}</span>
                                        </div>
                                        <div className="text-gray-500 font-mono mt-0.5">{event.time}</div>
                                    </div>
                                    {/* Arrow */}
                                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Time labels */}
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-600 font-mono">00:00:00</span>
                <span className="text-[10px] text-gray-600 font-mono">{duration}</span>
            </div>
        </div>
    );
};
