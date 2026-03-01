"use client";

import React from 'react';
import { Radio, AlertTriangle } from 'lucide-react';

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

interface CommandPanelProps {
    commandUnit?: string;
    commandName?: string;
    units: Unit[];
    personnel: Personnel[];
    selectedUnit?: string;
    selectedPersonnel?: string;
    onUnitSelect?: (unitId: string) => void;
    onPersonnelSelect?: (personnelId: string) => void;
}

export const CommandPanel: React.FC<CommandPanelProps> = ({
    commandUnit = "A",
    commandName = "In command",
    units = [],
    personnel = [],
    selectedUnit,
    selectedPersonnel,
    onUnitSelect,
    onPersonnelSelect
}) => {
    const triggerMAYDAY = (personnelId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Would trigger remote MAYDAY for this firefighter
        console.log(`MAYDAY triggered for ${personnelId}`);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Command Status */}
            <div className="p-4 border-b border-gray-800/40">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                        <span className="text-xs font-semibold text-green-400">{commandUnit}</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">{commandName}</span>
                </div>
                <div className="text-gray-500 text-xs font-mono mt-1">B36</div>
            </div>

            {/* Units List */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="text-gray-500 text-[10px] uppercase mb-2 tracking-wider font-medium">Units</div>
                <div className="space-y-0.5">
                    {units.map((unit) => (
                        <button
                            key={unit.id}
                            onClick={() => onUnitSelect?.(unit.id)}
                            className={`
                w-full px-3 py-2 rounded text-sm text-left font-mono transition-colors
                ${selectedUnit === unit.id
                                    ? 'bg-red-500/20 text-red-400 border-l-2 border-red-500'
                                    : unit.status === 'critical'
                                        ? 'text-red-400 bg-transparent border-l-2 border-transparent'
                                        : 'text-gray-400 bg-transparent border-l-2 border-transparent'
                                }
              `}
                        >
                            <div className="flex items-center gap-2">
                                {/* Status dot */}
                                <div className={`w-1.5 h-1.5 rounded-full ${unit.status === 'critical' ? 'bg-red-500' :
                                        unit.status === 'active' ? 'bg-green-500' : 'bg-gray-600'
                                    }`} />
                                <span>{unit.code}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Personnel List */}
            <div className="p-3 border-t border-gray-800/40">
                <div className="text-gray-500 text-[10px] uppercase mb-2 tracking-wider font-medium">Personnel</div>
                <div className="space-y-0.5">
                    {personnel.map((person) => (
                        <div
                            key={person.id}
                            onClick={() => onPersonnelSelect?.(person.id)}
                            className={`
                flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer transition-colors
                ${selectedPersonnel === person.id
                                    ? 'bg-red-500/20 text-red-400 border-l-2 border-red-500'
                                    : person.status === 'critical'
                                        ? 'text-red-400 bg-transparent border-l-2 border-transparent'
                                        : 'text-gray-400 bg-transparent border-l-2 border-transparent'
                                }
              `}
                        >
                            <div className="flex items-center gap-2">
                                {/* Status dot */}
                                <div className={`w-1.5 h-1.5 rounded-full ${person.status === 'critical' ? 'bg-red-500' : 'bg-green-500'
                                    }`} />
                                <span>{person.name}</span>
                            </div>

                            {/* Remote MAYDAY button */}
                            <button
                                onClick={(e) => triggerMAYDAY(person.id, e)}
                                className="p-1 text-gray-600 transition-colors"
                                title="Trigger Remote MAYDAY"
                            >
                                <AlertTriangle className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Signal indicator */}
            <div className="p-3 border-t border-gray-800/40 flex items-center justify-between">
                <span className="text-[10px] text-gray-600">Signal</span>
                <div className="flex items-center gap-1">
                    <div className="w-1 h-2 bg-green-500 rounded-sm" />
                    <div className="w-1 h-3 bg-green-500 rounded-sm" />
                    <div className="w-1 h-4 bg-green-500 rounded-sm" />
                    <div className="w-1 h-3 bg-gray-700 rounded-sm" />
                </div>
            </div>
        </div>
    );
};
