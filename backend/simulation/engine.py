"""
Simulation engine orchestrator.
Manages the full pipeline: graph loading, outbreak seeding, baseline simulation,
MCTS optimization, optimized simulation, and state streaming.
"""
from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from typing import Any, Callable

import numpy as np

from simulation.graph import AirportGraph
from simulation.seir import SEIRModel, SEIRParams, Interventions, S, E, I, R, D
from simulation.mcts import MCTSOptimizer
from simulation.submodular import full_greedy_allocation


DISEASE_PRESETS: dict[str, dict] = {
    "covid_19": {
        "name": "COVID-19",
        "r0": 2.5,
        "incubation_period": 5.2,
        "infectious_period": 10.0,
        "fatality_rate": 0.01,
        "description": "SARS-CoV-2 pandemic (2019-2023). Moderate transmissibility, low fatality rate.",
    },
    "ebola": {
        "name": "Ebola",
        "r0": 1.8,
        "incubation_period": 8.3,
        "infectious_period": 9.4,
        "fatality_rate": 0.50,
        "description": "Ebola virus disease. Lower transmissibility but extremely high fatality rate.",
    },
    "h1n1": {
        "name": "H1N1 Influenza",
        "r0": 1.5,
        "incubation_period": 1.4,
        "infectious_period": 4.1,
        "fatality_rate": 0.0002,
        "description": "2009 H1N1 swine flu pandemic. Fast-spreading but very low fatality.",
    },
    "sars": {
        "name": "SARS",
        "r0": 3.0,
        "incubation_period": 4.6,
        "infectious_period": 15.0,
        "fatality_rate": 0.096,
        "description": "SARS-CoV-1 (2003). High transmissibility and significant fatality rate.",
    },
    "measles": {
        "name": "Measles",
        "r0": 15.0,
        "incubation_period": 10.0,
        "infectious_period": 8.0,
        "fatality_rate": 0.002,
        "description": "Extremely contagious airborne virus. Very high R0 but low modern fatality.",
    },
}


class SimulationEngine:
    """
    Central orchestrator for the Cascade simulation system.
    
    Manages the airport graph, runs baseline and optimized SEIR simulations,
    and coordinates MCTS optimization.
    """

    def __init__(self):
        self.graph = AirportGraph(top_n=500)
        self.params: SEIRParams | None = None
        self.baseline_model: SEIRModel | None = None
        self.optimized_model: SEIRModel | None = None
        self.baseline_history: list[dict] = []
        self.optimized_history: list[dict] = []
        self.optimizer: MCTSOptimizer | None = None
        self.best_actions: list[dict] = []
        self.outbreak_config: dict | None = None
        self._running = False
        self._phase = "idle"

    def load_data(self) -> None:
        """Load the airport graph data."""
        self.graph.load()

    def get_presets(self) -> list[dict]:
        """Return disease presets."""
        return [
            {"preset": key, **val}
            for key, val in DISEASE_PRESETS.items()
        ]

    def get_graph_response(self) -> dict:
        """Return serialized graph for the frontend."""
        return self.graph.get_graph_response()

    def seed_outbreak(
        self,
        city_id: str,
        r0: float = 2.5,
        incubation_period: float = 5.2,
        infectious_period: float = 10.0,
        fatality_rate: float = 0.01,
        initial_infected: int = 100,
    ) -> dict:
        """
        Seed a new outbreak at the given city and run baseline simulation.
        Returns summary of the seeded outbreak.
        """
        self.params = SEIRParams(
            r0=r0,
            incubation_period=incubation_period,
            infectious_period=infectious_period,
            fatality_rate=fatality_rate,
        )

        node_idx = self.graph.node_index.get(city_id)
        if node_idx is None:
            city_id = self.graph.find_nearest(0, 0)
            node_idx = self.graph.node_index[city_id]

        self.baseline_model = SEIRModel(self.graph, self.params)
        self.baseline_model.seed_outbreak(node_idx, initial_infected)

        self.optimized_model = None
        self.baseline_history = []
        self.optimized_history = []
        self.best_actions = []
        self._phase = "seeded"

        self.outbreak_config = {
            "city_id": city_id,
            "city_name": self.graph.node_data[node_idx].get("city", city_id),
            "r0": r0,
            "incubation_period": incubation_period,
            "infectious_period": infectious_period,
            "fatality_rate": fatality_rate,
            "initial_infected": initial_infected,
        }

        return self.outbreak_config

    def _snapshot_to_dict(self, model: SEIRModel, actions: list[dict] | None = None) -> dict:
        """Convert current model state to a serializable dict."""
        nodes = []
        for i, iata in enumerate(self.graph.node_ids):
            nd = self.graph.node_data[i]
            nodes.append({
                "id": iata,
                "S": float(model.state[i, S]),
                "E": float(model.state[i, E]),
                "I": float(model.state[i, I]),
                "R": float(model.state[i, R]),
                "D": float(model.state[i, D]),
                "lat": nd["lat"],
                "lng": nd["lng"],
                "population": nd.get("population", 500_000),
                "name": nd.get("city", iata),
            })
        return {
            "nodes": nodes,
            "total_infected": model.total_infected(),
            "total_dead": model.total_dead(),
            "total_recovered": model.total_recovered(),
            "actions_taken": actions or [],
        }

    def run_baseline(self, days: int = 180, ticks_per_snapshot: int = 4) -> list[dict]:
        """
        Run the baseline (no intervention) simulation and store history.
        ticks_per_snapshot=4 means one snapshot per day (dt=0.25).
        """
        if self.baseline_model is None:
            raise ValueError("No outbreak seeded. Call seed_outbreak first.")

        self.baseline_history = []
        self._phase = "baseline"
        total_steps = int(days / self.params.dt)

        for step in range(total_steps):
            self.baseline_model.step()
            if step % ticks_per_snapshot == 0:
                snap = self._snapshot_to_dict(self.baseline_model)
                self.baseline_history.append({
                    "tick": step,
                    "day": self.baseline_model.day,
                    **snap,
                })

        return self.baseline_history

    def run_optimization(
        self,
        total_vaccines: int = 10_000_000,
        max_route_closures: int = 50,
        max_hospitals: int = 10,
        mcts_iterations: int = 200,
        rollout_horizon_days: int = 30,
        progress_callback=None,
    ) -> dict:
        """
        Run MCTS optimization on the outbreak, then simulate with optimal strategy.
        """
        if self.baseline_model is None or self.outbreak_config is None:
            raise ValueError("No outbreak seeded.")

        self._phase = "optimizing"

        # Re-create model from initial state
        node_idx = self.graph.node_index[self.outbreak_config["city_id"]]
        initial_model = SEIRModel(self.graph, self.params)
        initial_model.seed_outbreak(node_idx, self.outbreak_config["initial_infected"])

        # Run a short simulation to get a state with some spread for optimization
        warmup_days = 7
        warmup_steps = int(warmup_days / self.params.dt)
        for _ in range(warmup_steps):
            initial_model.step()

        self.optimizer = MCTSOptimizer(
            graph=self.graph,
            params=self.params,
            max_iterations=mcts_iterations,
            rollout_horizon_days=rollout_horizon_days,
        )

        best_interventions = self.optimizer.optimize(
            initial_state=initial_model.state,
            total_vaccines=total_vaccines,
            max_route_closures=max_route_closures,
            max_hospitals=max_hospitals,
            progress_callback=progress_callback,
        )

        self.best_actions = self.optimizer.get_best_actions()
        self._phase = "optimized"

        return {
            "iterations": self.optimizer.iterations_completed,
            "best_reward": self.optimizer.best_reward,
            "actions": self.best_actions,
        }

    def run_optimized_simulation(self, days: int = 180, ticks_per_snapshot: int = 4) -> list[dict]:
        """Run the optimized simulation using the best interventions found."""
        if self.optimizer is None or self.outbreak_config is None:
            raise ValueError("Optimization not run yet.")

        node_idx = self.graph.node_index[self.outbreak_config["city_id"]]
        self.optimized_model = SEIRModel(self.graph, self.params)
        self.optimized_model.seed_outbreak(node_idx, self.outbreak_config["initial_infected"])
        self.optimized_model.interventions = self.optimizer.best_interventions

        self.optimized_history = []
        total_steps = int(days / self.params.dt)

        for step in range(total_steps):
            self.optimized_model.step()
            if step % ticks_per_snapshot == 0:
                snap = self._snapshot_to_dict(self.optimized_model, self.best_actions)
                self.optimized_history.append({
                    "tick": step,
                    "day": self.optimized_model.day,
                    **snap,
                })

        return self.optimized_history

    def get_comparison_frame(self, frame_idx: int) -> dict:
        """Get a single comparison frame (baseline vs optimized) for streaming."""
        baseline = self.baseline_history[frame_idx] if frame_idx < len(self.baseline_history) else None
        optimized = self.optimized_history[frame_idx] if frame_idx < len(self.optimized_history) else None

        day = baseline["day"] if baseline else (optimized["day"] if optimized else 0)
        tick = baseline["tick"] if baseline else (optimized["tick"] if optimized else 0)

        result: dict[str, Any] = {
            "tick": tick,
            "day": day,
            "phase": self._phase,
        }

        if baseline:
            result["baseline"] = {
                "nodes": baseline["nodes"],
                "total_infected": baseline["total_infected"],
                "total_dead": baseline["total_dead"],
                "total_recovered": baseline["total_recovered"],
            }

        if optimized:
            result["optimized"] = {
                "nodes": optimized["nodes"],
                "total_infected": optimized["total_infected"],
                "total_dead": optimized["total_dead"],
                "total_recovered": optimized["total_recovered"],
                "actions_taken": optimized.get("actions_taken", []),
            }

        if self.optimizer:
            result["optimizer_progress"] = {
                "iterations": self.optimizer.iterations_completed,
                "best_reward": self.optimizer.best_reward,
            }

        return result

    @property
    def total_frames(self) -> int:
        return max(len(self.baseline_history), len(self.optimized_history))
