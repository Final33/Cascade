"use client";

import React, { useState } from 'react';
import { Users, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CommandPanel } from './CommandPanel';
import { FirefighterChat } from './FirefighterChat';

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

interface StatusPanelProps {
  commandUnit?: string;
  commandName?: string;
  units: Unit[];
  personnel: Personnel[];
  selectedUnit?: string;
  selectedPersonnel?: string;
  onUnitSelect?: (unitId: string) => void;
  onPersonnelSelect?: (personnelId: string) => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  commandUnit = "A",
  commandName = "In command",
  units = [],
  personnel = [],
  selectedUnit,
  selectedPersonnel,
  onUnitSelect,
  onPersonnelSelect
}) => {
  const [activeTab, setActiveTab] = useState<string>("command");

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-md border border-gray-800/50 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tab Headers */}
        <TabsList className="grid grid-cols-2 bg-gray-900/50 border-b border-gray-800/50 rounded-none h-auto p-0">
          <TabsTrigger
            value="command"
            className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium tracking-wide
                       data-[state=active]:bg-gray-800/50 data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400
                       data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-800/30
                       rounded-none transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Command</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium tracking-wide
                       data-[state=active]:bg-gray-800/50 data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400
                       data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-800/30
                       rounded-none transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="command" className="flex-1 mt-0 overflow-hidden">
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
        </TabsContent>

        <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
          <FirefighterChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};
