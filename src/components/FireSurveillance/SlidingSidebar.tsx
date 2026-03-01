"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Flag, MessageSquare, Flame } from 'lucide-react';
import { CommandPanel } from './CommandPanel';
import { MilestonesPanel } from './MilestonesPanel';
import { ForensicsPanel } from './ForensicsPanel';
import { FirefighterChat } from './FirefighterChat';
import { WildfirePanel } from './WildfirePanel';

interface Unit {
    id: string;
    code: string;
    status: 'active' | 'standby' | 'critical';
}

interface Personnel {
    id: string;
    name: string;
    unit?: string;
    status: 'active' | 'critical';
}

interface SlidingSidebarProps {
    commandUnit?: string;
    commandName?: string;
    units: Unit[];
    personnel: Personnel[];
    selectedUnit?: string;
    selectedPersonnel?: string;
    onUnitSelect?: (unitId: string) => void;
    onPersonnelSelect?: (personnelId: string) => void;
    incidentType?: 'structure' | 'wildfire';
    userLocation?: { lat: number; lon: number };
}

type TabId = 'command' | 'forensics' | 'milestones' | 'chat' | 'wildfire';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const STRUCTURE_TABS: Tab[] = [
    { id: 'command', label: 'Command', icon: <Users className="w-4 h-4" />, color: '#22c55e' },
    { id: 'forensics', label: 'Forensics', icon: <Search className="w-4 h-4" />, color: '#22c55e' },
    { id: 'milestones', label: 'Milestones', icon: <Flag className="w-4 h-4" />, color: '#22c55e' },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-4 h-4" />, color: '#f97316' },
];

const WILDFIRE_TABS: Tab[] = [
    { id: 'command', label: 'Command', icon: <Users className="w-4 h-4" />, color: '#22c55e' },
    { id: 'wildfire', label: 'Wildfire', icon: <Flame className="w-4 h-4" />, color: '#ef4444' },
    { id: 'milestones', label: 'Milestones', icon: <Flag className="w-4 h-4" />, color: '#22c55e' },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-4 h-4" />, color: '#f97316' },
];

export const SlidingSidebar: React.FC<SlidingSidebarProps> = ({
    commandUnit = "A",
    commandName = "In command",
    units = [],
    personnel = [],
    selectedUnit,
    selectedPersonnel,
    onUnitSelect,
    onPersonnelSelect,
    incidentType = 'structure',
    userLocation = { lat: 38.9893, lon: -77.6106 }
}) => {
    const [activeTab, setActiveTab] = useState<TabId>('command');
    const [isExpanded, setIsExpanded] = useState(true);

    const tabs = incidentType === 'wildfire' ? WILDFIRE_TABS : STRUCTURE_TABS;

    const handleTabClick = (tabId: TabId) => {
        if (activeTab === tabId) {
            setIsExpanded(!isExpanded);
        } else {
            setActiveTab(tabId);
            setIsExpanded(true);
        }
    };

    const renderPanelContent = () => {
        switch (activeTab) {
            case 'command':
                return (
                    <CommandPanel
                        commandUnit={commandUnit}
                        commandName={commandName}
                        units={units}
                        personnel={personnel}
                        selectedUnit={selectedUnit}
                        selectedPersonnel={selectedPersonnel}
                        onUnitSelect={onUnitSelect}
                        onPersonnelSelect={onPersonnelSelect}
                    />
                );
            case 'forensics':
                return <ForensicsPanel personnel={personnel} />;
            case 'milestones':
                return <MilestonesPanel />;
            case 'chat':
                return <FirefighterChat />;
            case 'wildfire':
                return <WildfirePanel latitude={userLocation.lat} longitude={userLocation.lon} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full">
            {/* Main Panel Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 256, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="h-full bg-black/70 backdrop-blur-sm border-l border-gray-800/40 overflow-hidden"
                    >
                        <div className="w-64 h-full overflow-hidden">
                            {renderPanelContent()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vertical Tab Bar */}
            <div className="flex flex-col bg-gray-900/80 border-l border-gray-800/40">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id && isExpanded;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`
                relative flex items-center justify-center py-4 px-2 transition-colors
                ${isActive
                                    ? 'bg-gray-800/60'
                                    : 'bg-transparent'
                                }
              `}
                            style={{
                                borderLeft: isActive ? `2px solid ${tab.color}` : '2px solid transparent'
                            }}
                        >
                            {/* Vertical Label */}
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className="transition-colors"
                                    style={{ color: isActive ? tab.color : '#6b7280' }}
                                >
                                    {tab.icon}
                                </div>
                                <span
                                    className="text-[10px] font-medium tracking-wide transition-colors"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        color: isActive ? tab.color : '#6b7280'
                                    }}
                                >
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
