"""
Submodular greedy optimization for resource allocation.

The objective f(S) = cases_averted(S) is monotone submodular:
adding a resource allocation to any set always helps, with diminishing returns.

Greedy algorithm guarantee: achieves (1 - 1/e) ~= 63% of optimal.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

from simulation.seir import SEIRModel, SEIRParams, Interventions, S, E, I, R, D

if TYPE_CHECKING:
    from simulation.graph import AirportGraph


EVAL_HORIZON_DAYS = 7
EVAL_STEPS = int(EVAL_HORIZON_DAYS / 0.25)


def _quick_simulate(
    graph: AirportGraph,
    params: SEIRParams,
    state: np.ndarray,
    interventions: Interventions,
    steps: int = EVAL_STEPS,
) -> float:
    """Run a short SEIR simulation and return total deaths."""
    model = SEIRModel(graph, params)
    model.state = state.copy()
    model.interventions = interventions
    for _ in range(steps):
        model.step()
    return model.total_dead()


def greedy_vaccine_allocation(
    graph: AirportGraph,
    params: SEIRParams,
    state: np.ndarray,
    total_doses: int,
    max_cities: int = 20,
    batch_size: int = 500_000,
) -> dict[int, float]:
    """
    Greedily allocate vaccine doses to cities that maximize marginal gain
    (cases averted per batch).
    
    Returns: dict mapping node_index -> doses allocated.
    """
    allocation: dict[int, float] = {}
    remaining = float(total_doses)

    disease_burden = state[:, E] + state[:, I]
    candidates = np.argsort(disease_burden)[::-1][:max_cities * 2]
    candidates = [int(c) for c in candidates if state[c, S] > batch_size]

    if not candidates:
        candidates = list(range(min(max_cities, graph.n_nodes)))

    baseline_interventions = Interventions()
    baseline_deaths = _quick_simulate(graph, params, state, baseline_interventions)

    while remaining > 0 and candidates:
        best_gain = -1.0
        best_node = candidates[0]

        for node_idx in candidates:
            doses = min(batch_size, remaining, state[node_idx, S])
            if doses <= 0:
                continue

            test_interventions = Interventions(
                vaccinated_nodes={**allocation, node_idx: allocation.get(node_idx, 0) + doses}
            )
            deaths_with = _quick_simulate(graph, params, state, test_interventions)
            gain = baseline_deaths - deaths_with

            if gain > best_gain:
                best_gain = gain
                best_node = node_idx

        doses = min(batch_size, remaining, state[best_node, S])
        if doses <= 0:
            break

        allocation[best_node] = allocation.get(best_node, 0) + doses
        remaining -= doses

        if remaining <= 0:
            break

    return allocation


def greedy_route_closure(
    graph: AirportGraph,
    params: SEIRParams,
    state: np.ndarray,
    max_closures: int = 50,
) -> set[tuple[int, int]]:
    """
    Greedily close flight routes that carry the most infectious traffic.
    
    Ranks routes by flow * (I_source / N_source) and closes the top ones.
    """
    closures: set[tuple[int, int]] = set()

    n_pop = np.sum(state[:, :4], axis=1)
    n_pop = np.maximum(n_pop, 1.0)
    infectious_frac = state[:, I] / n_pop

    route_scores: list[tuple[float, int, int]] = []
    for u, v, data in graph.graph.edges(data=True):
        si = graph.node_index.get(u)
        di = graph.node_index.get(v)
        if si is None or di is None:
            continue
        weight = data.get("weight", 0)
        score = weight * infectious_frac[si]
        route_scores.append((score, si, di))

    route_scores.sort(reverse=True)

    for score, si, di in route_scores[:max_closures]:
        if score > 0:
            closures.add((si, di))

    return closures


def greedy_hospital_placement(
    graph: AirportGraph,
    state: np.ndarray,
    max_hospitals: int = 10,
) -> set[int]:
    """
    Place field hospitals at cities with the highest current infections.
    """
    infection_counts = state[:, I]
    top_indices = np.argsort(infection_counts)[::-1][:max_hospitals]
    return {int(idx) for idx in top_indices if infection_counts[idx] > 0}


def full_greedy_allocation(
    graph: AirportGraph,
    params: SEIRParams,
    state: np.ndarray,
    total_vaccines: int = 10_000_000,
    max_route_closures: int = 50,
    max_hospitals: int = 10,
) -> Interventions:
    """
    Run all greedy resource allocation strategies and return combined interventions.
    """
    vaccines = greedy_vaccine_allocation(graph, params, state, total_vaccines)
    closures = greedy_route_closure(graph, params, state, max_route_closures)
    hospitals = greedy_hospital_placement(graph, state, max_hospitals)

    return Interventions(
        vaccinated_nodes=vaccines,
        closed_routes=closures,
        hospital_nodes=hospitals,
    )
