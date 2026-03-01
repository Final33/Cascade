"use client";

import { useCallback, useEffect, useState } from "react";
import GlobeContainer from "@/components/Globe/GlobeContainer";
import PresetSelector from "@/components/Controls/PresetSelector";
import OutbreakConfigPanel from "@/components/Controls/OutbreakConfig";
import ResourcePanel from "@/components/Controls/ResourcePanel";
import TimelineScrubber from "@/components/Controls/TimelineScrubber";
import ComparisonToggle from "@/components/Controls/ComparisonToggle";
import WHOOutbreaks from "@/components/Controls/WHOOutbreaks";
import CasualtyCounter from "@/components/Dashboard/CasualtyCounter";
import MetricsPanel from "@/components/Dashboard/MetricsPanel";
import OptimizationLog from "@/components/Dashboard/OptimizationLog";
import CityDetailPopup from "@/components/Dashboard/CityDetailPopup";
import { useSimulation } from "@/hooks/useSimulation";
import { useOutbreakConfig } from "@/hooks/useOutbreakConfig";
import { useComparisonMode } from "@/hooks/useComparisonMode";
import { fetchGraph, seedOutbreak, runOptimization, fetchFrame } from "@/lib/api";
import type { GraphData, SimulationTick, NodeState, Action } from "@/types/simulation";

export default function CascadePage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeState | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const sim = useSimulation();
  const outbreak = useOutbreakConfig();
  const comparison = useComparisonMode();

  // Load graph on mount
  useEffect(() => {
    fetchGraph()
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle city click on globe
  const handleCityClick = useCallback(
    (cityId: string) => {
      outbreak.selectCity(cityId);
      if (sim.state.currentTick) {
        const snapshot =
          comparison.viewMode === "optimized" && sim.state.currentTick.optimized
            ? sim.state.currentTick.optimized
            : sim.state.currentTick.baseline;
        const node = snapshot?.nodes.find((n) => n.id === cityId);
        if (node) setSelectedNode(node);
      }
    },
    [outbreak, sim.state.currentTick, comparison.viewMode]
  );

  // Seed outbreak
  const handleSeedOutbreak = useCallback(async () => {
    if (!outbreak.config.city_id) return;
    setSeeding(true);
    setActions([]);
    try {
      const result = (await seedOutbreak(outbreak.config)) as any;
      sim.setTotalFrames(result.baseline_frames || 0);
      sim.setPhase("baseline");
      sim.setOutbreakConfig(outbreak.config);

      // Start polling frames
      if (result.baseline_frames > 0) {
        sim.startPolling(result.baseline_frames);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSeeding(false);
    }
  }, [outbreak.config, sim]);

  // Run optimization
  const handleOptimize = useCallback(async () => {
    setOptimizing(true);
    sim.setPhase("optimizing");
    try {
      const result = (await runOptimization(
        outbreak.resources,
        200,
        30
      )) as any;
      setActions(result.result?.actions || []);
      sim.setTotalFrames(result.optimized_frames || 0);
      sim.setPhase("optimized");
      comparison.toggleView("comparison");

      // Replay with optimized data
      if (result.optimized_frames > 0) {
        sim.stopPolling();
        sim.startPolling(result.optimized_frames);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOptimizing(false);
    }
  }, [outbreak.resources, sim, comparison]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-cyan-500/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white mb-1">Cascade</h1>
            <p className="text-sm text-slate-500">Loading global flight network...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentDay = sim.state.currentTick?.day || 0;
  const hasOptimized = sim.state.phase === "optimized" || sim.state.phase === "complete" || actions.length > 0;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0a0f] relative">
      {/* Globe */}
      <div className="absolute inset-0 globe-container">
        <GlobeContainer
          graphData={graphData}
          currentTick={sim.state.currentTick}
          onCityClick={handleCityClick}
          showArcs={comparison.showArcs}
          viewMode={comparison.viewMode === "comparison" ? "baseline" : comparison.viewMode}
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white tracking-tight">
            <span className="text-cyan-400">C</span>ascade
          </h1>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            Pandemic Outbreak Predictor
          </span>
        </div>

        <ComparisonToggle
          viewMode={comparison.viewMode}
          onToggle={comparison.toggleView}
          hasOptimized={hasOptimized}
        />
      </div>

      {/* Left Panel -- Controls */}
      <div
        className={`absolute left-0 top-14 bottom-14 z-30 transition-all duration-300 ${
          leftPanelOpen ? "w-80" : "w-0"
        }`}
      >
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="absolute -right-8 top-4 z-40 w-6 h-12 rounded-r-lg bg-white/5 border border-l-0 border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          {leftPanelOpen ? "<" : ">"}
        </button>

        {leftPanelOpen && (
          <div className="h-full overflow-y-auto glass rounded-r-2xl p-4 space-y-5">
            <PresetSelector
              onSelect={outbreak.applyPreset}
              selectedPreset={undefined}
            />

            <WHOOutbreaks
              onSelect={(ob) => {
                // WHO outbreaks don't map directly to SEIR params,
                // but we surface them as inspiration for scenario selection
              }}
            />

            <div className="h-px bg-white/5" />

            <OutbreakConfigPanel
              config={outbreak.config}
              onUpdate={outbreak.updateConfig}
              selectedCity={outbreak.config.city_id}
              disabled={seeding || optimizing}
            />

            <button
              onClick={handleSeedOutbreak}
              disabled={!outbreak.config.city_id || seeding || optimizing}
              className="w-full py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium
                hover:bg-red-500/30 hover:border-red-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                glow-red"
            >
              {seeding ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                  Simulating...
                </span>
              ) : (
                "Seed Outbreak"
              )}
            </button>

            <div className="h-px bg-white/5" />

            <ResourcePanel
              resources={outbreak.resources}
              onUpdate={outbreak.updateResources}
              disabled={optimizing}
            />

            <button
              onClick={handleOptimize}
              disabled={sim.state.phase === "idle" || optimizing}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium
                hover:bg-cyan-500/30 hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                glow-cyan"
            >
              {optimizing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  Optimizing...
                </span>
              ) : (
                "Run MCTS Optimizer"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Panel -- Dashboard */}
      <div
        className={`absolute right-0 top-14 bottom-14 z-30 transition-all duration-300 ${
          rightPanelOpen ? "w-72" : "w-0"
        }`}
      >
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="absolute -left-8 top-4 z-40 w-6 h-12 rounded-l-lg bg-white/5 border border-r-0 border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          {rightPanelOpen ? ">" : "<"}
        </button>

        {rightPanelOpen && (
          <div className="h-full overflow-y-auto glass rounded-l-2xl p-4 space-y-4">
            <CasualtyCounter
              baselineDead={sim.state.baselineSummary?.total_dead || 0}
              optimizedDead={sim.state.optimizedSummary?.total_dead || 0}
              livesSaved={sim.state.livesSaved}
              showOptimized={hasOptimized}
            />

            <div className="h-px bg-white/5" />

            <MetricsPanel
              tick={sim.state.currentTick}
              viewMode={comparison.viewMode === "comparison" ? "baseline" : comparison.viewMode}
              outbreakConfig={sim.state.outbreakConfig ? {
                r0: sim.state.outbreakConfig.r0,
                fatality_rate: sim.state.outbreakConfig.fatality_rate,
              } : outbreak.config ? {
                r0: outbreak.config.r0,
                fatality_rate: outbreak.config.fatality_rate,
              } : null}
            />

            <div className="h-px bg-white/5" />

            <OptimizationLog
              actions={actions}
              isOptimizing={optimizing}
              iterations={sim.state.currentTick?.optimizer_progress?.iterations}
            />
          </div>
        )}
      </div>

      {/* Timeline Scrubber -- Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 glass border-t border-white/5">
        <TimelineScrubber
          currentFrame={sim.state.currentFrame}
          totalFrames={sim.state.totalFrames}
          currentDay={currentDay}
          isPlaying={sim.state.isPlaying}
          speed={sim.state.speed}
          onPlay={sim.play}
          onPause={sim.pause}
          onSeek={sim.seek}
          onSpeedChange={sim.setSpeed}
        />
      </div>

      {/* City Detail Popup */}
      <CityDetailPopup
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* Error Toast */}
      {error && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-300 hover:text-white"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
