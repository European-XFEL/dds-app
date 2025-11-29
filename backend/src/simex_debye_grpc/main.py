from grpclib.server import Server

from . import models
from .calculator import SimulationCalculator


class SimulationService(models.SimulationServiceBase):
    async def run_simulation(
        self, message: models.SimulationRequest
    ) -> models.SimulationResponse:
        calculator = SimulationCalculator(message)
        response = calculator.run()
        return response


async def start_server():
    HOST = "localhost"
    PORT = 50051
    server = Server([SimulationService()])
    await server.start(HOST, PORT)
    await server.wait_closed()


if __name__ == "__main__":
    import asyncio

    asyncio.run(start_server())
