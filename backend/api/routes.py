"""REST API endpoints for the Cascade simulation engine."""
from __future__ import annotations

import httpx
from fastapi import APIRouter, HTTPException, Request

from models.schemas import (
    OutbreakConfig,
    OptimizeRequest,
    GraphResponse,
    PresetResponse,
)

router = APIRouter()


@router.get("/graph")
async def get_graph(request: Request):
    """Return the airport graph for globe rendering."""
    engine = request.app.state.engine
    return engine.get_graph_response()


@router.get("/presets")
async def get_presets(request: Request):
    """Return disease parameter presets."""
    engine = request.app.state.engine
    return engine.get_presets()


@router.post("/outbreak")
async def seed_outbreak(config: OutbreakConfig, request: Request):
    """Seed a new outbreak and run baseline simulation."""
    engine = request.app.state.engine

    result = engine.seed_outbreak(
        city_id=config.city_id,
        r0=config.r0,
        incubation_period=config.incubation_period,
        infectious_period=config.infectious_period,
        fatality_rate=config.fatality_rate,
        initial_infected=config.initial_infected,
    )

    engine.run_baseline(days=180)

    return {
        "status": "outbreak_seeded",
        "config": result,
        "baseline_frames": engine.total_frames,
    }


@router.post("/optimize")
async def run_optimization(opt_request: OptimizeRequest, request: Request):
    """Run MCTS optimization for the current outbreak."""
    engine = request.app.state.engine

    if engine.outbreak_config is None:
        raise HTTPException(status_code=400, detail="No outbreak seeded. Seed an outbreak first.")

    opt_result = engine.run_optimization(
        total_vaccines=opt_request.resources.vaccines,
        max_route_closures=opt_request.resources.route_closures,
        max_hospitals=opt_request.resources.field_hospitals,
        mcts_iterations=opt_request.mcts_iterations,
        rollout_horizon_days=opt_request.rollout_horizon_days,
    )

    engine.run_optimized_simulation(days=180)

    return {
        "status": "optimization_complete",
        "result": opt_result,
        "optimized_frames": engine.total_frames,
    }


@router.get("/simulation/frame/{frame_idx}")
async def get_frame(frame_idx: int, request: Request):
    """Get a specific simulation comparison frame."""
    engine = request.app.state.engine
    if frame_idx < 0 or frame_idx >= engine.total_frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    return engine.get_comparison_frame(frame_idx)


@router.get("/simulation/summary")
async def get_summary(request: Request):
    """Get summary statistics for the current simulation."""
    engine = request.app.state.engine

    if not engine.baseline_history:
        return {"status": "no_simulation"}

    last_baseline = engine.baseline_history[-1]
    result = {
        "status": "ready",
        "total_frames": engine.total_frames,
        "baseline": {
            "total_infected": last_baseline["total_infected"],
            "total_dead": last_baseline["total_dead"],
            "total_recovered": last_baseline["total_recovered"],
            "days": last_baseline["day"],
        },
        "outbreak_config": engine.outbreak_config,
    }

    if engine.optimized_history:
        last_optimized = engine.optimized_history[-1]
        result["optimized"] = {
            "total_infected": last_optimized["total_infected"],
            "total_dead": last_optimized["total_dead"],
            "total_recovered": last_optimized["total_recovered"],
            "days": last_optimized["day"],
            "actions": engine.best_actions,
        }
        result["lives_saved"] = last_baseline["total_dead"] - last_optimized["total_dead"]

    return result


@router.get("/who-outbreaks")
async def get_who_outbreaks():
    """Proxy WHO Disease Outbreak News feed."""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                "https://www.who.int/api/news/diseaseoutbreaknews",
                params={"$orderby": "PublicationDate desc", "$top": 20},
            )
            if resp.status_code == 200:
                return resp.json()
            return {"value": [], "error": f"WHO API returned {resp.status_code}"}
    except Exception as e:
        return {"value": [], "error": str(e)}
