"use client";

import { formatNumber, formatPercent } from "@/lib/format";
import type { SimulationTick } from "@/types/simulation";

interface MetricsPanelProps {
  tick: SimulationTick | null;
  viewMode: "baseline" | "optimized" | "comparison";
  outbreakConfig: {
    r0: number;
    fatality_rate: number;
  } | null;
}

function Metric({
  label,
  value,
  color = "text-white",
  small = false,
}: {
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className={`${small ? "text-xs" : "text-sm"} font-mono ${color}`}>{value}</span>
    </div>
  );
}

export default function MetricsPanel({
  tick,
  viewMode,
  outbreakConfig,
}: MetricsPanelProps) {
  if (!tick) {
    return (
      <div className="p-3 text-center text-xs text-slate-600">
        Seed an outbreak to see metrics
      </div>
    );
  }

  const snapshot =
    viewMode === "optimized" && tick.optimized
      ? tick.optimized
      : tick.baseline;

  if (!snapshot) return null;

  const totalPop = snapshot.nodes.reduce((sum, n) => sum + n.population, 0);
  const totalInfected = snapshot.total_infected;
  const totalDead = snapshot.total_dead;
  const currentlyInfected = snapshot.nodes.reduce((sum, n) => sum + n.I, 0);
  const exposed = snapshot.nodes.reduce((sum, n) => sum + n.E, 0);
  const susceptible = snapshot.nodes.reduce((sum, n) => sum + n.S, 0);
  const fracSusceptible = totalPop > 0 ? susceptible / totalPop : 0;
  const rEff = outbreakConfig ? outbreakConfig.r0 * fracSusceptible : 0;
  const infectedCities = snapshot.nodes.filter((n) => n.I > 100).length;

  return (
    <div className="space-y-1 divide-y divide-white/5">
      <div className="pb-1">
        <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
          Epidemiological Metrics
        </h4>
      </div>

      <div className="pt-1">
        <Metric label="Day" value={tick.day.toFixed(1)} />
        <Metric
          label="R_eff"
          value={rEff.toFixed(2)}
          color={rEff > 1 ? "text-red-400" : "text-green-400"}
        />
        <Metric label="Currently Infected" value={formatNumber(currentlyInfected)} color="text-amber-400" />
        <Metric label="Exposed" value={formatNumber(exposed)} color="text-yellow-500" />
        <Metric label="Total Infected" value={formatNumber(totalInfected)} color="text-orange-400" />
        <Metric label="Total Deaths" value={formatNumber(totalDead)} color="text-red-400" />
        <Metric label="Cities Affected" value={`${infectedCities}`} color="text-orange-300" />
        <Metric
          label="Population Susceptible"
          value={formatPercent(fracSusceptible)}
          color="text-slate-300"
        />
      </div>

      {tick.optimizer_progress && (
        <div className="pt-1">
          <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 mt-1">
            Optimizer
          </h4>
          <Metric
            label="MCTS Iterations"
            value={`${tick.optimizer_progress.iterations}`}
            small
          />
          <Metric
            label="Best Reward"
            value={formatNumber(Math.abs(tick.optimizer_progress.best_reward))}
            color="text-cyan-400"
            small
          />
        </div>
      )}
    </div>
  );
}
