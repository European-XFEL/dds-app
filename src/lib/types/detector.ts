import type { DetectorModule, Point } from '$lib/math/crystallography_transforms';

export type Detector = {
  name: string;
  pixel_size: number;
  distance: number;
  wavelength: number;
  beam_center: Point;
  modules: DetectorModule[];
};