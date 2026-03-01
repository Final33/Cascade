"use client";

import { useState, useCallback } from "react";
import type { OutbreakConfig, ResourceConstraints, DiseasePreset } from "@/types/simulation";

const DEFAULT_CONFIG: OutbreakConfig = {
  city_id: "",
  r0: 2.5,
  incubation_period: 5.2,
  infectious_period: 10.0,
  fatality_rate: 0.01,
  initial_infected: 100,
};

const DEFAULT_RESOURCES: ResourceConstraints = {
  vaccines: 10_000_000,
  route_closures: 50,
  field_hospitals: 10,
};

export function useOutbreakConfig() {
  const [config, setConfig] = useState<OutbreakConfig>(DEFAULT_CONFIG);
  const [resources, setResources] = useState<ResourceConstraints>(DEFAULT_RESOURCES);

  const updateConfig = useCallback((updates: Partial<OutbreakConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateResources = useCallback((updates: Partial<ResourceConstraints>) => {
    setResources((prev) => ({ ...prev, ...updates }));
  }, []);

  const applyPreset = useCallback((preset: DiseasePreset) => {
    setConfig((prev) => ({
      ...prev,
      r0: preset.r0,
      incubation_period: preset.incubation_period,
      infectious_period: preset.infectious_period,
      fatality_rate: preset.fatality_rate,
    }));
  }, []);

  const selectCity = useCallback((cityId: string) => {
    setConfig((prev) => ({ ...prev, city_id: cityId }));
  }, []);

  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setResources(DEFAULT_RESOURCES);
  }, []);

  return {
    config,
    resources,
    updateConfig,
    updateResources,
    applyPreset,
    selectCity,
    reset,
  };
}
