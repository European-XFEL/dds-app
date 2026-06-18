from . import files_pb2 as _files_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class QRange(_message.Message):
    __slots__ = ("min", "max", "step")
    MIN_FIELD_NUMBER: _ClassVar[int]
    MAX_FIELD_NUMBER: _ClassVar[int]
    STEP_FIELD_NUMBER: _ClassVar[int]
    min: float
    max: float
    step: float
    def __init__(self, min: _Optional[float] = ..., max: _Optional[float] = ..., step: _Optional[float] = ...) -> None: ...

class Pump(_message.Message):
    __slots__ = ("photon_energy_ev", "excited_state_energy_ev", "excited_state_fraction")
    PHOTON_ENERGY_EV_FIELD_NUMBER: _ClassVar[int]
    EXCITED_STATE_ENERGY_EV_FIELD_NUMBER: _ClassVar[int]
    EXCITED_STATE_FRACTION_FIELD_NUMBER: _ClassVar[int]
    photon_energy_ev: float
    excited_state_energy_ev: float
    excited_state_fraction: float
    def __init__(self, photon_energy_ev: _Optional[float] = ..., excited_state_energy_ev: _Optional[float] = ..., excited_state_fraction: _Optional[float] = ...) -> None: ...

class SimulationRequest(_message.Message):
    __slots__ = ("q_range", "structure")
    Q_RANGE_FIELD_NUMBER: _ClassVar[int]
    STRUCTURE_FIELD_NUMBER: _ClassVar[int]
    q_range: QRange
    structure: _files_pb2.File
    def __init__(self, q_range: _Optional[_Union[QRange, _Mapping]] = ..., structure: _Optional[_Union[_files_pb2.File, _Mapping]] = ...) -> None: ...

class SimulationResponse(_message.Message):
    __slots__ = ("q", "i")
    Q_FIELD_NUMBER: _ClassVar[int]
    I_FIELD_NUMBER: _ClassVar[int]
    q: _containers.RepeatedScalarFieldContainer[float]
    i: _containers.RepeatedScalarFieldContainer[float]
    def __init__(self, q: _Optional[_Iterable[float]] = ..., i: _Optional[_Iterable[float]] = ...) -> None: ...

class SolventInfoRequest(_message.Message):
    __slots__ = ("name",)
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class SolventInfoResponse(_message.Message):
    __slots__ = ("rhom", "cpm")
    RHOM_FIELD_NUMBER: _ClassVar[int]
    CPM_FIELD_NUMBER: _ClassVar[int]
    rhom: float
    cpm: float
    def __init__(self, rhom: _Optional[float] = ..., cpm: _Optional[float] = ...) -> None: ...
