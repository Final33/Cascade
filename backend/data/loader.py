"""
Data loader for OpenFlights airports/routes and population estimates.
Parses raw CSVs, builds a pruned airport graph, and caches as graph.json.
"""
from __future__ import annotations

import csv
import json
import math
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent

MAJOR_CITY_POPULATIONS: dict[str, int] = {
    "London": 9_500_000, "New York": 8_300_000, "Tokyo": 13_900_000,
    "Beijing": 21_500_000, "Shanghai": 24_900_000, "Delhi": 32_900_000,
    "Mumbai": 21_700_000, "São Paulo": 12_300_000, "Mexico City": 9_200_000,
    "Cairo": 10_100_000, "Lagos": 15_900_000, "Istanbul": 15_800_000,
    "Moscow": 12_600_000, "Paris": 2_200_000, "Los Angeles": 3_900_000,
    "Chicago": 2_700_000, "Houston": 2_300_000, "Toronto": 2_900_000,
    "Sydney": 5_300_000, "Melbourne": 5_000_000, "Dubai": 3_500_000,
    "Singapore": 5_700_000, "Hong Kong": 7_500_000, "Seoul": 9_700_000,
    "Bangkok": 10_700_000, "Jakarta": 10_600_000, "Manila": 1_800_000,
    "Kuala Lumpur": 8_400_000, "Taipei": 2_600_000, "Osaka": 2_700_000,
    "Berlin": 3_600_000, "Madrid": 3_300_000, "Rome": 2_800_000,
    "Amsterdam": 900_000, "Frankfurt": 750_000, "Zurich": 430_000,
    "Vienna": 1_900_000, "Barcelona": 1_600_000, "Lisbon": 550_000,
    "Athens": 660_000, "Warsaw": 1_800_000, "Prague": 1_300_000,
    "Stockholm": 1_000_000, "Copenhagen": 800_000, "Oslo": 700_000,
    "Helsinki": 650_000, "Dublin": 550_000, "Brussels": 185_000,
    "Johannesburg": 5_800_000, "Nairobi": 4_700_000, "Addis Ababa": 3_600_000,
    "Casablanca": 3_700_000, "Lima": 10_400_000, "Bogota": 7_400_000,
    "Buenos Aires": 3_100_000, "Santiago": 5_600_000, "Rio de Janeiro": 6_700_000,
    "Doha": 2_400_000, "Riyadh": 7_600_000, "Jeddah": 4_700_000,
    "Tel Aviv": 460_000, "Amman": 4_000_000, "Beirut": 2_400_000,
    "Karachi": 16_100_000, "Lahore": 13_000_000, "Dhaka": 22_500_000,
    "Kolkata": 14_800_000, "Chennai": 11_500_000, "Bangalore": 12_800_000,
    "Hyderabad": 10_500_000, "Guangzhou": 18_700_000, "Shenzhen": 17_600_000,
    "Chengdu": 21_000_000, "Wuhan": 12_300_000, "Hanoi": 8_400_000,
    "Ho Chi Minh City": 9_000_000, "Yangon": 5_400_000, "Phnom Penh": 2_100_000,
    "Denver": 710_000, "San Francisco": 870_000, "Seattle": 740_000,
    "Miami": 440_000, "Atlanta": 500_000, "Dallas": 1_300_000,
    "Phoenix": 1_600_000, "Minneapolis": 430_000, "Detroit": 640_000,
    "Boston": 680_000, "Washington": 690_000, "Philadelphia": 1_600_000,
    "Orlando": 310_000, "Las Vegas": 640_000, "Montreal": 1_800_000,
    "Vancouver": 680_000, "Calgary": 1_300_000, "Ottawa": 1_000_000,
}

DEFAULT_POPULATION = 500_000


def parse_airports(path: Path | None = None) -> dict[str, dict]:
    """Parse airports.dat into a dict keyed by IATA code."""
    path = path or DATA_DIR / "airports.dat"
    airports: dict[str, dict] = {}

    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 14:
                continue
            iata = row[4].strip('"')
            if not iata or iata == "\\N" or len(iata) != 3:
                continue
            try:
                lat = float(row[6])
                lng = float(row[7])
            except (ValueError, IndexError):
                continue

            name = row[1].strip('"')
            city = row[2].strip('"')
            country = row[3].strip('"')

            airports[iata] = {
                "id": iata,
                "name": name,
                "city": city,
                "country": country,
                "lat": lat,
                "lng": lng,
            }

    return airports


def parse_routes(path: Path | None = None) -> list[dict]:
    """Parse routes.dat into a list of {source, target} dicts."""
    path = path or DATA_DIR / "routes.dat"
    routes: list[dict] = []

    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 7:
                continue
            src = row[2].strip('"')
            dst = row[4].strip('"')
            if not src or not dst or src == "\\N" or dst == "\\N":
                continue
            if len(src) != 3 or len(dst) != 3:
                continue
            routes.append({"source": src, "target": dst})

    return routes


def estimate_passenger_volume(src_degree: int, dst_degree: int) -> float:
    """
    Heuristic passenger volume based on airport connectivity.
    Major hubs (degree > 100) get higher traffic.
    """
    avg_degree = (src_degree + dst_degree) / 2.0
    if avg_degree > 150:
        return 15000.0
    elif avg_degree > 100:
        return 8000.0
    elif avg_degree > 50:
        return 3000.0
    elif avg_degree > 20:
        return 1000.0
    else:
        return 300.0


def assign_populations(airports: dict[str, dict]) -> None:
    """Attach population estimates to airports based on city name matching."""
    for iata, info in airports.items():
        city = info["city"]
        pop = MAJOR_CITY_POPULATIONS.get(city, DEFAULT_POPULATION)
        info["population"] = pop


def build_graph(top_n: int = 500) -> dict:
    """
    Build and prune the airport graph to the top N airports by route connectivity.
    Returns {"nodes": [...], "edges": [...]}.
    """
    airports = parse_airports()
    routes = parse_routes()

    degree: dict[str, int] = {}
    for r in routes:
        src, dst = r["source"], r["target"]
        if src in airports and dst in airports:
            degree[src] = degree.get(src, 0) + 1
            degree[dst] = degree.get(dst, 0) + 1

    top_airports = sorted(degree.keys(), key=lambda k: degree.get(k, 0), reverse=True)[:top_n]
    top_set = set(top_airports)

    assign_populations(airports)

    nodes = []
    for iata in top_airports:
        if iata in airports:
            info = airports[iata]
            info["degree"] = degree.get(iata, 0)
            nodes.append(info)

    seen_edges: set[tuple[str, str]] = set()
    edges = []
    for r in routes:
        src, dst = r["source"], r["target"]
        if src in top_set and dst in top_set:
            key = (src, dst)
            if key not in seen_edges:
                seen_edges.add(key)
                src_deg = degree.get(src, 1)
                dst_deg = degree.get(dst, 1)
                weight = estimate_passenger_volume(src_deg, dst_deg)
                edges.append({"source": src, "target": dst, "weight": weight})

    return {"nodes": nodes, "edges": edges}


def load_or_build_graph(top_n: int = 500) -> dict:
    """Load cached graph.json or build and cache it."""
    cache_path = DATA_DIR / "graph.json"
    if cache_path.exists():
        with open(cache_path, "r") as f:
            return json.load(f)

    graph = build_graph(top_n)
    with open(cache_path, "w") as f:
        json.dump(graph, f)
    return graph


if __name__ == "__main__":
    graph = build_graph(500)
    out_path = DATA_DIR / "graph.json"
    with open(out_path, "w") as f:
        json.dump(graph, f)
    print(f"Built graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")
    print(f"Saved to {out_path}")
