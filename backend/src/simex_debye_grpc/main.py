from typing import Annotated

from connectrpc.request import RequestContext
from pydantic import BaseModel, Field

from .gen import simulation_connect
from .gen.simulation_pb2 import SimulationRequest, SimulationResponse


class QRange(BaseModel):
    min: Annotated[float, Field(ge=0.001)]
    max: Annotated[float, Field(le=10)]
    step: Annotated[float, Field(ge=0.001)]


class File(BaseModel):
    filename: Annotated[str, Field(min_length=4, pattern=r"^\w*\.xyz$")]
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


app = simulation_connect.SimulationServiceASGIApplication(service=SimulationService())


if __name__ == "__main__":
    import asyncio
    import uvicorn

    app = simulation_connect.SimulationServiceASGIApplication(
        service=SimulationService()
    )

    asyncio.run(
        uvicorn.run(app, host="127.0.0.1", port=50051)
    )