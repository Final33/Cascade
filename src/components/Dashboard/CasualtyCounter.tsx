"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";

interface CasualtyCounterProps {
  baselineDead: number;
  optimizedDead: number;
  livesSaved: number;
  showOptimized: boolean;
}

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = prevRef.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span>{formatNumber(Math.round(display))}</span>;
}

export default function CasualtyCounter({
  baselineDead,
  optimizedDead,
  livesSaved,
  showOptimized,
}: CasualtyCounterProps) {
  return (
    <div className="space-y-3">
      {/* Lives Saved -- the knockout punch */}
      {showOptimized && livesSaved > 0 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-medium mb-1">
            Lives Saved
          </div>
          <div className="text-3xl font-bold font-mono text-cyan-400 tracking-tight">
            <AnimatedNumber value={livesSaved} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Baseline deaths */}
        <div className="p-2.5 rounded-lg bg-red-500/[0.07] border border-red-500/20">
          <div className="text-[9px] text-red-400 uppercase tracking-wider mb-0.5">
            No Intervention
          </div>
          <div className="text-lg font-bold font-mono text-red-400">
            <AnimatedNumber value={baselineDead} />
          </div>
          <div className="text-[9px] text-slate-500">projected deaths</div>
        </div>

        {/* Optimized deaths */}
        <div className="p-2.5 rounded-lg bg-cyan-500/[0.07] border border-cyan-500/20">
          <div className="text-[9px] text-cyan-400 uppercase tracking-wider mb-0.5">
            Optimized
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">
            {showOptimized ? (
              <AnimatedNumber value={optimizedDead} />
            ) : (
              <span className="text-slate-600">--</span>
            )}
          </div>
          <div className="text-[9px] text-slate-500">projected deaths</div>
        </div>
      </div>
    </div>
  );
}
