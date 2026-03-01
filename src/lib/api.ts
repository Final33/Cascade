import { API_BASE_URL } from "./constants";
import type {
  GraphData,
  OutbreakConfig,
  ResourceConstraints,
  DiseasePreset,
} from "@/types/simulation";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function fetchGraph(): Promise<GraphData> {
  return fetchAPI<GraphData>("/api/graph");
}

export async function fetchPresets(): Promise<DiseasePreset[]> {
  return fetchAPI<DiseasePreset[]>("/api/presets");
}

export async function seedOutbreak(config: OutbreakConfig) {
  return fetchAPI("/api/outbreak", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function runOptimization(
  resources: ResourceConstraints,
  mcts_iterations: number = 200,
  rollout_horizon_days: number = 30
) {
  return fetchAPI("/api/optimize", {
    method: "POST",
    body: JSON.stringify({
      resources,
      mcts_iterations,
      rollout_horizon_days,
    }),
  });
}

export async function fetchFrame(frameIdx: number) {
  return fetchAPI(`/api/simulation/frame/${frameIdx}`);
}

export async function fetchSummary() {
  return fetchAPI("/api/simulation/summary");
}

export async function fetchWHOOutbreaks() {
  return fetchAPI("/api/who-outbreaks");
}
