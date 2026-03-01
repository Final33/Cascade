"use client";

import React, { useState } from 'react';
import {
    Eye,
    Droplets,
    Search,
    Flame,
    User,
    Wind,
    FileText,
    Check
} from 'lucide-react';

interface Milestone {
    id: string;
    label: string;
    icon: React.ReactNode;
    completed: boolean;
    timestamp?: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
    { id: 'inspection', label: 'Inspection', icon: <Eye className="w-4 h-4" />, completed: false },
    { id: 'water-supply', label: 'Water Supply', icon: <Droplets className="w-4 h-4" />, completed: false },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" />, completed: false },
    { id: 'interior-attack', label: 'Interior Attack', icon: <Flame className="w-4 h-4" />, completed: false },
    { id: 'victim-located', label: 'Victim Located', icon: <User className="w-4 h-4" />, completed: false },
    { id: 'knockdown', label: 'Knockdown', icon: <Wind className="w-4 h-4" />, completed: false },
    { id: 'request-resource', label: 'Request Resource', icon: <FileText className="w-4 h-4" />, completed: false },
];

interface MilestonesPanelProps {
    className?: string;
}

export const MilestonesPanel: React.FC<MilestonesPanelProps> = ({ className = "" }) => {
    const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);

    const toggleMilestone = (id: string) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    completed: !m.completed,
                    timestamp: !m.completed ? new Date().toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }) : undefined
                };
            }
            return m;
        }));
    };

    const completedCount = milestones.filter(m => m.completed).length;

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-800/40">
                <h3 className="text-sm font-medium text-gray-200 mb-1">Tactical Milestones</h3>
                <p className="text-xs text-gray-500">{completedCount} of {milestones.length} completed</p>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(completedCount / milestones.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Milestones List */}
            <div className="flex-1 overflow-y-auto p-2">
                {milestones.map((milestone) => (
                    <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors
              ${milestone.completed
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-gray-800/30 border border-gray-700/30'
                            }
            `}
                    >
                        {/* Checkbox */}
                        <div className={`
              w-5 h-5 rounded flex items-center justify-center flex-shrink-0
              ${milestone.completed
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700/50 border border-gray-600'
                            }
            `}>
                            {milestone.completed && <Check className="w-3 h-3" />}
                        </div>

                        {/* Icon */}
                        <div className={`${milestone.completed ? 'text-green-400' : 'text-gray-500'}`}>
                            {milestone.icon}
                        </div>

                        {/* Label & Timestamp */}
                        <div className="flex-1 text-left">
                            <span className={`text-sm ${milestone.completed ? 'text-green-300' : 'text-gray-300'}`}>
                                {milestone.label}
                            </span>
                            {milestone.timestamp && (
                                <span className="text-xs text-gray-500 ml-2 font-mono">
                                    {milestone.timestamp}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800/40">
                <p className="text-[10px] text-gray-600 text-center">
                    Milestones logged to incident timeline
                </p>
            </div>
        </div>
    );
};
