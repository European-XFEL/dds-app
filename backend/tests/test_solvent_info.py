import asyncio

import pytest

from connectrpc.request import RequestContext

from simex_debye_grpc.calculator import get_solvent_info
from simex_debye_grpc.gen.simulation_pb2 import SolventInfoRequest
from simex_debye_grpc.main import SimulationService


@pytest.mark.parametrize(
    "name",
    ["water", "acetonitrile", "methanol"],
)
def test_get_solvent_info_returns_positive_floats(name: str) -> None:
    rhom, cpm = get_solvent_info(name)
    assert isinstance(rhom, float)
    assert isinstance(cpm, float)
    assert rhom > 0
    assert cpm > 0


def test_get_solvent_info_rpc() -> None:
    service = SimulationService()
    ctx = RequestContext(method="POST", http_method="POST", request_headers={})
    request = SolventInfoRequest(name="water")
    response = asyncio.run(service.get_solvent_info(request, ctx))
    assert response.rhom > 0
    assert response.cpm > 0
