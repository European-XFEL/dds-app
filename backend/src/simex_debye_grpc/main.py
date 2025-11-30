from grpclib.server import Server
from grpclib.utils import graceful_exit

from . import models
from .calculator import SimulationCalculator


class SimulationService(models.SimulationServiceBase):
    async def run_simulation(
        self, message: models.SimulationRequest
    ) -> models.SimulationResponse:
        calculator = SimulationCalculator(message)
        response = calculator.run()
        print(
            f"SimulationResponse: q={len(response.q)}, "
            f"delta_s={len(response.delta_s)}, "
            f"delta_s_solute_ex_frac={len(response.delta_s_solute_ex_frac)}, "
            f"delta_s_solvent={len(response.delta_s_solvent)}, "
            f"deposited_energy_joule={response.deposited_energy_joule}, "
            f"delta_temperature_k={response.delta_temperature_k}, "
            f"solvent_to_solute_ratio={response.solvent_to_solute_ratio}"
        )
        return response


async def main(*, host="127.0.0.1", port=50051):
    server = Server([SimulationService()])

    with graceful_exit([server]):
        await server.start(host, port)
        print(f"Serving on {host}:{port}")
        await server.wait_closed()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
