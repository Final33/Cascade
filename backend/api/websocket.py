"""WebSocket handler for real-time simulation streaming."""
from __future__ import annotations

import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/simulation")
async def simulation_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for streaming simulation state.
    
    Client can send commands:
      {"command": "play"}
      {"command": "pause"}
      {"command": "seek", "value": 42}
      {"command": "speed", "value": 2.0}
    
    Server streams simulation frames at the configured speed.
    """
    await websocket.accept()
    engine = websocket.app.state.engine

    playing = False
    current_frame = 0
    speed = 1.0
    frames_per_second = 10.0

    try:
        while True:
            # Check for incoming commands (non-blocking)
            try:
                raw = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                msg = json.loads(raw)
                cmd = msg.get("command", "")

                if cmd == "play":
                    playing = True
                elif cmd == "pause":
                    playing = False
                elif cmd == "seek":
                    current_frame = int(msg.get("value", 0))
                    current_frame = max(0, min(current_frame, engine.total_frames - 1))
                    # Send the seeked frame immediately
                    if engine.total_frames > 0:
                        frame = engine.get_comparison_frame(current_frame)
                        await websocket.send_json(frame)
                elif cmd == "speed":
                    speed = float(msg.get("value", 1.0))
                    speed = max(0.25, min(speed, 10.0))

            except asyncio.TimeoutError:
                pass

            if playing and engine.total_frames > 0:
                if current_frame < engine.total_frames:
                    frame = engine.get_comparison_frame(current_frame)
                    await websocket.send_json(frame)
                    current_frame += 1
                else:
                    playing = False
                    await websocket.send_json({
                        "tick": -1,
                        "day": -1,
                        "phase": "complete",
                    })

                await asyncio.sleep(1.0 / (frames_per_second * speed))
            else:
                await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        pass
    except Exception:
        try:
            await websocket.close()
        except Exception:
            pass
