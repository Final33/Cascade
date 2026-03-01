from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router as api_router
from api.websocket import router as ws_router
from simulation.engine import SimulationEngine


engine = SimulationEngine()


@asynccontextmanager
async def lifespan(app: FastAPI):
    engine.load_data()
    app.state.engine = engine
    yield


app = FastAPI(
    title="Cascade Simulation Engine",
    description="Real-time pandemic outbreak predictor and containment optimizer",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(ws_router)
