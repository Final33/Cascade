"use client";

import { useEffect, useState } from "react";
import { fetchPresets } from "@/lib/api";
import type { DiseasePreset } from "@/types/simulation";
import { cn } from "@/lib/utils";

const PRESET_ICONS: Record<string, string> = {
  covid_19: "C",
  ebola: "E",
  h1n1: "H",
  sars: "S",
  measles: "M",
};

const PRESET_COLORS: Record<string, string> = {
  covid_19: "border-red-500/40 hover:border-red-500",
  ebola: "border-purple-500/40 hover:border-purple-500",
  h1n1: "border-yellow-500/40 hover:border-yellow-500",
  sars: "border-orange-500/40 hover:border-orange-500",
  measles: "border-pink-500/40 hover:border-pink-500",
};

interface PresetSelectorProps {
  onSelect: (preset: DiseasePreset) => void;
  selectedPreset?: string;
}

export default function PresetSelector({ onSelect, selectedPreset }: PresetSelectorProps) {
  const [presets, setPresets] = useState<DiseasePreset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresets()
      .then(setPresets)
      .catch(() => {
        setPresets([
          { name: "COVID-19", preset: "covid_19", r0: 2.5, incubation_period: 5.2, infectious_period: 10, fatality_rate: 0.01, description: "SARS-CoV-2" },
          { name: "Ebola", preset: "ebola", r0: 1.8, incubation_period: 8.3, infectious_period: 9.4, fatality_rate: 0.5, description: "Ebola virus disease" },
          { name: "H1N1", preset: "h1n1", r0: 1.5, incubation_period: 1.4, infectious_period: 4.1, fatality_rate: 0.0002, description: "2009 swine flu" },
          { name: "SARS", preset: "sars", r0: 3.0, incubation_period: 4.6, infectious_period: 15, fatality_rate: 0.096, description: "SARS-CoV-1" },
          { name: "Measles", preset: "measles", r0: 15, incubation_period: 10, infectious_period: 8, fatality_rate: 0.002, description: "Extremely contagious" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-16 h-16 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Disease Preset</label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.preset}
            onClick={() => onSelect(preset)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200",
              "bg-white/[0.03] backdrop-blur-sm",
              PRESET_COLORS[preset.preset] || "border-slate-600/40 hover:border-slate-400",
              selectedPreset === preset.preset && "bg-white/10 ring-1 ring-white/20"
            )}
          >
            <span className="text-lg font-bold font-mono text-white">
              {PRESET_ICONS[preset.preset] || "?"}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">{preset.name}</span>
            <span className="text-[9px] text-slate-500">R₀={preset.r0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
