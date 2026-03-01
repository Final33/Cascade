"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Users, Truck, UserPlus } from 'lucide-react';

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

interface SetupModalProps {
    isOpen: boolean;
    onClose: (units: Unit[], personnel: Personnel[]) => void;
    availableUnits: Unit[];
    availablePersonnel: Personnel[];
}

const DEFAULT_UNITS: Unit[] = [
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
    { id: 'MED2', code: 'MED2', status: 'standby' },
];

export const SetupModal: React.FC<SetupModalProps> = ({
    isOpen,
    onClose,
    availableUnits = DEFAULT_UNITS,
    availablePersonnel = []
}) => {
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(
        new Set(['E1', 'E2', 'E3', 'T1', 'R1', 'B1'])
    );
    const [personnel, setPersonnel] = useState<Personnel[]>(availablePersonnel);
    const [newPersonnelName, setNewPersonnelName] = useState('');
    const [activeTab, setActiveTab] = useState<'units' | 'personnel'>('units');

    const toggleUnit = (unitId: string) => {
        const newSelected = new Set(selectedUnits);
        if (newSelected.has(unitId)) {
            newSelected.delete(unitId);
        } else {
            newSelected.add(unitId);
        }
        setSelectedUnits(newSelected);
    };

    const addPersonnel = () => {
        if (newPersonnelName.trim()) {
            const newPerson: Personnel = {
                id: newPersonnelName.trim().replace(/\s+/g, '-'),
                name: newPersonnelName.trim(),
                status: 'active'
            };
            setPersonnel([...personnel, newPerson]);
            setNewPersonnelName('');
        }
    };

    const removePersonnel = (id: string) => {
        setPersonnel(personnel.filter(p => p.id !== id));
    };

    const handleConfirm = () => {
        const selectedUnitList = availableUnits.filter(u => selectedUnits.has(u.id));
        onClose(selectedUnitList, personnel);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Incident Setup</h2>
                            <p className="text-xs text-gray-500 mt-1">Configure units and personnel</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-800">
                        <button
                            onClick={() => setActiveTab('units')}
                            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'units'
                                    ? 'text-green-400 border-b-2 border-green-400 bg-gray-800/30'
                                    : 'text-gray-500'
                                }`}
                        >
                            <Truck className="w-4 h-4" />
                            Units ({selectedUnits.size})
                        </button>
                        <button
                            onClick={() => setActiveTab('personnel')}
                            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'personnel'
                                    ? 'text-green-400 border-b-2 border-green-400 bg-gray-800/30'
                                    : 'text-gray-500'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Personnel ({personnel.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 max-h-[400px] overflow-y-auto">
                        {activeTab === 'units' ? (
                            <div className="grid grid-cols-3 gap-2">
                                {availableUnits.map((unit) => {
                                    const isSelected = selectedUnits.has(unit.id);
                                    return (
                                        <button
                                            key={unit.id}
                                            onClick={() => toggleUnit(unit.id)}
                                            className={`
                        px-3 py-2 rounded text-sm font-mono flex items-center justify-between gap-2 transition-colors
                        ${isSelected
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                                    : 'bg-gray-800/50 text-gray-500 border border-gray-700/40'
                                                }
                      `}
                                        >
                                            <span>{unit.code}</span>
                                            {isSelected && <Check className="w-3 h-3" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Add Personnel Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newPersonnelName}
                                        onChange={(e) => setNewPersonnelName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPersonnel()}
                                        placeholder="Enter name..."
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                                    />
                                    <button
                                        onClick={addPersonnel}
                                        disabled={!newPersonnelName.trim()}
                                        className="px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/40 rounded text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>

                                {/* Personnel List */}
                                <div className="space-y-1">
                                    {personnel.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            No personnel added yet
                                        </div>
                                    ) : (
                                        personnel.map((person) => (
                                            <div
                                                key={person.id}
                                                className="flex items-center justify-between px-3 py-2 bg-gray-800/50 border border-gray-700/40 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${person.status === 'critical' ? 'bg-red-500' : 'bg-green-500'
                                                        }`} />
                                                    <span className="text-sm text-gray-300">{person.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => removePersonnel(person.id)}
                                                    className="p-1 text-gray-500 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
                        <button
                            onClick={handleConfirm}
                            disabled={selectedUnits.size === 0}
                            className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/40 rounded text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            Start Incident ({selectedUnits.size} units, {personnel.length} personnel)
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SetupModal;
