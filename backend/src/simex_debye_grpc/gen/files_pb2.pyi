from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class FileTypes(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    FILE_TYPE_UNSPECIFIED: _ClassVar[FileTypes]
    STRUCTURE_FILE: _ClassVar[FileTypes]
    SOLVENT_FILE: _ClassVar[FileTypes]

FILE_TYPE_UNSPECIFIED: FileTypes
STRUCTURE_FILE: FileTypes
SOLVENT_FILE: FileTypes

class Empty(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class File(_message.Message):
    __slots__ = ("type", "id", "filename", "name", "contents")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    CONTENTS_FIELD_NUMBER: _ClassVar[int]
    type: FileTypes
    id: str
    filename: str
    name: str
    contents: bytes
    def __init__(
        self,
        type: _Optional[_Union[FileTypes, str]] = ...,
        id: _Optional[str] = ...,
        filename: _Optional[str] = ...,
        name: _Optional[str] = ...,
        contents: _Optional[bytes] = ...,
    ) -> None: ...

class FileMeta(_message.Message):
    __slots__ = ("id", "filename", "name")
    ID_FIELD_NUMBER: _ClassVar[int]
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    id: str
    filename: str
    name: str
    def __init__(
        self,
        id: _Optional[str] = ...,
        filename: _Optional[str] = ...,
        name: _Optional[str] = ...,
    ) -> None: ...

class ListFilesRequest(_message.Message):
    __slots__ = ("type",)
    TYPE_FIELD_NUMBER: _ClassVar[int]
    type: FileTypes
    def __init__(self, type: _Optional[_Union[FileTypes, str]] = ...) -> None: ...

class ListFilesResponse(_message.Message):
    __slots__ = ("files",)
    FILES_FIELD_NUMBER: _ClassVar[int]
    files: _containers.RepeatedCompositeFieldContainer[FileMeta]
    def __init__(
        self, files: _Optional[_Iterable[_Union[FileMeta, _Mapping]]] = ...
    ) -> None: ...

class GetFileRequest(_message.Message):
    __slots__ = ("type", "id")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    type: FileTypes
    id: str
    def __init__(
        self, type: _Optional[_Union[FileTypes, str]] = ..., id: _Optional[str] = ...
    ) -> None: ...

class CreateFileRequest(_message.Message):
    __slots__ = ("type", "filename", "name", "contents")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    CONTENTS_FIELD_NUMBER: _ClassVar[int]
    type: FileTypes
    filename: str
    name: str
    contents: bytes
    def __init__(
        self,
        type: _Optional[_Union[FileTypes, str]] = ...,
        filename: _Optional[str] = ...,
        name: _Optional[str] = ...,
        contents: _Optional[bytes] = ...,
    ) -> None: ...

class UpdateFileRequest(_message.Message):
    __slots__ = ("File",)
    FILE_FIELD_NUMBER: _ClassVar[int]
    File: File
    def __init__(self, File: _Optional[_Union[File, _Mapping]] = ...) -> None: ...

class DeleteFileRequest(_message.Message):
    __slots__ = ("type", "id")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    type: FileTypes
    id: str
    def __init__(
        self, type: _Optional[_Union[FileTypes, str]] = ..., id: _Optional[str] = ...
    ) -> None: ...
