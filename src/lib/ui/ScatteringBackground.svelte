<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { browser } from '$app/environment';

  const CONFIG = {
    pixelSize: 8,
    maxIntensity: 100,
    beamCenter: { x: 0.5, y: 0.45 },
    // Scattering pattern
    rings: [0.12, 0.28, 0.48, 0.72] as const,
    ringWidth: 0.04,
    backgroundDecay: 3.0,
    beamStopRadius: 0.04,
    // Pulse timing (FEL structure)
    pulseFrames: 15,
    gapFrames: 60,
    photonRateHigh: 20_000,
    photonRateLow: 1_000,
    // Visual
    intensityDecay: 0.92,
    pulseFadeDuration: 8,
    pulseBoost: 0.6,
  } as const;

  // === Precomputed color LUT (256 entries) ===
  const COLOR_LUT = new Uint8Array(256 * 4); // RGBA for each intensity level
  (function buildColorLUT() {
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let r: number, g: number, b: number, a: number;

      if (t < 0.3) {
        const s = t / 0.3;
        r = 245 - s * 45;
        g = 240 - s * 80;
        b = 255 - s * 30;
        a = (0.3 + s * 0.3) * 255;
      } else if (t < 0.6) {
        const s = (t - 0.3) / 0.3;
        r = 200 - s * 70;
        g = 160 - s * 80;
        b = 225 - s * 25;
        a = (0.6 + s * 0.2) * 255;
      } else {
        const s = (t - 0.6) / 0.4;
        r = 130 - s * 50;
        g = 80 - s * 50;
        b = 200 + s * 30;
        a = (0.8 + s * 0.2) * 255;
      }

      const idx = i * 4;
      COLOR_LUT[idx] = r;
      COLOR_LUT[idx + 1] = g;
      COLOR_LUT[idx + 2] = b;
      COLOR_LUT[idx + 3] = a;
    }
  })();

  // === State ===
  let canvas: HTMLCanvasElement = $state()!;
  let ctx: CanvasRenderingContext2D | null = null;
  let imageData: ImageData;
  let animationId: number;

  let width = 0;
  let height = 0;
  let pixelsX = 0;
  let pixelsY = 0;
  let beamCenterX = 0;
  let beamCenterY = 0;
  let maxRadius = 0;
  let frameCounter = 0;

  // Typed arrays for detector state
  let intensities: Float32Array;
  let pulseTimers: Float32Array;
  let probabilityMap: Float32Array; // Precomputed scattering probabilities
  let cumulativeProb: Float32Array; // For weighted random sampling

  // === Scattering intensity function (called once per pixel on init) ===
  function computeScatteringIntensity(normalizedRadius: number): number {
    let intensity = Math.exp(-normalizedRadius * CONFIG.backgroundDecay);

    // Ring features
    const sigma = CONFIG.ringWidth * 0.3;
    const twoSigmaSq = 2 * sigma * sigma;
    for (const qRing of CONFIG.rings) {
      const distance = Math.abs(normalizedRadius - qRing);
      if (distance < CONFIG.ringWidth * 2) {
        intensity += Math.exp(-(distance * distance) / twoSigmaSq) * 0.8 * (1 - qRing * 0.5);
      }
    }

    // Beam stop
    if (normalizedRadius < CONFIG.beamStopRadius) {
      intensity *= normalizedRadius / CONFIG.beamStopRadius;
    }

    return Math.min(intensity, 1);
  }

  // === Initialize detector and precompute probability map ===
  function initDetector() {
    pixelsX = Math.ceil(width / CONFIG.pixelSize);
    pixelsY = Math.ceil(height / CONFIG.pixelSize);
    beamCenterX = pixelsX * CONFIG.beamCenter.x;
    beamCenterY = pixelsY * CONFIG.beamCenter.y;
    maxRadius = Math.sqrt(pixelsX * pixelsX + pixelsY * pixelsY) / 2;

    const numPixels = pixelsX * pixelsY;
    intensities = new Float32Array(numPixels);
    pulseTimers = new Float32Array(numPixels);
    probabilityMap = new Float32Array(numPixels);
    cumulativeProb = new Float32Array(numPixels);

    // Precompute scattering probability for each pixel
    let cumulative = 0;
    for (let py = 0; py < pixelsY; py++) {
      for (let px = 0; px < pixelsX; px++) {
        const idx = py * pixelsX + px;
        const dx = px - beamCenterX;
        const dy = py - beamCenterY;
        const normalizedRadius = Math.sqrt(dx * dx + dy * dy) / maxRadius;
        const prob = computeScatteringIntensity(normalizedRadius);
        probabilityMap[idx] = prob;
        cumulative += prob;
        cumulativeProb[idx] = cumulative;
      }
    }

    // Normalize cumulative distribution
    if (cumulative > 0) {
      for (let i = 0; i < numPixels; i++) {
        cumulativeProb[i] /= cumulative;
      }
    }

    // Create ImageData for direct pixel manipulation
    imageData = ctx!.createImageData(width, height);
    // Fill with background color (off-white)
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 250;
      data[i + 1] = 250;
      data[i + 2] = 252;
      data[i + 3] = 255;
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initDetector();
  }

  // === Binary search for weighted random pixel selection ===
  function samplePhotonPixel(): number {
    const r = Math.random();
    let lo = 0;
    let hi = cumulativeProb.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (cumulativeProb[mid] < r) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  // === Main update loop ===
  function update() {
    const decayRate = CONFIG.intensityDecay;
    const pulseFade = 1 / CONFIG.pulseFadeDuration;
    const numPixels = intensities.length;

    // Decay intensities and pulse timers (single pass)
    for (let i = 0; i < numPixels; i++) {
      if (intensities[i] > 0.1) {
        intensities[i] *= decayRate;
      } else {
        intensities[i] = 0;
      }
      if (pulseTimers[i] > 0) {
        pulseTimers[i] = Math.max(0, pulseTimers[i] - pulseFade);
      }
    }

    // Add photons based on current pulse phase
    const isInPulse = frameCounter < CONFIG.pulseFrames;
    const photonCount = isInPulse ? CONFIG.photonRateHigh : CONFIG.photonRateLow;

    for (let i = 0; i < photonCount; i++) {
      const idx = samplePhotonPixel();
      intensities[idx] = Math.min(intensities[idx] + 2, CONFIG.maxIntensity);
      pulseTimers[idx] = 1;
    }
  }

  // === Render to ImageData (much faster than fillRect calls) ===
  function render() {
    if (!ctx || !imageData) return;

    const data = imageData.data;
    const ps = CONFIG.pixelSize;
    const maxInt = CONFIG.maxIntensity;
    const pulseBoost = CONFIG.pulseBoost;

    // Reset to background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 250;
      data[i + 1] = 250;
      data[i + 2] = 252;
      data[i + 3] = 255;
    }

    // Render detector pixels
    for (let py = 0; py < pixelsY; py++) {
      for (let px = 0; px < pixelsX; px++) {
        const idx = py * pixelsX + px;
        const intensity = intensities[idx];

        if (intensity < 0.1) continue;

        // Look up base color from LUT
        const lutIdx = Math.min(255, Math.floor((intensity / maxInt) * 255)) * 4;
        let r = COLOR_LUT[lutIdx];
        let g = COLOR_LUT[lutIdx + 1];
        let b = COLOR_LUT[lutIdx + 2];
        let a = COLOR_LUT[lutIdx + 3];

        // Apply pulse boost
        const pulse = pulseTimers[idx];
        if (pulse > 0) {
          const boost = pulse * pulseBoost;
          r = Math.min(255, r + boost * (255 - r));
          g = Math.min(255, g + boost * (255 - g));
          b = Math.min(255, b + boost * 100);
          a = Math.min(255, a + boost * 76);
        }

        // Fill pixel block (leaving 1px gap for grid effect)
        const startX = px * ps;
        const startY = py * ps;
        const endX = Math.min(startX + ps - 1, width);
        const endY = Math.min(startY + ps - 1, height);

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            // Alpha blend with background
            const alpha = a / 255;
            data[i] = Math.floor(r * alpha + 250 * (1 - alpha));
            data[i + 1] = Math.floor(g * alpha + 250 * (1 - alpha));
            data[i + 2] = Math.floor(b * alpha + 252 * (1 - alpha));
            data[i + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function animate() {
    update();
    render();

    frameCounter = (frameCounter + 1) % (CONFIG.pulseFrames + CONFIG.gapFrames);
    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!browser) return;

    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none absolute inset-0 h-full w-full"
  aria-hidden="true"
></canvas>
