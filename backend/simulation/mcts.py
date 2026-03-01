"""
Monte Carlo Tree Search (MCTS) optimizer for pandemic resource allocation.

Uses UCB1 selection, SEIR rollouts as the forward model, and integrates
submodular greedy for the resource placement subproblem.

The search explores different combinations and timings of interventions
to minimize total casualties over a simulation horizon.
"""
from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

import numpy as np

from simulation.seir import SEIRModel, SEIRParams, Interventions, S, E, I, R, D
from simulation.submodular import (
    greedy_vaccine_allocation,
    greedy_route_closure,
    greedy_hospital_placement,
)

if TYPE_CHECKING:
    from simulation.graph import AirportGraph


@dataclass
class MCTSAction:
    """A discrete action in the MCTS tree."""
    action_type: str  # "VACCINATE", "CLOSE_ROUTE", "DEPLOY_HOSPITAL"
    target: int | tuple[int, int]
    amount: float = 0.0

    def __hash__(self):
        return hash((self.action_type, str(self.target), self.amount))

    def __eq__(self, other):
        if not isinstance(other, MCTSAction):
            return False
        return (self.action_type == other.action_type
                and self.target == other.target
                and self.amount == other.amount)


@dataclass
class MCTSNode:
    """A node in the MCTS search tree."""
    state: np.ndarray
    day: float
    remaining_vaccines: float
    remaining_closures: int
    remaining_hospitals: int
    parent: MCTSNode | None = None
    action: MCTSAction | None = None
    children: list[MCTSNode] = field(default_factory=list)
    visits: int = 0
    total_reward: float = 0.0
    untried_actions: list[MCTSAction] | None = None
    interventions: Interventions = field(default_factory=Interventions)

    @property
    def avg_reward(self) -> float:
        if self.visits == 0:
            return 0.0
        return self.total_reward / self.visits

    def ucb1(self, c: float = 1.414) -> float:
        if self.visits == 0:
            return float("inf")
        exploitation = self.avg_reward
        exploration = c * math.sqrt(math.log(self.parent.visits) / self.visits)
        return exploitation + exploration


class MCTSOptimizer:
    """
    Monte Carlo Tree Search optimizer for pandemic resource allocation.
    
    Explores the space of intervention strategies (vaccine allocation,
    route closures, hospital deployments) to minimize total casualties.
    """

    def __init__(
        self,
        graph: AirportGraph,
        params: SEIRParams,
        max_iterations: int = 500,
        rollout_horizon_days: int = 30,
        max_depth: int = 8,
        top_k_cities: int = 15,
        exploration_constant: float = 1.414,
    ):
        self.graph = graph
        self.params = params
        self.max_iterations = max_iterations
        self.rollout_horizon = rollout_horizon_days
        self.rollout_steps = int(rollout_horizon_days / params.dt)
        self.max_depth = max_depth
        self.top_k = top_k_cities
        self.c = exploration_constant
        self.best_reward = float("-inf")
        self.best_interventions: Interventions | None = None
        self.iterations_completed = 0

    def _generate_actions(
        self,
        state: np.ndarray,
        remaining_vaccines: float,
        remaining_closures: int,
        remaining_hospitals: int,
    ) -> list[MCTSAction]:
        """Generate candidate actions using progressive widening."""
        actions: list[MCTSAction] = []

        # Vaccine actions: top-K cities by disease burden
        if remaining_vaccines > 0:
            burden = state[:, E] + state[:, I]
            top_cities = np.argsort(burden)[::-1][:self.top_k]
            dose_sizes = [500_000, 1_000_000, 2_000_000]
            for city_idx in top_cities:
                if burden[city_idx] < 10:
                    continue
                for dose in dose_sizes:
                    if dose <= remaining_vaccines and state[city_idx, S] > dose:
                        actions.append(MCTSAction("VACCINATE", int(city_idx), float(dose)))

        # Route closure actions: top infectious routes
        if remaining_closures > 0:
            n_pop = np.sum(state[:, :4], axis=1)
            n_pop = np.maximum(n_pop, 1.0)
            inf_frac = state[:, I] / n_pop

            route_scores: list[tuple[float, int, int]] = []
            for u, v, data in self.graph.graph.edges(data=True):
                si = self.graph.node_index.get(u)
                di = self.graph.node_index.get(v)
                if si is None or di is None:
                    continue
                score = data.get("weight", 0) * inf_frac[si]
                route_scores.append((score, si, di))

            route_scores.sort(reverse=True)
            for score, si, di in route_scores[:self.top_k]:
                if score > 0:
                    actions.append(MCTSAction("CLOSE_ROUTE", (si, di)))

        # Hospital deployment actions
        if remaining_hospitals > 0:
            infections = state[:, I]
            top_infected = np.argsort(infections)[::-1][:self.top_k]
            for city_idx in top_infected:
                if infections[city_idx] > 100:
                    actions.append(MCTSAction("DEPLOY_HOSPITAL", int(city_idx)))

        if not actions:
            actions.append(MCTSAction("VACCINATE", 0, 0))

        return actions

    def _apply_action(
        self, action: MCTSAction, interventions: Interventions,
        remaining_vaccines: float, remaining_closures: int, remaining_hospitals: int,
    ) -> tuple[Interventions, float, int, int]:
        """Apply an action and return updated interventions + remaining resources."""
        new_interventions = Interventions(
            vaccinated_nodes=dict(interventions.vaccinated_nodes),
            closed_routes=set(interventions.closed_routes),
            hospital_nodes=set(interventions.hospital_nodes),
        )

        rv, rc, rh = remaining_vaccines, remaining_closures, remaining_hospitals

        if action.action_type == "VACCINATE" and isinstance(action.target, int):
            node_idx = action.target
            doses = min(action.amount, rv)
            new_interventions.vaccinated_nodes[node_idx] = (
                new_interventions.vaccinated_nodes.get(node_idx, 0) + doses
            )
            rv -= doses

        elif action.action_type == "CLOSE_ROUTE" and isinstance(action.target, tuple):
            new_interventions.closed_routes.add(action.target)
            rc -= 1

        elif action.action_type == "DEPLOY_HOSPITAL" and isinstance(action.target, int):
            new_interventions.hospital_nodes.add(action.target)
            rh -= 1

        return new_interventions, rv, rc, rh

    def _rollout(self, state: np.ndarray, interventions: Interventions) -> float:
        """
        Perform a simulation rollout using submodular greedy for remaining resources,
        then return negative total deaths as the reward.
        """
        model = SEIRModel(self.graph, self.params)
        model.state = state.copy()
        model.interventions = interventions

        for _ in range(self.rollout_steps):
            model.step()

        total_dead = model.total_dead()
        return -total_dead

    def _select(self, node: MCTSNode) -> MCTSNode:
        """Select a leaf node using UCB1 tree policy."""
        current = node
        depth = 0
        while depth < self.max_depth:
            if current.untried_actions is None:
                current.untried_actions = self._generate_actions(
                    current.state,
                    current.remaining_vaccines,
                    current.remaining_closures,
                    current.remaining_hospitals,
                )

            if current.untried_actions:
                return current

            if not current.children:
                return current

            current = max(current.children, key=lambda c: c.ucb1(self.c))
            depth += 1

        return current

    def _expand(self, node: MCTSNode) -> MCTSNode:
        """Expand the tree by adding a child for an untried action."""
        if not node.untried_actions:
            return node

        action = node.untried_actions.pop(random.randrange(len(node.untried_actions)))

        new_interventions, rv, rc, rh = self._apply_action(
            action, node.interventions,
            node.remaining_vaccines, node.remaining_closures, node.remaining_hospitals,
        )

        # Simulate a few steps forward to get new state
        model = SEIRModel(self.graph, self.params)
        model.state = node.state.copy()
        model.interventions = new_interventions
        advance_steps = int(3.0 / self.params.dt)  # 3 days between decisions
        for _ in range(advance_steps):
            model.step()

        child = MCTSNode(
            state=model.state.copy(),
            day=node.day + 3.0,
            remaining_vaccines=rv,
            remaining_closures=rc,
            remaining_hospitals=rh,
            parent=node,
            action=action,
            interventions=new_interventions,
        )
        node.children.append(child)
        return child

    def _backpropagate(self, node: MCTSNode, reward: float) -> None:
        """Propagate reward up the tree."""
        current: MCTSNode | None = node
        while current is not None:
            current.visits += 1
            current.total_reward += reward
            current = current.parent

    def optimize(
        self,
        initial_state: np.ndarray,
        total_vaccines: int = 10_000_000,
        max_route_closures: int = 50,
        max_hospitals: int = 10,
        progress_callback=None,
    ) -> Interventions:
        """
        Run MCTS optimization and return the best intervention strategy found.
        
        progress_callback: optional callable(iteration, best_reward) for live updates.
        """
        root = MCTSNode(
            state=initial_state.copy(),
            day=0.0,
            remaining_vaccines=float(total_vaccines),
            remaining_closures=max_route_closures,
            remaining_hospitals=max_hospitals,
        )

        for iteration in range(self.max_iterations):
            # Selection
            node = self._select(root)

            # Expansion
            if node.untried_actions:
                node = self._expand(node)

            # Rollout
            reward = self._rollout(node.state, node.interventions)

            # Backpropagation
            self._backpropagate(node, reward)

            # Track best
            if reward > self.best_reward:
                self.best_reward = reward
                self.best_interventions = Interventions(
                    vaccinated_nodes=dict(node.interventions.vaccinated_nodes),
                    closed_routes=set(node.interventions.closed_routes),
                    hospital_nodes=set(node.interventions.hospital_nodes),
                )

            self.iterations_completed = iteration + 1

            if progress_callback and (iteration % 10 == 0 or iteration == self.max_iterations - 1):
                progress_callback(iteration + 1, self.best_reward)

        if self.best_interventions is None:
            self.best_interventions = Interventions()

        return self.best_interventions

    def get_best_actions(self) -> list[dict]:
        """Return the best actions found as serializable dicts."""
        if self.best_interventions is None:
            return []

        actions = []
        for node_idx, doses in self.best_interventions.vaccinated_nodes.items():
            iata = self.graph.node_ids[node_idx] if node_idx < len(self.graph.node_ids) else str(node_idx)
            actions.append({
                "type": "VACCINATE",
                "target": iata,
                "amount": doses,
                "day": 0,
            })
        for si, di in self.best_interventions.closed_routes:
            src = self.graph.node_ids[si] if si < len(self.graph.node_ids) else str(si)
            dst = self.graph.node_ids[di] if di < len(self.graph.node_ids) else str(di)
            actions.append({
                "type": "CLOSE_ROUTE",
                "target": f"{src}-{dst}",
                "amount": 0,
                "day": 0,
            })
        for node_idx in self.best_interventions.hospital_nodes:
            iata = self.graph.node_ids[node_idx] if node_idx < len(self.graph.node_ids) else str(node_idx)
            actions.append({
                "type": "DEPLOY_HOSPITAL",
                "target": iata,
                "amount": 0,
                "day": 0,
            })

        return actions
