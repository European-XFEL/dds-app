export const CONFIG = {
  pixelSize: 8,
  maxIntensity: 30,
  beamCenter: { x: 0.5, y: 0.55 },
  rings: [0.12, 0.28, 0.48, 0.72] as const,
  ringWidth: 0.04,
  backgroundDecay: 3.0,
  beamStopRadius: 0.04,
  pulseFrames: 15,
  gapFrames: 60,
  photonRateHigh: 20_000,
  photonRateLowMax: 1,
  intensityDecay: 0.92,
  pulseFadeDuration: 8,
  pulseBoost: 0.6,
} as const;

export const VERTEX_SHADER = `#version 300 es
  in vec2 a_position;
  out vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const UPDATE_SHADER = `#version 300 es
  precision highp float;

  uniform sampler2D u_state;
  uniform sampler2D u_probability;
  uniform sampler2D u_noise;
  uniform float u_decayRate;
  uniform float u_pulseFade;
  uniform float u_photonRate;
  uniform float u_maxIntensity;
  uniform float u_time;
  uniform vec2 u_resolution;

  in vec2 v_uv;
  out vec4 fragColor;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec4 state = texture(u_state, v_uv);
    float intensity = state.r;
    float pulseTimer = state.g;

    intensity = intensity > 0.1 ? intensity * u_decayRate : 0.0;
    pulseTimer = max(0.0, pulseTimer - u_pulseFade);

    vec2 noiseUV = fract(v_uv + vec2(u_time * 0.1, u_time * 0.07));
    float noise = texture(u_noise, noiseUV).r;
    float rand = hash(v_uv * u_resolution + u_time);
    float prob = texture(u_probability, v_uv).r;
    float threshold = prob * u_photonRate * 0.5;

    if (noise * rand < threshold) {
      intensity = min(intensity + 2.0, u_maxIntensity);
      pulseTimer = 1.0;
    }

    fragColor = vec4(intensity, pulseTimer, 0.0, 1.0);
  }
`;

export const RENDER_SHADER = `#version 300 es
  precision highp float;

  uniform sampler2D u_state;
  uniform sampler2D u_colorLut;
  uniform float u_maxIntensity;
  uniform float u_pulseBoost;
  uniform vec2 u_resolution;
  uniform vec2 u_detectorSize;
  uniform float u_pixelSize;
  uniform vec3 u_bgColor;

  in vec2 v_uv;
  out vec4 fragColor;

  void main() {
    vec3 bgColor = u_bgColor;
    vec2 pixelCoord = v_uv * u_resolution;
    vec2 detectorPixel = floor(pixelCoord / u_pixelSize);
    vec2 withinPixel = mod(pixelCoord, u_pixelSize);

    if (withinPixel.x >= u_pixelSize - 1.0 || withinPixel.y >= u_pixelSize - 1.0) {
      fragColor = vec4(bgColor, 1.0);
      return;
    }

    vec2 stateUV = (detectorPixel + 0.5) / u_detectorSize;
    if (stateUV.x < 0.0 || stateUV.x > 1.0 || stateUV.y < 0.0 || stateUV.y > 1.0) {
      fragColor = vec4(bgColor, 1.0);
      return;
    }

    vec4 state = texture(u_state, stateUV);
    float intensity = state.r;
    float pulseTimer = state.g;

    if (intensity < 0.1) {
      fragColor = vec4(bgColor, 1.0);
      return;
    }

    float lutCoord = min(1.0, intensity / u_maxIntensity);
    vec4 color = texture(u_colorLut, vec2(lutCoord, 0.5));

    if (pulseTimer > 0.0) {
      float boost = pulseTimer * u_pulseBoost;
      color.r = min(1.0, color.r + boost * (1.0 - color.r));
      color.g = min(1.0, color.g + boost * (1.0 - color.g));
      color.b = min(1.0, color.b + boost * (100.0 / 255.0));
      color.a = min(1.0, color.a + boost * (76.0 / 255.0));
    }

    vec3 blended = color.rgb * color.a + bgColor * (1.0 - color.a);
    fragColor = vec4(blended, 1.0);
  }
`;

export function computeScatteringIntensity(normalizedRadius: number): number {
  let intensity = Math.exp(-normalizedRadius * CONFIG.backgroundDecay);
  const sigma = CONFIG.ringWidth * 0.3;
  const twoSigmaSq = 2 * sigma * sigma;
  for (const qRing of CONFIG.rings) {
    const distance = Math.abs(normalizedRadius - qRing);
    if (distance < CONFIG.ringWidth * 2) {
      intensity +=
        Math.exp(-(distance * distance) / twoSigmaSq) * 0.8 * (1 - qRing * 0.5);
    }
  }
  if (normalizedRadius < CONFIG.beamStopRadius) {
    intensity *= normalizedRadius / CONFIG.beamStopRadius;
  }
  return Math.min(intensity, 1);
}

export function buildColorLUT(darkMode: boolean): Uint8Array {
  const lut = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r: number, g: number, b: number, a: number;

    if (darkMode) {
      if (t < 0.3) {
        const s = t / 0.3;
        r = 100 + s * 100;
        g = 150 + s * 50;
        b = 255;
        a = (0 + s * 0.3) * 255;
      } else if (t < 0.6) {
        const s = (t - 0.3) / 0.3;
        r = 200 - s * 50;
        g = 200 - s * 50;
        b = 255;
        a = (0.5 + s * 0.25) * 255;
      } else {
        const s = (t - 0.6) / 0.4;
        r = 255 - s * 50;
        g = 100 - s * 50;
        b = 200 + s * 30;
        a = (0.75 + s * 0.25) * 255;
      }
    } else {
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
    }
    const idx = i * 4;
    lut[idx] = r;
    lut[idx + 1] = g;
    lut[idx + 2] = b;
    lut[idx + 3] = a;
  }
  return lut;
}
