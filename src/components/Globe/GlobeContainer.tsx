"use client";

import dynamic from "next/dynamic";
import type { GraphData, SimulationTick } from "@/types/simulation";

const CascadeGlobe = dynamic(() => import("./CascadeGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-mono">Initializing globe...</p>
      </div>
    </div>
  ),
});

interface GlobeContainerProps {
  graphData: GraphData | null;
  currentTick: SimulationTick | null;
  onCityClick?: (cityId: string) => void;
  showArcs?: boolean;
  showHeatmap?: boolean;
  viewMode?: "baseline" | "optimized" | "comparison";
}

export default function GlobeContainer(props: GlobeContainerProps) {
  return (
    <div className="relative w-full h-full">
      <CascadeGlobe {...props} />
    </div>
  );
}
