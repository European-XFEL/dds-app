"""Core calculation logic for the difference scattering gRPC service."""

from __future__ import annotations

from io import StringIO

import numpy as np
from debyecalculator import DebyeCalculator
from debyecalculator.debye_calculator import IqTuple

from . import gen

N_AV = 6.02e23
ELECTRON_CHARGE_JOULE = 1.602e-19


def _pre_parse_structure_contents(contents: bytes):
    """Pre-parse structure contents from bytes to list of strings."""
    text = np.genfromtxt(StringIO(contents.decode("utf-8")), dtype=str, skip_header=2)

    elements = text[:, 0].tolist()
    xyz = text[:, 1:].astype(float)

    return elements, xyz


def _calc_debye(
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


def calc_debye(
    q_range: gen.QRange,
    structure: gen.File,
):
    """Calculate Debye scattering I(q) from structure file and q-range."""
    structure_source = _pre_parse_structure_contents(structure.contents)

    return _calc_debye(
        qmin=q_range.min,
        qmax=q_range.max,
        qstep=q_range.step,
        structure_source=structure_source,
    )


def get_solvent_info(name: str) -> tuple[float, float]:
    """Return molar density (mol/m^3) and molar heat capacity (J/mol/K) for a solvent."""
    from thermo.chemical import Chemical

    chemical = Chemical(name)
    return float(chemical.rhom), float(chemical.Cpm)
