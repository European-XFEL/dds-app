import { resolveModuleColour } from './components/ui/Cake.helper';
import {
  type CartesianPoint,
  type DetectorInterface,
  type DetectorModule,
  type Shape,
} from './types';

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

export class Detector implements DetectorInterface {
  readonly name: string;
  readonly pixelSize: number;
  readonly modules: DetectorModule[];

  distance: number;
  beamCenter: CartesianPoint;

  readonly imageShape: Shape = $derived.by(() => {
    const shape = calculateImageShape(this.modules);
    return { width: shape.width, height: shape.height };
  });

  constructor(name: keyof typeof DEFAULT_DETECTORS) {
    const detector = DEFAULT_DETECTORS[name];
    if (!detector) {
      throw new Error(`Detector configuration for ${name} not found.`);
    }
    this.name = detector.name;
    this.pixelSize = detector.pixelSize;

    this.distance = $state(100);

    let maxX = 0;
    let maxY = 0;
    for (const module of detector.modules) {
      const moduleMaxX = module.position[0] + module.shape[0];
      const moduleMaxY = module.position[1] + module.shape[1];
      if (moduleMaxX > maxX) {
        maxX = moduleMaxX;
      }
      if (moduleMaxY > maxY) {
        maxY = moduleMaxY;
      }
    }

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
}
