"""
Airport transportation network graph built from OpenFlights data.
Uses NetworkX DiGraph with airports as nodes and flight routes as weighted edges.
"""
from __future__ import annotations

import json
from pathlib import Path

import networkx as nx
import numpy as np
from scipy.sparse import lil_matrix, csr_matrix

from data.loader import load_or_build_graph


class AirportGraph:
    """
    Global airport transportation network for epidemic simulation.
    
    Nodes: airports (IATA code, lat/lng, population)
    Edges: flight routes weighted by estimated daily passenger volume
    """

    def __init__(self, top_n: int = 500):
        self.top_n = top_n
        self.graph = nx.DiGraph()
        self.node_ids: list[str] = []
        self.node_index: dict[str, int] = {}
        self.node_data: list[dict] = []
        self.populations: np.ndarray = np.array([])
        self.transmission_matrix: csr_matrix | None = None
        self._loaded = False

    def load(self) -> None:
        """Load the airport graph from cached data."""
        data = load_or_build_graph(self.top_n)
        self._build_from_data(data)
        self._loaded = True

    def _build_from_data(self, data: dict) -> None:
        nodes = data["nodes"]
        edges = data["edges"]

        self.node_ids = []
        self.node_index = {}
        self.node_data = []

        for i, node in enumerate(nodes):
            iata = node["id"]
            self.node_ids.append(iata)
            self.node_index[iata] = i
            self.node_data.append(node)
            self.graph.add_node(iata, **node)

        self.populations = np.array(
            [n.get("population", 500_000) for n in nodes], dtype=np.float64
        )

        n = len(nodes)
        tm = lil_matrix((n, n), dtype=np.float64)

        for edge in edges:
            src = edge["source"]
            dst = edge["target"]
            if src in self.node_index and dst in self.node_index:
                si = self.node_index[src]
                di = self.node_index[dst]
                weight = edge["weight"]
                self.graph.add_edge(src, dst, weight=weight)
                # tm[j, i] = daily passengers from j to i / population_j
                tm[si, di] = weight / max(self.populations[si], 1.0)

        self.transmission_matrix = tm.tocsr()

    @property
    def n_nodes(self) -> int:
        return len(self.node_ids)

    def get_node(self, iata: str) -> dict | None:
        idx = self.node_index.get(iata)
        if idx is not None:
            return self.node_data[idx]
        return None

    def find_nearest(self, lat: float, lng: float) -> str:
        """Find the nearest airport to the given coordinates."""
        best_dist = float("inf")
        best_id = self.node_ids[0]
        for nd in self.node_data:
            d = (nd["lat"] - lat) ** 2 + (nd["lng"] - lng) ** 2
            if d < best_dist:
                best_dist = d
                best_id = nd["id"]
        return best_id

    def get_edges_for_node(self, iata: str) -> list[dict]:
        """Return all outbound edges for a node."""
        edges = []
        if iata in self.graph:
            for _, dst, data in self.graph.out_edges(iata, data=True):
                edges.append({"source": iata, "target": dst, "weight": data.get("weight", 0)})
        return edges

    def get_graph_response(self) -> dict:
        """Serialize graph for API response."""
        nodes = []
        for nd in self.node_data:
            nodes.append({
                "id": nd["id"],
                "name": nd.get("name", nd["id"]),
                "city": nd.get("city", ""),
                "country": nd.get("country", ""),
                "lat": nd["lat"],
                "lng": nd["lng"],
                "population": nd.get("population", 500_000),
                "degree": nd.get("degree", 0),
            })
        edges = []
        for u, v, data in self.graph.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "weight": data.get("weight", 0),
            })
        return {"nodes": nodes, "edges": edges}
