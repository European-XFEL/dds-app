# pyright: basic, reportAssignmentType=false
from collections.abc import Iterable as _Iterable
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf.internal import containers as _containers

DESCRIPTOR: _descriptor.FileDescriptor

class StructureInput(_message.Message):
    __slots__ = ("filename", "xyz_data")
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    XYZ_DATA_FIELD_NUMBER: _ClassVar[int]
    filename: str
    xyz_data: bytes
    def __init__(
        self, filename: str | None = ..., xyz_data: bytes | None = ...
    ) -> None: ...

class DsdtTable(_message.Message):
    __slots__ = ("filename", "table_data")
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    TABLE_DATA_FIELD_NUMBER: _ClassVar[int]
    filename: str
    table_data: bytes
    def __init__(
        self, filename: str | None = ..., table_data: bytes | None = ...
    ) -> None: ...

class QRange(_message.Message):
    __slots__ = ("qmax", "qmin", "qstep")
    QMIN_FIELD_NUMBER: _ClassVar[int]
    QMAX_FIELD_NUMBER: _ClassVar[int]
    QSTEP_FIELD_NUMBER: _ClassVar[int]
    qmin: float
    qmax: float
    qstep: float
    def __init__(
        self,
        qmin: float | None = ...,
        qmax: float | None = ...,
        qstep: float | None = ...,
    ) -> None: ...

class DifferenceScatteringRequest(_message.Message):
    __slots__ = (
        "concentration_solute_molar",
        "delta_temperature_k",
        "deposited_energy_joule",
        "dsdt_table",
        "excited_state",
        "excited_state_energy_ev",
        "excited_state_fraction",
        "ground_state",
        "optical_photon_energy_ev",
        "q_range",
        "solvent_name",
    )
    GROUND_STATE_FIELD_NUMBER: _ClassVar[int]
    EXCITED_STATE_FIELD_NUMBER: _ClassVar[int]
    DSDT_TABLE_FIELD_NUMBER: _ClassVar[int]
    EXCITED_STATE_FRACTION_FIELD_NUMBER: _ClassVar[int]
    OPTICAL_PHOTON_ENERGY_EV_FIELD_NUMBER: _ClassVar[int]
    EXCITED_STATE_ENERGY_EV_FIELD_NUMBER: _ClassVar[int]
    CONCENTRATION_SOLUTE_MOLAR_FIELD_NUMBER: _ClassVar[int]
    SOLVENT_NAME_FIELD_NUMBER: _ClassVar[int]
    Q_RANGE_FIELD_NUMBER: _ClassVar[int]
    DEPOSITED_ENERGY_JOULE_FIELD_NUMBER: _ClassVar[int]
    DELTA_TEMPERATURE_K_FIELD_NUMBER: _ClassVar[int]
    ground_state: StructureInput
    excited_state: StructureInput
    dsdt_table: DsdtTable
    excited_state_fraction: float
    optical_photon_energy_ev: float
    excited_state_energy_ev: float
    concentration_solute_molar: float
    solvent_name: str
    q_range: QRange
    deposited_energy_joule: float
    delta_temperature_k: float
    def __init__(
        self,
        ground_state: StructureInput | _Mapping | None = ...,
        excited_state: StructureInput | _Mapping | None = ...,
        dsdt_table: DsdtTable | _Mapping | None = ...,
        excited_state_fraction: float | None = ...,
        optical_photon_energy_ev: float | None = ...,
        excited_state_energy_ev: float | None = ...,
        concentration_solute_molar: float | None = ...,
        solvent_name: str | None = ...,
        q_range: QRange | _Mapping | None = ...,
        deposited_energy_joule: float | None = ...,
        delta_temperature_k: float | None = ...,
    ) -> None: ...

class DifferenceScatteringResponse(_message.Message):
    __slots__ = (
        "delta_s_solute",
        "delta_s_solvent",
        "delta_s_total",
        "delta_temperature_k",
        "deposited_energy_joule",
        "q",
        "solvent_to_solute_ratio",
    )
    Q_FIELD_NUMBER: _ClassVar[int]
    DELTA_S_TOTAL_FIELD_NUMBER: _ClassVar[int]
    DELTA_S_SOLUTE_FIELD_NUMBER: _ClassVar[int]
    DELTA_S_SOLVENT_FIELD_NUMBER: _ClassVar[int]
    DEPOSITED_ENERGY_JOULE_FIELD_NUMBER: _ClassVar[int]
    DELTA_TEMPERATURE_K_FIELD_NUMBER: _ClassVar[int]
    SOLVENT_TO_SOLUTE_RATIO_FIELD_NUMBER: _ClassVar[int]
    q: _containers.RepeatedScalarFieldContainer[float]
    delta_s_total: _containers.RepeatedScalarFieldContainer[float]
    delta_s_solute: _containers.RepeatedScalarFieldContainer[float]
    delta_s_solvent: _containers.RepeatedScalarFieldContainer[float]
    deposited_energy_joule: float
    delta_temperature_k: float
    solvent_to_solute_ratio: float
    def __init__(
        self,
        q: _Iterable[float] | None = ...,
        delta_s_total: _Iterable[float] | None = ...,
        delta_s_solute: _Iterable[float] | None = ...,
        delta_s_solvent: _Iterable[float] | None = ...,
        deposited_energy_joule: float | None = ...,
        delta_temperature_k: float | None = ...,
        solvent_to_solute_ratio: float | None = ...,
    ) -> None: ...
