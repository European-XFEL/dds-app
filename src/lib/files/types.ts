import type * as protoFiles from '$lib/server/grpc/gen/files_pb';

export type FileNoContent = Omit<protoFiles.File, 'contents' | '$typeName'>;

export type StructureFile = Omit<FileNoContent, 'type'>;

export type SolventFile = Omit<FileNoContent, 'type'>;
