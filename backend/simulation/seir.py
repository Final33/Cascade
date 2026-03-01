"""
Vectorized SEIR+D compartmental epidemiological model.
Runs on all graph nodes simultaneously using NumPy arrays.

State vector per node: [S, E, I, R, D]
  S = Susceptible
  E = Exposed (infected but not yet infectious)
  I = Infectious
  R = Recovered
  D = Dead

Inter-node transmission uses a sparse passenger flow matrix.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

import numpy as np
from scipy.sparse import csr_matrix

if TYPE_CHECKING:
    from simulation.graph import AirportGraph


S, E, I, R, D = 0, 1, 2, 3, 4


@dataclass
class SEIRParams:
    r0: float = 2.5
    incubation_period: float = 5.2
    infectious_period: float = 10.0
    fatality_rate: float = 0.01
    dt: float = 0.25

    @property
    def gamma(self) -> float:
        return 1.0 / self.infectious_period

    @property
    def sigma(self) -> float:
        return 1.0 / self.incubation_period

    @property
    def beta(self) -> float:
        return self.r0 * self.gamma


@dataclass
class Interventions:
    """Active interventions applied to the simulation."""
    vaccinated_nodes: dict[int, float] = field(default_factory=dict)
    closed_routes: set[tuple[int, int]] = field(default_factory=set)
    hospital_nodes: set[int] = field(default_factory=set)
    vaccine_rate_per_day: float = 50_000.0
    hospital_recovery_boost: float = 1.5


class SEIRModel:
    """
    Vectorized SEIR+D model running on an airport graph.
    
    State shape: (n_nodes, 5) where columns are [S, E, I, R, D].
    All updates are done with NumPy vectorized operations for performance.
    """

    def __init__(self, graph: AirportGraph, params: SEIRParams | None = None):
        self.graph = graph
        self.params = params or SEIRParams()
        n = graph.n_nodes
        self.state = np.zeros((n, 5), dtype=np.float64)
        self.state[:, S] = graph.populations.copy()
        self.day = 0.0
        self.tick = 0
        self.interventions = Interventions()
        self._modified_tm: csr_matrix | None = None

    def seed_outbreak(self, node_idx: int, initial_infected: int = 100) -> None:
        """Seed an outbreak at the given node index."""
        infected = min(initial_infected, self.state[node_idx, S])
        self.state[node_idx, S] -= infected
        self.state[node_idx, I] += infected

    def snapshot(self) -> np.ndarray:
        """Return a copy of the current state."""
        return self.state.copy()

    def restore(self, state: np.ndarray, day: float = 0.0, tick: int = 0) -> None:
        """Restore state from a snapshot."""
        self.state = state.copy()
        self.day = day
        self.tick = tick

    def _get_transmission_matrix(self) -> csr_matrix:
        """Return transmission matrix with route closures applied."""
        if not self.interventions.closed_routes:
            return self.graph.transmission_matrix

        if self._modified_tm is not None:
            return self._modified_tm

        tm = self.graph.transmission_matrix.copy().tolil()
        for si, di in self.interventions.closed_routes:
            tm[si, di] = 0.0
            tm[di, si] = 0.0
        self._modified_tm = tm.tocsr()
        return self._modified_tm

    def step(self) -> None:
        """Advance the simulation by one timestep (dt days)."""
        dt = self.params.dt
        beta = self.params.beta
        sigma = self.params.sigma
        gamma = self.params.gamma
        ifr = self.params.fatality_rate

        s = self.state[:, S]
        e = self.state[:, E]
        i = self.state[:, I]
        r = self.state[:, R]
        d = self.state[:, D]

        n_pop = s + e + i + r
        n_pop = np.maximum(n_pop, 1.0)

        # Intra-node transmission
        new_infections = beta * s * i / n_pop * dt

        # Inter-node transmission via flight network
        tm = self._get_transmission_matrix()
        infectious_fraction = i / n_pop
        # travel_exposure[i] = sum_j(tm[j,i] * I_j / N_j) * S_i
        travel_exposure = tm.T.dot(infectious_fraction)
        travel_infections = travel_exposure * s * dt

        total_new_exposed = new_infections + travel_infections

        # Disease progression
        new_infectious = sigma * e * dt
        recovery_rate = gamma
        for node_idx in self.interventions.hospital_nodes:
            pass  # applied below

        new_recoveries = recovery_rate * (1.0 - ifr) * i * dt
        new_deaths = recovery_rate * ifr * i * dt

        # Hospital boost: increase recovery rate at hospital nodes
        for node_idx in self.interventions.hospital_nodes:
            boost = self.interventions.hospital_recovery_boost
            extra_recovery = (boost - 1.0) * gamma * (1.0 - ifr) * i[node_idx] * dt
            new_recoveries[node_idx] += extra_recovery

        # Vaccination
        vaccination = np.zeros(self.graph.n_nodes, dtype=np.float64)
        rate = self.interventions.vaccine_rate_per_day * dt
        for node_idx, remaining in list(self.interventions.vaccinated_nodes.items()):
            dose = min(rate, remaining, s[node_idx])
            vaccination[node_idx] = dose
            self.interventions.vaccinated_nodes[node_idx] = remaining - dose
            if self.interventions.vaccinated_nodes[node_idx] <= 0:
                del self.interventions.vaccinated_nodes[node_idx]

        # Clamp to prevent negative populations
        total_new_exposed = np.minimum(total_new_exposed, s - vaccination)
        total_new_exposed = np.maximum(total_new_exposed, 0.0)
        new_infectious = np.minimum(new_infectious, e)
        new_recoveries = np.minimum(new_recoveries, i)
        new_deaths = np.minimum(new_deaths, i - new_recoveries)
        new_deaths = np.maximum(new_deaths, 0.0)

        # Update state
        self.state[:, S] = s - total_new_exposed - vaccination
        self.state[:, E] = e + total_new_exposed - new_infectious
        self.state[:, I] = i + new_infectious - new_recoveries - new_deaths
        self.state[:, R] = r + new_recoveries + vaccination
        self.state[:, D] = d + new_deaths

        # Clamp all to non-negative
        np.maximum(self.state, 0.0, out=self.state)

        self.day += dt
        self.tick += 1

    def run(self, days: int = 180) -> list[np.ndarray]:
        """Run simulation for the given number of days, returning snapshots."""
        steps = int(days / self.params.dt)
        history: list[np.ndarray] = [self.snapshot()]
        for _ in range(steps):
            self.step()
            history.append(self.snapshot())
        return history

    def total_infected(self) -> float:
        return float(np.sum(self.state[:, I]) + np.sum(self.state[:, R]) + np.sum(self.state[:, D]))

    def total_dead(self) -> float:
        return float(np.sum(self.state[:, D]))

    def total_recovered(self) -> float:
        return float(np.sum(self.state[:, R]))

    def total_currently_infected(self) -> float:
        return float(np.sum(self.state[:, I]))

    def effective_r(self) -> float:
        """Estimate effective reproduction number."""
        s = self.state[:, S]
        n_pop = np.sum(self.state[:, :4], axis=1)
        n_pop = np.maximum(n_pop, 1.0)
        frac_susceptible = np.sum(s) / np.sum(n_pop)
        return self.params.r0 * frac_susceptible
