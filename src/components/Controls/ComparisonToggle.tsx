"use client";

import { cn } from "@/lib/utils";
import type { ViewMode } from "@/hooks/useComparisonMode";

interface ComparisonToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
  hasOptimized: boolean;
}

export default function ComparisonToggle({
  viewMode,
  onToggle,
  hasOptimized,
}: ComparisonToggleProps) {
  const modes: { mode: ViewMode; label: string; color: string }[] = [
    { mode: "baseline", label: "No Intervention", color: "text-red-400" },
    { mode: "optimized", label: "Optimized", color: "text-cyan-400" },
    { mode: "comparison", label: "Compare", color: "text-white" },
  ];

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.05] border border-white/10">
      {modes.map(({ mode, label, color }) => (
        <button
          key={mode}
          onClick={() => onToggle(mode)}
          disabled={mode !== "baseline" && !hasOptimized}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
            viewMode === mode
              ? `bg-white/10 ${color} shadow-sm`
              : "text-slate-500 hover:text-slate-300",
            mode !== "baseline" && !hasOptimized && "opacity-30 cursor-not-allowed"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
