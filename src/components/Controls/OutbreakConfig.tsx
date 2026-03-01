"use client";

import { cn } from "@/lib/utils";
import type { OutbreakConfig as OutbreakConfigType } from "@/types/simulation";

interface OutbreakConfigProps {
  config: OutbreakConfigType;
  onUpdate: (updates: Partial<OutbreakConfigType>) => void;
  selectedCity: string;
  disabled?: boolean;
}

function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-xs font-mono text-white">
          {value < 0.01 ? value.toFixed(4) : value.toFixed(2)}
          {unit && <span className="text-slate-500 ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
          [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(6,182,212,0.5)]
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default function OutbreakConfig({
  config,
  onUpdate,
  selectedCity,
  disabled = false,
}: OutbreakConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400">Origin City</label>
        <div className={cn(
          "px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 font-mono text-sm",
          selectedCity ? "text-white" : "text-slate-500"
        )}>
          {selectedCity || "Click a city on the globe"}
        </div>
      </div>

      <ParamSlider
        label="R₀ (Basic Reproduction Number)"
        value={config.r0}
        min={0.5}
        max={20}
        step={0.1}
        onChange={(v) => onUpdate({ r0: v })}
        disabled={disabled}
      />

      <ParamSlider
        label="Incubation Period"
        value={config.incubation_period}
        min={0.5}
        max={30}
        step={0.1}
        unit="days"
        onChange={(v) => onUpdate({ incubation_period: v })}
        disabled={disabled}
      />

      <ParamSlider
        label="Infectious Period"
        value={config.infectious_period}
        min={1}
        max={60}
        step={0.5}
        unit="days"
        onChange={(v) => onUpdate({ infectious_period: v })}
        disabled={disabled}
      />

      <ParamSlider
        label="Fatality Rate (IFR)"
        value={config.fatality_rate}
        min={0}
        max={1}
        step={0.001}
        onChange={(v) => onUpdate({ fatality_rate: v })}
        disabled={disabled}
      />

      <ParamSlider
        label="Initial Infected"
        value={config.initial_infected}
        min={1}
        max={10000}
        step={10}
        onChange={(v) => onUpdate({ initial_infected: Math.round(v) })}
        disabled={disabled}
      />
    </div>
  );
}
