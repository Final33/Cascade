"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeInstance } from "react-globe.gl";
import { getInfectionColor, getInfectionIntensity, GLOBE_COLORS } from "@/lib/constants";
import type { GraphData, GraphNode, SimulationTick, NodeState } from "@/types/simulation";

interface CascadeGlobeProps {
  graphData: GraphData | null;
  currentTick: SimulationTick | null;
  onCityClick?: (cityId: string) => void;
  showArcs?: boolean;
  showHeatmap?: boolean;
  viewMode?: "baseline" | "optimized" | "comparison";
  width?: number;
  height?: number;
}

interface PointData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  population: number;
  infectionRate: number;
  infected: number;
  dead: number;
  color: string;
  altitude: number;
  radius: number;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
  stroke: number;
  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;
}

interface RingData {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: string;
}

export default function CascadeGlobe({
  graphData,
  currentTick,
  onCityClick,
  showArcs = true,
  viewMode = "baseline",
  width,
  height,
}: CascadeGlobeProps) {
  const globeRef = useRef<GlobeInstance | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (width && height) {
      setDimensions({ width, height });
      return;
    }
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [width, height]);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.3;
      globe.controls().enableZoom = true;
      globe.pointOfView({ altitude: 2.5 });
    }
  }, []);

  const nodeStates = useMemo(() => {
    if (!currentTick) return new Map<string, NodeState>();
    const snapshot =
      viewMode === "optimized" && currentTick.optimized
        ? currentTick.optimized
        : currentTick.baseline;
    if (!snapshot) return new Map<string, NodeState>();
    const map = new Map<string, NodeState>();
    for (const n of snapshot.nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [currentTick, viewMode]);

  const pointsData = useMemo<PointData[]>(() => {
    if (!graphData) return [];
    return graphData.nodes.map((node) => {
      const ns = nodeStates.get(node.id);
      const totalPop = ns ? ns.S + ns.E + ns.I + ns.R : node.population;
      const infected = ns ? ns.I : 0;
      const dead = ns ? ns.D : 0;
      const infectionRate = totalPop > 0 ? infected / totalPop : 0;
      const popScale = Math.log10(Math.max(node.population, 1000)) / 7;

      return {
        id: node.id,
        lat: node.lat,
        lng: node.lng,
        name: node.city || node.name,
        population: node.population,
        infectionRate,
        infected: Math.round(infected),
        dead: Math.round(dead),
        color: ns ? getInfectionColor(infectionRate) : "#22c55e",
        altitude: infectionRate > 0 ? 0.01 + infectionRate * 0.15 : 0.005,
        radius: 0.15 + popScale * 0.4 + getInfectionIntensity(infectionRate) * 0.3,
      };
    });
  }, [graphData, nodeStates]);

  const arcsData = useMemo<ArcData[]>(() => {
    if (!graphData || !showArcs) return [];

    const nodeMap = new Map(graphData.nodes.map((n) => [n.id, n]));
    const maxEdges = 500;

    const sortedEdges = [...graphData.edges]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxEdges);

    return sortedEdges.map((edge) => {
      const src = nodeMap.get(edge.source);
      const dst = nodeMap.get(edge.target);
      if (!src || !dst) return null;

      const srcState = nodeStates.get(edge.source);
      const srcPop = srcState ? srcState.S + srcState.E + srcState.I + srcState.R : 1;
      const srcInfRate = srcState && srcPop > 0 ? srcState.I / srcPop : 0;

      let color: string[];
      if (srcInfRate > 0.05) {
        color = ["rgba(239, 68, 68, 0.6)", "rgba(239, 68, 68, 0.2)"];
      } else if (srcInfRate > 0.001) {
        color = ["rgba(234, 179, 8, 0.4)", "rgba(234, 179, 8, 0.1)"];
      } else {
        color = ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.02)"];
      }

      return {
        startLat: src.lat,
        startLng: src.lng,
        endLat: dst.lat,
        endLng: dst.lng,
        color,
        stroke: 0.3 + srcInfRate * 3,
        dashLength: 0.5,
        dashGap: 1,
        dashAnimateTime: srcInfRate > 0 ? 2000 - srcInfRate * 1500 : 4000,
      };
    }).filter(Boolean) as ArcData[];
  }, [graphData, showArcs, nodeStates]);

  const ringsData = useMemo<RingData[]>(() => {
    if (!currentTick) return [];
    const snapshot =
      viewMode === "optimized" && currentTick.optimized
        ? currentTick.optimized
        : currentTick.baseline;
    if (!snapshot?.actions_taken?.length) return [];

    const nodeMap = graphData
      ? new Map(graphData.nodes.map((n) => [n.id, n]))
      : new Map<string, GraphNode>();

    return snapshot.actions_taken
      .filter((a) => a.type === "VACCINATE" || a.type === "DEPLOY_HOSPITAL")
      .map((action) => {
        const node = nodeMap.get(action.target);
        if (!node) return null;
        return {
          lat: node.lat,
          lng: node.lng,
          maxR: action.type === "VACCINATE" ? 3 : 5,
          propagationSpeed: 2,
          repeatPeriod: 1500,
          color: action.type === "VACCINATE" ? "rgba(6, 182, 212, 0.6)" : "rgba(59, 130, 246, 0.6)",
        };
      })
      .filter(Boolean) as RingData[];
  }, [currentTick, viewMode, graphData]);

  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as PointData;
      if (onCityClick && p.id) {
        onCityClick(p.id);
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.5 }, 1000);
          globeRef.current.controls().autoRotate = false;
        }
      }
    },
    [onCityClick]
  );

  const pointLabel = useCallback((point: object) => {
    const p = point as PointData;
    return `
      <div style="background: rgba(10, 10, 15, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; font-family: system-ui; min-width: 160px;">
        <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 6px;">${p.name}</div>
        <div style="font-size: 11px; color: #94a3b8;">Population: ${(p.population / 1e6).toFixed(1)}M</div>
        ${p.infected > 0 ? `
          <div style="font-size: 11px; color: ${p.color}; margin-top: 3px;">Infected: ${p.infected.toLocaleString()}</div>
          <div style="font-size: 11px; color: #ef4444; margin-top: 2px;">Deaths: ${p.dead.toLocaleString()}</div>
        ` : '<div style="font-size: 11px; color: #22c55e; margin-top: 3px;">No infections</div>'}
      </div>
    `;
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0">
      <Globe
        ref={globeRef as any}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#1e40af"
        atmosphereAltitude={0.15}
        // Points
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude="altitude"
        pointRadius="radius"
        pointLabel={pointLabel}
        onPointClick={handlePointClick}
        // Arcs
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke="stroke"
        arcDashLength="dashLength"
        arcDashGap="dashGap"
        arcDashAnimateTime="dashAnimateTime"
        arcAltitudeAutoScale={0.3}
        // Rings (containment waves)
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringColor="color"
      />
    </div>
  );
}
