"use client";

import { formatNumber, formatPercent } from "@/lib/format";
import type { NodeState } from "@/types/simulation";

interface CityDetailPopupProps {
  node: NodeState | null;
  onClose: () => void;
}

export default function CityDetailPopup({ node, onClose }: CityDetailPopupProps) {
  if (!node) return null;

  const totalPop = node.S + node.E + node.I + node.R;
  const infectionRate = totalPop > 0 ? node.I / totalPop : 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-72">
      <div className="rounded-xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{node.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono">{node.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-lg leading-none"
          >
            x
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] text-slate-500 uppercase">Susceptible</div>
              <div className="text-xs font-mono text-green-400">{formatNumber(node.S)}</div>
            </div>
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] text-slate-500 uppercase">Exposed</div>
              <div className="text-xs font-mono text-yellow-400">{formatNumber(node.E)}</div>
            </div>
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] text-slate-500 uppercase">Infectious</div>
              <div className="text-xs font-mono text-red-400">{formatNumber(node.I)}</div>
            </div>
            <div className="p-2 rounded bg-white/5">
              <div className="text-[9px] text-slate-500 uppercase">Recovered</div>
              <div className="text-xs font-mono text-cyan-400">{formatNumber(node.R)}</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-white/5">
            <span className="text-[10px] text-slate-500">Deaths</span>
            <span className="text-xs font-mono text-red-500">{formatNumber(node.D)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500">Infection Rate</span>
            <span className="text-xs font-mono text-orange-400">
              {formatPercent(infectionRate)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500">Population</span>
            <span className="text-xs font-mono text-slate-300">
              {formatNumber(node.population)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
