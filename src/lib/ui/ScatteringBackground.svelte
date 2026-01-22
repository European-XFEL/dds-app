<script lang="ts">
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';

  // Detector configuration
  const PIXEL_SIZE = 8;
  const PHOTON_RATE = 80;
  const MAX_INTENSITY = 40;
  const BEAM_CENTER_FRACTION = { x: 0.5, y: 0.4 };

  const Q_RINGS = [0.12, 0.28, 0.48, 0.72];
  const RING_WIDTH = 0.04; // Narrower rings for sharper appearance
  const BACKGROUND_DECAY = 3.0; // Faster falloff

  const PULSE_DURATION = 8; // Frames for pulse to fade
  const PULSE_INTENSITY = 0.6; // How bright the pulse is (0-1)

  let canvas: HTMLCanvasElement = $state()!;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let width = 0;
  let height = 0;
  let pixelsX = 0;
  let pixelsY = 0;
  let beamCenterX = 0;
  let beamCenterY = 0;
  let maxRadius = 0;

  // Detector pixel array - stores accumulated photon counts
  let detectorPixels: Float32Array;
  let pulseTimers: Float32Array;

  function getPixelColor(counts: number, pulseT: number): string {
    if (counts === 0) {
      return 'rgba(255, 255, 255, 0)'; // Transparent for empty pixels
    }

    const t = Math.min(counts / MAX_INTENSITY, 1);

    // Base color progression: light lavender -> purple -> deep violet
    let r: number, g: number, b: number, a: number;

    if (t < 0.3) {
      // Light lavender
      const s = t / 0.3;
      r = Math.floor(245 - s * 45);
      g = Math.floor(240 - s * 80);
      b = Math.floor(255 - s * 30);
      a = 0.3 + s * 0.3;
    } else if (t < 0.6) {
      // Lavender to purple
      const s = (t - 0.3) / 0.3;
      r = Math.floor(200 - s * 70);
      g = Math.floor(160 - s * 80);
      b = Math.floor(225 - s * 25);
      a = 0.6 + s * 0.2;
    } else {
      // Purple to deep violet
      const s = (t - 0.6) / 0.4;
      r = Math.floor(130 - s * 50);
      g = Math.floor(80 - s * 50);
      b = Math.floor(200 + s * 30);
      a = 0.8 + s * 0.2;
    }

    if (pulseT > 0) {
      const pulseBoost = pulseT * PULSE_INTENSITY;
      r = Math.min(255, r + Math.floor(pulseBoost * (255 - r)));
      g = Math.min(255, g + Math.floor(pulseBoost * (255 - g)));
      b = Math.min(255, b + Math.floor(pulseBoost * 100));
      a = Math.min(1, a + pulseBoost * 0.3);
    }

    return `rgba(${r},${g},${b},${a})`;
  }

  function initDetector() {
    pixelsX = Math.ceil(width / PIXEL_SIZE);
    pixelsY = Math.ceil(height / PIXEL_SIZE);
    beamCenterX = pixelsX * BEAM_CENTER_FRACTION.x;
    beamCenterY = pixelsY * BEAM_CENTER_FRACTION.y;
    maxRadius = Math.sqrt(pixelsX * pixelsX + pixelsY * pixelsY) / 2;

    detectorPixels = new Float32Array(pixelsX * pixelsY);
    pulseTimers = new Float32Array(pixelsX * pixelsY);
  }

  function resize() {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initDetector();
  }

  function scatteringIntensity(normalizedRadius: number): number {
    let intensity = Math.exp(-normalizedRadius * BACKGROUND_DECAY);

    // Sharper ring features with stronger peaks
    for (const qRing of Q_RINGS) {
      const distance = Math.abs(normalizedRadius - qRing);
      if (distance < RING_WIDTH * 2) {
        // Sharper Gaussian ring
        const sigma = RING_WIDTH * 0.3;
        const ringIntensity = Math.exp(-(distance * distance) / (2 * sigma * sigma));
        intensity += ringIntensity * 0.8 * (1 - qRing * 0.5);
      }
    }

    // Beam stop region
    if (normalizedRadius < 0.04) {
      intensity *= normalizedRadius / 0.04;
    }

    return Math.min(intensity, 1);
  }

  function generatePhotonHit(): { px: number; py: number } | null {
    for (let attempt = 0; attempt < 10; attempt++) {
      const px = Math.floor(Math.random() * pixelsX);
      const py = Math.floor(Math.random() * pixelsY);

      const dx = px - beamCenterX;
      const dy = py - beamCenterY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const normalizedRadius = radius / maxRadius;

      const intensity = scatteringIntensity(normalizedRadius);
      if (Math.random() < intensity) {
        return { px, py };
      }
    }
    return null;
  }

  function accumulatePhotons() {
    for (let i = 0; i < pulseTimers.length; i++) {
      if (pulseTimers[i] > 0) {
        pulseTimers[i] -= 1 / PULSE_DURATION;
        if (pulseTimers[i] < 0) pulseTimers[i] = 0;
      }
    }

    // Add new photon hits
    for (let i = 0; i < PHOTON_RATE; i++) {
      const hit = generatePhotonHit();
      if (hit) {
        const idx = hit.py * pixelsX + hit.px;
        if (detectorPixels[idx] < MAX_INTENSITY) {
          detectorPixels[idx] += 1;
          pulseTimers[idx] = 1;
        }
      }
    }
  }

  function renderDetector() {
    if (!ctx) return;

    ctx.fillStyle = 'rgb(250, 250, 252)';
    ctx.fillRect(0, 0, width, height);

    // Render each detector pixel
    for (let py = 0; py < pixelsY; py++) {
      for (let px = 0; px < pixelsX; px++) {
        const idx = py * pixelsX + px;
        const counts = detectorPixels[idx];
        const pulseT = pulseTimers[idx];

        if (counts > 0) {
          ctx.fillStyle = getPixelColor(counts, pulseT);
          ctx.fillRect(px * PIXEL_SIZE, py * PIXEL_SIZE, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
        }
      }
    }
  }

  function animate() {
    accumulatePhotons();
    renderDetector();
    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!browser) return;

    ctx = canvas.getContext('2d');
    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none absolute inset-0 h-full w-full"
  aria-hidden="true"
></canvas>
