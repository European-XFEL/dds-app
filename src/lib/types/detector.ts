export type RangeTuple = readonly [number, number];

export interface Point {
  x: number;
  y: number;
}

export interface PolarPoint {
  r: number;
  phi: number;
  twoTheta: number;
}

export interface DetectorModule {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface TessellatedQuad {
  corners: PolarPoint[];
}

export interface TransformedModuleTessellated {
  id: string;
  quads: TessellatedQuad[];
  color: string;
}

export type Shape = [ny: number, nx: number];
export type PixelSize = number;
export type BeamCenter = [cy: number, cx: number];

export interface QParams {
  min: number;
  max: number;
  step: number;
}

export type Detector = {
  name: string;
  pixel_size: number;
  distance: number;
  wavelength: number;
  beam_center: Point;
  readonly image_shape: [number, number];
  modules: DetectorModule[];
};