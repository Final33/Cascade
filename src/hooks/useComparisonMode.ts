"use client";

import { useState, useCallback } from "react";

export type ViewMode = "baseline" | "optimized" | "comparison";

export function useComparisonMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("baseline");
  const [showArcs, setShowArcs] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const toggleView = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    showArcs,
    showHeatmap,
    showLabels,
    toggleView,
    setShowArcs,
    setShowHeatmap,
    setShowLabels,
  };
}
