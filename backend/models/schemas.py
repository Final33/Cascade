from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field


class DiseasePreset(str, Enum):
    COVID_19 = "covid_19"
    EBOLA = "ebola"
    H1N1 = "h1n1"
    SARS = "sars"
    MEASLES = "measles"
    CUSTOM = "custom"


class OutbreakConfig(BaseModel):
    city_id: str = Field(..., description="IATA code of the outbreak origin city")
    r0: float = Field(2.5, ge=0.1, le=20.0, description="Basic reproduction number")
    incubation_period: float = Field(5.2, ge=0.5, le=30.0, description="Incubation period in days")
    infectious_period: float = Field(10.0, ge=1.0, le=60.0, description="Infectious period in days")
    fatality_rate: float = Field(0.01, ge=0.0, le=1.0, description="Infection fatality rate")
    initial_infected: int = Field(100, ge=1, le=1_000_000)


class ResourceConstraints(BaseModel):
    vaccines: int = Field(10_000_000, ge=0, description="Total vaccine doses available")
    route_closures: int = Field(50, ge=0, description="Max flight routes to close")
    field_hospitals: int = Field(10, ge=0, description="Field hospitals to deploy")


class OptimizeRequest(BaseModel):
    resources: ResourceConstraints
    mcts_iterations: int = Field(500, ge=50, le=5000)
    rollout_horizon_days: int = Field(30, ge=7, le=180)


class ActionType(str, Enum):
    VACCINATE = "VACCINATE"
    CLOSE_ROUTE = "CLOSE_ROUTE"
    DEPLOY_HOSPITAL = "DEPLOY_HOSPITAL"


class Action(BaseModel):
    type: ActionType
    target: str
    amount: float = 0
    day: float = 0


class NodeState(BaseModel):
    id: str
    S: float
    E: float
    I: float
    R: float
    D: float
    lat: float
    lng: float
    population: float
    name: str


class SimulationSnapshot(BaseModel):
    nodes: list[NodeState]
    total_infected: float
    total_dead: float
    total_recovered: float
    actions_taken: list[Action] = []


class SimulationTick(BaseModel):
    tick: int
    day: float
    baseline: SimulationSnapshot
    optimized: SimulationSnapshot | None = None
    optimizer_progress: dict | None = None
    phase: str = "baseline"


class GraphNode(BaseModel):
    id: str
    name: str
    city: str
    country: str
    lat: float
    lng: float
    population: float
    degree: int = 0


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class PresetResponse(BaseModel):
    name: str
    preset: DiseasePreset
    r0: float
    incubation_period: float
    infectious_period: float
    fatality_rate: float
    description: str


class PlaybackCommand(BaseModel):
    command: str  # "play", "pause", "seek", "speed"
    value: float | None = None
