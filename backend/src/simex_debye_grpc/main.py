from typing import Annotated

from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.routing import Route, Mount

from connectrpc.request import RequestContext
from pydantic import BaseModel, Field

from .gen import simulation_connect
from .gen.simulation_pb2 import SimulationRequest, SimulationResponse


class QRange(BaseModel):
    min: Annotated[float, Field(ge=0.001)]
    max: Annotated[float, Field(le=10)]
    step: Annotated[float, Field(ge=0.001)]


class File(BaseModel):
    filename: Annotated[str, Field(min_length=4, pattern=r"^.*\.xyz$")]
    contents: Annotated[bytes, Field(min_length=8)]


class SimulationService(simulation_connect.SimulationService):
    async def calc_debye(
        self, request: SimulationRequest, ctx: RequestContext
    ) -> SimulationResponse:
        from .calculator import calc_debye

        q_range = request.q_range
        QRange(min=q_range.min, max=q_range.max, step=q_range.step)

        structure = request.structure
        File(filename=structure.filename, contents=structure.contents)

        result = calc_debye(
            q_range=request.q_range,
            structure=request.structure,
        )

        return SimulationResponse(q=result[0], i=result[1])

async def healthz(_request):
    return PlainTextResponse("ok", status_code=200)


connect_app = simulation_connect.SimulationServiceASGIApplication(
    service=SimulationService()
)

app = Starlette(
    routes=[
        Route("/healthz", healthz, methods=["GET"]),
        Mount("/", app=connect_app),
    ]
)

if __name__ == "__main__":
    import asyncio
    import uvicorn

    asyncio.run(uvicorn.run(app, host="0.0.0.0", port=50051))
