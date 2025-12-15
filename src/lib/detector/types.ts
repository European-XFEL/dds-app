export type RangeTuple = readonly [number, number];

export interface CartesianPoint {
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

export type Shape = {
  width: number;
  height: number;
};
export type PixelSize = number;
export type BeamCenter = CartesianPoint;

export interface QParams {
  min: number;
  max: number;
  step: number;
}

export type Detector = {
  name: string;
  pixelSize: PixelSize;
  distance: number;
  wavelength: number;
  beamCenter: CartesianPoint;
  imageShape: Shape;
  modules: DetectorModule[];
};
