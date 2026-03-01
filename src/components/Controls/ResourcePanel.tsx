"use client";

import type { ResourceConstraints } from "@/types/simulation";
import { formatNumber } from "@/lib/format";

interface ResourcePanelProps {
  resources: ResourceConstraints;
  onUpdate: (updates: Partial<ResourceConstraints>) => void;
  disabled?: boolean;
}

function ResourceSlider({
  label,
  value,
  min,
  max,
  step,
  icon,
  color,
  formatValue,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  icon: string;
  color: string;
  formatValue?: (v: number) => string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <label className="text-xs text-slate-300 font-medium">{label}</label>
        </div>
        <span className="text-xs font-mono text-white">
          {formatValue ? formatValue(value) : value.toLocaleString()}
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
        className={`w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20
          [&::-webkit-slider-thumb]:${color}
          disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{
          background: `linear-gradient(to right, ${color === "bg-cyan-500" ? "#06b6d4" : color === "bg-amber-500" ? "#f59e0b" : "#3b82f6"} 0%, ${color === "bg-cyan-500" ? "#06b6d4" : color === "bg-amber-500" ? "#f59e0b" : "#3b82f6"} ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`,
        }}
      />
    </div>
  );
}

export default function ResourcePanel({
  resources,
  onUpdate,
  disabled = false,
}: ResourcePanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        Resource Constraints
      </h3>

      <ResourceSlider
        label="Vaccine Doses"
        value={resources.vaccines}
        min={0}
        max={100_000_000}
        step={1_000_000}
        icon="💉"
        color="bg-cyan-500"
        formatValue={formatNumber}
        onChange={(v) => onUpdate({ vaccines: v })}
        disabled={disabled}
      />

      <ResourceSlider
        label="Route Closures"
        value={resources.route_closures}
        min={0}
        max={200}
        step={5}
        icon="✈️"
        color="bg-amber-500"
        onChange={(v) => onUpdate({ route_closures: v })}
        disabled={disabled}
      />

      <ResourceSlider
        label="Field Hospitals"
        value={resources.field_hospitals}
        min={0}
        max={50}
        step={1}
        icon="🏥"
        color="bg-blue-500"
        onChange={(v) => onUpdate({ field_hospitals: v })}
        disabled={disabled}
      />
    </div>
  );
}
