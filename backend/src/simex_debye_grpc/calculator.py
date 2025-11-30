"""Core calculation logic for the difference scattering gRPC service."""

from __future__ import annotations

from io import StringIO
from pathlib import Path
from typing import cast

import numpy as np
from debyecalculator import DebyeCalculator
from debyecalculator.debye_calculator import IqTuple
from simex_debye import interpolate_dsdt, load_dsdt
from thermo.chemical import Chemical

from . import models

N_AV = 6.02e23
ELECTRON_CHARGE_JOULE = 1.602e-19


def pre_parse_structure_contents(contents: bytes):
    """Pre-parse structure contents from bytes to list of strings."""
    text = np.genfromtxt(StringIO(contents.decode("utf-8")), dtype=str, skip_header=2)

    elements = text[:, 0].tolist()
    xyz = text[:, 1:].astype(float)

    return elements, xyz


def calc_debye(
    qmin: float,
    qmax: float,
    qstep: float,
    structure_source: tuple[list[str], np.ndarray],
) -> IqTuple | list[IqTuple]:
    calculator = DebyeCalculator(
        qmin=qmin,
        qmax=qmax,
        qstep=qstep,
    )
    return calculator.iq(structure_source=structure_source)


class SimulationCalculator:
    """A class to perform difference scattering calculations based on simulation requests."""

    def __init__(self, request: models.SimulationRequest):
        self.request = request
        self.sample = request.sample
        self.pump = request.pump
        self.q_range = request.q_range

    def run(self) -> models.SimulationResponse:
        solvent_chemical = Chemical(self.sample.solvent.name)

        solvent_rhom = solvent_chemical.rhom
        if not isinstance(solvent_rhom, (float, int)):
            raise ValueError(
                f"Unexpected density type for solvent '{solvent_chemical}': {type(solvent_rhom)}"
            )

        solvent_cpm = solvent_chemical.Cpm  # Molar heat capacity [J/mol/K]
        if not isinstance(solvent_cpm, (float, int)):
            raise ValueError(
                f"Could not determine molar heat capacity of solvent '{solvent_chemical}': {type(solvent_cpm)}"
            )

        solvent_concentration = solvent_rhom / 1000.0

        excited_concentration = (
            self.sample.concentration_solute_molar * self.pump.excited_state_fraction
        )

        delta_e = (
            self.pump.photon_energy_ev - self.pump.excited_state_energy_ev
        ) * ELECTRON_CHARGE_JOULE

        delta_t = (
            excited_concentration / solvent_concentration * delta_e / solvent_cpm * N_AV
        )

        S_0, S_1 = self._calc_debye_g_e()

        delta_s_solute = S_1.i - S_0.i

        ratio_solvent_solute = (
            solvent_concentration / self.sample.concentration_solute_molar
        )

        Q_read, dS_read = load_dsdt(
            StringIO(self.request.sample.solvent.contents.decode("utf-8"))  # pyright: ignore[reportArgumentType]
        )

        dS_solv = interpolate_dsdt(Q_read, dS_read, S_0.q)

        delta_s = (
            self.pump.excited_state_fraction * delta_s_solute
            + ratio_solvent_solute * dS_solv * delta_t
        )

        return models.SimulationResponse(
            q=S_0.q.tolist(),
            delta_s=delta_s.tolist(),
            delta_s_solvent=(dS_solv * ratio_solvent_solute * delta_t).tolist(),
            delta_s_solute_ex_frac=(
                delta_s_solute * self.pump.excited_state_fraction
            ).tolist(),
            deposited_energy_joule=delta_e,
            delta_temperature_k=delta_t,
            solvent_to_solute_ratio=ratio_solvent_solute,
        )

    def _calc_debye_g_e(self):
        S0, S1 = (
            calc_debye(
                qmin=self.q_range.min,
                qmax=self.q_range.max,
                qstep=self.q_range.step,
                structure_source=pre_parse_structure_contents(source),
            )
            for source in (
                self.sample.ground.contents,
                self.sample.excited.contents,
            )
        )

        for label, S in zip(("ground", "excited"), (S0, S1)):
            if not isinstance(S, IqTuple):
                raise ValueError(
                    f"DebyeCalculator.iq did not return expected I(q) tuple for {label} structure source"
                )

        S_0 = cast(IqTuple, S0)
        S_1 = cast(IqTuple, S1)
        return S_0, S_1


if __name__ == "__main__":
    request = models.SimulationRequest(
        q_range=models.SimulationRequestQRange(min=0.01, max=9, step=0.01),
        pump=models.SimulationRequestPump(
            photon_energy_ev=4.0,
            excited_state_energy_ev=2.0,
            excited_state_fraction=0.5,
        ),
        sample=models.SimulationRequestSample(
            concentration_solute_molar=0.005,
            ground=models.files.File(
                type=models.files.FileTypes.STRUCTURE_FILE,
                name="ground",
                filename="ground.xyz",
                contents=Path(
                    "/home/roscar/work/git.xfel.eu/simulation/debye-difference-scattering-app/initial-dev/static/data/molecules/Au2L2-S0_GS.xyz"
                ).read_bytes(),
            ),
            excited=models.files.File(
                type=models.files.FileTypes.STRUCTURE_FILE,
                name="excited",
                filename="excited.xyz",
                contents=Path(
                    "/home/roscar/work/git.xfel.eu/simulation/debye-difference-scattering-app/initial-dev/static/data/molecules/Au2L2-T0_ES.xyz"
                ).read_bytes(),
            ),
            solvent=models.files.File(
                type=models.files.FileTypes.SOLVENT_FILE,
                name="acetonitrile",
                filename="MeCN.txt",
                contents=Path(
                    "/home/roscar/work/git.xfel.eu/simulation/debye-difference-scattering-app/initial-dev/static/data/solvents/MeCN.txt"
                ).read_bytes(),
            ),
        ),
    )

    calculator = SimulationCalculator(request)

    response = calculator.run()

    print(response.to_json(indent=2))
