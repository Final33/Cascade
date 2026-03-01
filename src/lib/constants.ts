export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const WS_BASE_URL = API_BASE_URL.replace("http", "ws");

export const INFECTION_COLORS = {
  none: "#22c55e",
  low: "#eab308",
  medium: "#f97316",
  high: "#ef4444",
  critical: "#991b1b",
} as const;

export const CONTAINMENT_COLORS = {
  vaccine: "#06b6d4",
  hospital: "#3b82f6",
  closure: "#6b7280",
} as const;

export const GLOBE_COLORS = {
  ocean: "#0d1b2a",
  land: "#1b2838",
  atmosphere: "#0a0a0f",
  arcNormal: "rgba(255, 255, 255, 0.15)",
  arcInfected: "rgba(239, 68, 68, 0.6)",
  arcClosed: "rgba(107, 114, 128, 0.3)",
} as const;

export function getInfectionColor(infectionRate: number): string {
  if (infectionRate < 0.001) return INFECTION_COLORS.none;
  if (infectionRate < 0.01) return INFECTION_COLORS.low;
  if (infectionRate < 0.05) return INFECTION_COLORS.medium;
  if (infectionRate < 0.15) return INFECTION_COLORS.high;
  return INFECTION_COLORS.critical;
}

export function getInfectionIntensity(infectionRate: number): number {
  return Math.min(1.0, infectionRate * 10);
}
