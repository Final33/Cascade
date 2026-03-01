export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

export function formatPercent(n: number): string {
  if (n < 0.01) return `${(n * 100).toFixed(2)}%`;
  return `${(n * 100).toFixed(1)}%`;
}

export function formatDay(day: number): string {
  if (day < 1) return `${Math.round(day * 24)}h`;
  if (day < 7) return `Day ${Math.round(day)}`;
  if (day < 30) return `Week ${Math.round(day / 7)}`;
  return `Month ${Math.round(day / 30)}`;
}
