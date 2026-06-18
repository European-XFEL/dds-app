import { resolveModuleColour } from './components/ui/Cake.helper.ts';
import * as qConvert from './components/ui/DetectorInfo.helper.ts';
import {
  type CartesianPoint,
  type Detector,
  type DetectorModule,
  type Shape,
} from './types.ts';

const DEFAULT_DETECTORS = {
  LPD: {
    name: 'LPD',
    pixelSize: 0.172,
    modules: [
      {
        position: [64, 0 + 32],
        shape: [128, 256],
      },
      {
        position: [64 + 32, 256 + 32 + 32],
        shape: [128, 256],
      },
      {
        position: [64 + 32 + 128, 0 + 32],
        shape: [128, 256],
      },
      {
        position: [64 + 32 + 32 + 128, 256 + 32 + 32],
        shape: [128, 256],
      },
    ],
  },
};

function calculateImageShape(modules: DetectorModule[]): Shape {
  if (modules.length === 0) return { width: 0, height: 0 };

  const moduleXs = modules.map((m) => m.position.x);
  const moduleYs = modules.map((m) => m.position.y);
  const X = Math.max(...moduleXs) - Math.min(...moduleXs);
  const Y = Math.max(...moduleYs) - Math.min(...moduleYs);

  return {
    width: X + modules[0].shape.width,
    height: Y + modules[0].shape.height,
  };
}

export class DetectorState implements Detector {
  name: string;
  readonly pixelSize: number;
  readonly modules: DetectorModule[];

  distance: number;
  beamCenter: CartesianPoint;

  readonly qRange = $derived.by(() => {
    return qConvert.computeQRangeFromModules({
      distance: this.distance,
      pixelSize: this.pixelSize,
      beamCenter: this.beamCenter,
      modules: this.modules,
      wavelength: this.wavelength,
    });
  });

  readonly imageShape: Shape = $derived.by(() => {
    return calculateImageShape(this.modules);
  });

  readonly radiusRange = $derived.by(() => {
    return { min: this.qRange.rMinPx, max: this.qRange.rMaxPx };
  });

  wavelength = $state<number>();

  constructor(name: keyof typeof DEFAULT_DETECTORS, wavelength: number) {
    const detector = DEFAULT_DETECTORS[name];
    if (!detector) {
      throw new Error(`Detector configuration for ${name} not found.`);
    }
    this.name = detector.name;
    this.pixelSize = detector.pixelSize;
    this.wavelength = $state(wavelength);

    this.distance = $state(100);

    const maxX = Math.max(
      ...detector.modules.map((m) => m.position[0] + m.shape[0]),
    );
    const maxY = Math.max(
      ...detector.modules.map((m) => m.position[1] + m.shape[1]),
    );

    this.beamCenter = $state({ x: 16 + maxX / 2, y: 16 + maxY / 2 });

    this.modules = $state(
      detector.modules.map((mod, index) => ({
        id: `module-${index + 1}`,
        shape: { width: mod.shape[0], height: mod.shape[1] },
        position: { x: mod.position[0], y: mod.position[1] },
        color: resolveModuleColour(index),
      })),
    );
  }

  setDetector(name: keyof typeof DEFAULT_DETECTORS): void {
    const detector = DEFAULT_DETECTORS[name];
    if (!detector) {
      throw new Error(`Detector configuration for ${name} not found.`);
    }
    this.name = detector.name;
    this.modules = $state(
      detector.modules.map((mod, index) => ({
        id: `module-${index + 1}`,
        shape: { width: mod.shape[0], height: mod.shape[1] },
        position: { x: mod.position[0], y: mod.position[1] },
        color: resolveModuleColour(index),
      })),
    );
  }
}
