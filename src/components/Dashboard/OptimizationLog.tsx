"use client";

import type { Action } from "@/types/simulation";
import { formatNumber } from "@/lib/format";

interface OptimizationLogProps {
  actions: Action[];
  isOptimizing: boolean;
  iterations?: number;
}

const ACTION_ICONS: Record<string, { icon: string; color: string }> = {
  VACCINATE: { icon: "💉", color: "text-cyan-400" },
  CLOSE_ROUTE: { icon: "✈️", color: "text-amber-400" },
  DEPLOY_HOSPITAL: { icon: "🏥", color: "text-blue-400" },
};

export default function OptimizationLog({
  actions,
  isOptimizing,
  iterations = 0,
}: OptimizationLogProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] text-slate-400 uppercase tracking-wider">
          Optimization Strategy
        </h4>
        {isOptimizing && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-cyan-400 font-mono">{iterations} iter</span>
          </div>
        )}
      </div>

      {actions.length === 0 ? (
        <div className="text-xs text-slate-600 italic">
          {isOptimizing ? "Computing optimal strategy..." : "No optimization run yet"}
        </div>
      ) : (
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {actions.map((action, i) => {
            const { icon, color } = ACTION_ICONS[action.type] || { icon: "?", color: "text-slate-400" };
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/[0.03] border border-white/5"
              >
                <span className="text-sm">{icon}</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-[11px] font-medium ${color}`}>
                    {action.type === "VACCINATE"
                      ? `Vaccinate ${action.target}`
                      : action.type === "CLOSE_ROUTE"
                      ? `Close ${action.target}`
                      : `Hospital at ${action.target}`}
                  </span>
                  {action.amount > 0 && (
                    <span className="text-[10px] text-slate-500 ml-1">
                      ({formatNumber(action.amount)} doses)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
