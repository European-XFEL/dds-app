import type { QRange, Range } from '$lib/types';

export interface Shape {
  readonly width: number;
  readonly height: number;
}

export interface CartesianPoint {
  x: number;
  y: number;
}

export interface DetectorModule {
  readonly id: string;
  readonly shape: Shape;
  readonly position: CartesianPoint;
  color?: string;
}

export interface Detector {
  name: string;
  readonly pixelSize: number;
  distance: number;
  beamCenter: CartesianPoint;
  imageShape: Shape;
  readonly modules: DetectorModule[];
  readonly radiusRange: Range;
  readonly qRange: QRange;
}
