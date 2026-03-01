export interface NodeState {
  id: string;
  S: number;
  E: number;
  I: number;
  R: number;
  D: number;
  lat: number;
  lng: number;
  population: number;
  name: string;
}

export interface SimulationSnapshot {
  nodes: NodeState[];
  total_infected: number;
  total_dead: number;
  total_recovered: number;
  actions_taken?: Action[];
}

export interface SimulationTick {
  tick: number;
  day: number;
  baseline?: SimulationSnapshot;
  optimized?: SimulationSnapshot;
  optimizer_progress?: {
    iterations: number;
    best_reward: number;
  };
  phase: string;
}

export interface Action {
  type: "VACCINATE" | "CLOSE_ROUTE" | "DEPLOY_HOSPITAL";
  target: string;
  amount: number;
  day: number;
}

export interface GraphNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface OutbreakConfig {
  city_id: string;
  r0: number;
  incubation_period: number;
  infectious_period: number;
  fatality_rate: number;
  initial_infected: number;
}

export interface ResourceConstraints {
  vaccines: number;
  route_closures: number;
  field_hospitals: number;
}

export interface DiseasePreset {
  name: string;
  preset: string;
  r0: number;
  incubation_period: number;
  infectious_period: number;
  fatality_rate: number;
  description: string;
}

export interface SimulationState {
  phase: "idle" | "seeding" | "baseline" | "optimizing" | "optimized" | "playing" | "complete";
  currentFrame: number;
  totalFrames: number;
  currentTick: SimulationTick | null;
  outbreakConfig: OutbreakConfig | null;
  speed: number;
  isPlaying: boolean;
  baselineSummary: {
    total_infected: number;
    total_dead: number;
    total_recovered: number;
  } | null;
  optimizedSummary: {
    total_infected: number;
    total_dead: number;
    total_recovered: number;
  } | null;
  livesSaved: number;
}
