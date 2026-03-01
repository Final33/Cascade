"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { WS_BASE_URL } from "@/lib/constants";
import { fetchFrame } from "@/lib/api";
import type { SimulationTick, SimulationState } from "@/types/simulation";

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    phase: "idle",
    currentFrame: 0,
    totalFrames: 0,
    currentTick: null,
    outbreakConfig: null,
    speed: 1.0,
    isPlaying: false,
    baselineSummary: null,
    optimizedSummary: null,
    livesSaved: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_BASE_URL}/ws/simulation`);

    ws.onmessage = (event) => {
      const tick: SimulationTick = JSON.parse(event.data);

      if (tick.phase === "complete") {
        setState((s) => ({ ...s, isPlaying: false, phase: "complete" }));
        return;
      }

      setState((s) => ({
        ...s,
        currentTick: tick,
        currentFrame: tick.tick,
        phase: tick.phase as SimulationState["phase"],
        baselineSummary: tick.baseline
          ? {
              total_infected: tick.baseline.total_infected,
              total_dead: tick.baseline.total_dead,
              total_recovered: tick.baseline.total_recovered,
            }
          : s.baselineSummary,
        optimizedSummary: tick.optimized
          ? {
              total_infected: tick.optimized.total_infected,
              total_dead: tick.optimized.total_dead,
              total_recovered: tick.optimized.total_recovered,
            }
          : s.optimizedSummary,
        livesSaved:
          tick.baseline && tick.optimized
            ? tick.baseline.total_dead - tick.optimized.total_dead
            : s.livesSaved,
      }));
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, []);

  const sendCommand = useCallback(
    (command: string, value?: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ command, value }));
      }
    },
    []
  );

  const play = useCallback(() => {
    connect();
    sendCommand("play");
    setState((s) => ({ ...s, isPlaying: true }));
  }, [connect, sendCommand]);

  const pause = useCallback(() => {
    sendCommand("pause");
    setState((s) => ({ ...s, isPlaying: false }));
  }, [sendCommand]);

  const seek = useCallback(
    (frame: number) => {
      sendCommand("seek", frame);
      setState((s) => ({ ...s, currentFrame: frame }));
    },
    [sendCommand]
  );

  const setSpeed = useCallback(
    (speed: number) => {
      sendCommand("speed", speed);
      setState((s) => ({ ...s, speed }));
    },
    [sendCommand]
  );

  const setTotalFrames = useCallback((total: number) => {
    setState((s) => ({ ...s, totalFrames: total }));
  }, []);

  const setPhase = useCallback((phase: SimulationState["phase"]) => {
    setState((s) => ({ ...s, phase }));
  }, []);

  const updateTick = useCallback((tick: SimulationTick) => {
    setState((s) => ({
      ...s,
      currentTick: tick,
      currentFrame: tick.tick,
      baselineSummary: tick.baseline
        ? {
            total_infected: tick.baseline.total_infected,
            total_dead: tick.baseline.total_dead,
            total_recovered: tick.baseline.total_recovered,
          }
        : s.baselineSummary,
      optimizedSummary: tick.optimized
        ? {
            total_infected: tick.optimized.total_infected,
            total_dead: tick.optimized.total_dead,
            total_recovered: tick.optimized.total_recovered,
          }
        : s.optimizedSummary,
      livesSaved:
        tick.baseline && tick.optimized
          ? tick.baseline.total_dead - tick.optimized.total_dead
          : s.livesSaved,
    }));
  }, []);

  const setOutbreakConfig = useCallback((config: SimulationState["outbreakConfig"]) => {
    setState((s) => ({ ...s, outbreakConfig: config }));
  }, []);

  // Polling-based playback (fallback when WS not available)
  const startPolling = useCallback(
    (totalFrames: number) => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);

      let frame = 0;
      setState((s) => ({ ...s, isPlaying: true, totalFrames: totalFrames }));

      frameIntervalRef.current = setInterval(async () => {
        if (frame >= totalFrames) {
          if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
          setState((s) => ({ ...s, isPlaying: false, phase: "complete" }));
          return;
        }

        try {
          const tick = (await fetchFrame(frame)) as SimulationTick;
          updateTick(tick);
          frame++;
        } catch {
          // skip frame on error
          frame++;
        }
      }, 100 / state.speed);
    },
    [state.speed, updateTick]
  );

  const stopPolling = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, []);

  return {
    state,
    play,
    pause,
    seek,
    setSpeed,
    setTotalFrames,
    setPhase,
    updateTick,
    setOutbreakConfig,
    startPolling,
    stopPolling,
    connect,
  };
}
