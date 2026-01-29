<script lang="ts">
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';

  const CONFIG = {
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
    photonRateLow: 1,
    intensityDecay: 0.92,
    pulseFadeDuration: 8,
    pulseBoost: 0.6,
  } as const;

  let canvas: HTMLCanvasElement;
  let gl: WebGL2RenderingContext | null = null;
  let animationId: number;
  let frameCounter = 0;

  // WebGL resources
  let updateProgram: WebGLProgram;
  let renderProgram: WebGLProgram;
  let stateTextures: WebGLTexture[] = [];
  let framebuffers: WebGLFramebuffer[] = [];
  let probabilityTexture: WebGLTexture;
  let colorLutTexture: WebGLTexture;
  let noiseTexture: WebGLTexture;
  let quadVAO: WebGLVertexArrayObject;
  let currentState = 0;
  let pixelsX = 0;
  let pixelsY = 0;

  // === Shader sources ===
  const VERTEX_SHADER = `#version 300 es
    in vec2 a_position;
    out vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Update shader: decay intensities, add photons
  const UPDATE_SHADER = `#version 300 es
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

    // Hash function for additional randomness
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec4 state = texture(u_state, v_uv);
      float intensity = state.r;
      float pulseTimer = state.g;

      // Decay
      intensity = intensity > 0.1 ? intensity * u_decayRate : 0.0;
      pulseTimer = max(0.0, pulseTimer - u_pulseFade);

      // Sample noise texture with time offset for randomness
      vec2 noiseUV = fract(v_uv + vec2(u_time * 0.1, u_time * 0.07));
      float noise = texture(u_noise, noiseUV).r;

      // Additional hash-based randomness
      float rand = hash(v_uv * u_resolution + u_time);

      // Probability of this pixel receiving a photon
      float prob = texture(u_probability, v_uv).r;

      // Scale probability by photon rate (normalized)
      float threshold = prob * u_photonRate * 0.5;

      // Add photons stochastically
      if (noise * rand < threshold) {
        intensity = min(intensity + 2.0, u_maxIntensity);
        pulseTimer = 1.0;
      }

      fragColor = vec4(intensity, pulseTimer, 0.0, 1.0);
    }
  `;

  // Render shader: convert state to visual output with color LUT
  const RENDER_SHADER = `#version 300 es
    precision highp float;

    uniform sampler2D u_state;
    uniform sampler2D u_colorLut;
    uniform float u_maxIntensity;
    uniform float u_pulseBoost;
    uniform vec2 u_resolution;
    uniform vec2 u_detectorSize;
    uniform float u_pixelSize;

    in vec2 v_uv;
    out vec4 fragColor;

    void main() {
      // Background color
      vec3 bgColor = vec3(250.0, 250.0, 252.0) / 255.0;

      // Calculate detector pixel coordinates
      vec2 pixelCoord = v_uv * u_resolution;
      vec2 detectorPixel = floor(pixelCoord / u_pixelSize);
      vec2 withinPixel = mod(pixelCoord, u_pixelSize);

      // Grid gap effect (1px border)
      if (withinPixel.x >= u_pixelSize - 1.0 || withinPixel.y >= u_pixelSize - 1.0) {
        fragColor = vec4(bgColor, 1.0);
        return;
      }

      // Sample state at detector pixel center
      vec2 stateUV = (detectorPixel + 0.5) / u_detectorSize;

      // Clamp to valid range
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

      // Look up color from LUT
      float lutCoord = min(1.0, intensity / u_maxIntensity);
      vec4 color = texture(u_colorLut, vec2(lutCoord, 0.5));

      // Apply pulse boost
      if (pulseTimer > 0.0) {
        float boost = pulseTimer * u_pulseBoost;
        color.r = min(1.0, color.r + boost * (1.0 - color.r));
        color.g = min(1.0, color.g + boost * (1.0 - color.g));
        color.b = min(1.0, color.b + boost * (100.0 / 255.0));
        color.a = min(1.0, color.a + boost * (76.0 / 255.0));
      }

      // Alpha blend with background
      vec3 blended = color.rgb * color.a + bgColor * (1.0 - color.a);
      fragColor = vec4(blended, 1.0);
    }
  `;

  function createShader(type: number, source: string): WebGLShader {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
    }
    return shader;
  }

  function createProgram(vertSrc: string, fragSrc: string): WebGLProgram {
    const program = gl!.createProgram()!;
    gl!.attachShader(program, createShader(gl!.VERTEX_SHADER, vertSrc));
    gl!.attachShader(program, createShader(gl!.FRAGMENT_SHADER, fragSrc));
    gl!.linkProgram(program);
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
      console.error('Program link error:', gl!.getProgramInfoLog(program));
    }
    return program;
  }

  function computeScatteringIntensity(normalizedRadius: number): number {
    let intensity = Math.exp(-normalizedRadius * CONFIG.backgroundDecay);
    const sigma = CONFIG.ringWidth * 0.3;
    const twoSigmaSq = 2 * sigma * sigma;
    for (const qRing of CONFIG.rings) {
      const distance = Math.abs(normalizedRadius - qRing);
      if (distance < CONFIG.ringWidth * 2) {
        intensity +=
          Math.exp(-(distance * distance) / twoSigmaSq) *
          0.8 *
          (1 - qRing * 0.5);
      }
    }
    if (normalizedRadius < CONFIG.beamStopRadius) {
      intensity *= normalizedRadius / CONFIG.beamStopRadius;
    }
    return Math.min(intensity, 1);
  }

  function buildColorLUT(): Uint8Array {
    const lut = new Uint8Array(256 * 4);
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
      lut[idx] = r;
      lut[idx + 1] = g;
      lut[idx + 2] = b;
      lut[idx + 3] = a;
    }
    return lut;
  }

  function initWebGL() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    pixelsX = Math.ceil(width / CONFIG.pixelSize);
    pixelsY = Math.ceil(height / CONFIG.pixelSize);
    const beamCenterX = pixelsX * CONFIG.beamCenter.x;
    const beamCenterY = pixelsY * CONFIG.beamCenter.y;
    const maxRadius = Math.sqrt(pixelsX * pixelsX + pixelsY * pixelsY) / 2;

    // Create programs
    updateProgram = createProgram(VERTEX_SHADER, UPDATE_SHADER);
    renderProgram = createProgram(VERTEX_SHADER, RENDER_SHADER);

    // Create quad VAO
    quadVAO = gl!.createVertexArray()!;
    gl!.bindVertexArray(quadVAO);
    const quadBuffer = gl!.createBuffer()!;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
    gl!.bufferData(
      gl!.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl!.STATIC_DRAW,
    );
    const posLoc = gl!.getAttribLocation(updateProgram, 'a_position');
    gl!.enableVertexAttribArray(posLoc);
    gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 0, 0);

    // Create state textures (ping-pong) - initialize with zeros to avoid lazy init warning
    const initialStateData = new Float32Array(pixelsX * pixelsY * 4);
    for (let i = 0; i < 2; i++) {
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA32F,
        pixelsX,
        pixelsY,
        0,
        gl!.RGBA,
        gl!.FLOAT,
        initialStateData,
      );
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      stateTextures.push(tex);

      const fb = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        tex,
        0,
      );
      framebuffers.push(fb);
    }

    // Create probability texture
    const probData = new Float32Array(pixelsX * pixelsY * 4);
    for (let py = 0; py < pixelsY; py++) {
      for (let px = 0; px < pixelsX; px++) {
        const idx = (py * pixelsX + px) * 4;
        const dx = px - beamCenterX;
        const dy = py - beamCenterY;
        const normalizedRadius = Math.sqrt(dx * dx + dy * dy) / maxRadius;
        probData[idx] = computeScatteringIntensity(normalizedRadius);
      }
    }
    probabilityTexture = gl!.createTexture()!;
    gl!.bindTexture(gl!.TEXTURE_2D, probabilityTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA32F,
      pixelsX,
      pixelsY,
      0,
      gl!.RGBA,
      gl!.FLOAT,
      probData,
    );
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);

    // Create color LUT texture
    const lutData = buildColorLUT();
    colorLutTexture = gl!.createTexture()!;
    gl!.bindTexture(gl!.TEXTURE_2D, colorLutTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      256,
      1,
      0,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      lutData,
    );
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);

    // Create noise texture for randomness
    const noiseSize = 512;
    const noiseData = new Uint8Array(noiseSize * noiseSize * 4);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 255;
    }
    noiseTexture = gl!.createTexture()!;
    gl!.bindTexture(gl!.TEXTURE_2D, noiseTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      noiseSize,
      noiseSize,
      0,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      noiseData,
    );
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.REPEAT);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.REPEAT);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
  }

  function resize() {
    if (!canvas || !gl) return;

    // Cleanup old resources
    stateTextures.forEach((t) => gl!.deleteTexture(t));
    framebuffers.forEach((f) => gl!.deleteFramebuffer(f));
    if (probabilityTexture) gl!.deleteTexture(probabilityTexture);
    if (colorLutTexture) gl!.deleteTexture(colorLutTexture);
    if (noiseTexture) gl!.deleteTexture(noiseTexture);
    stateTextures = [];
    framebuffers = [];
    currentState = 0;

    initWebGL();
  }

  function animate(time: number) {
    if (!gl) return;

    const width = canvas.width;
    const height = canvas.height;
    const isInPulse = frameCounter < CONFIG.pulseFrames;
    const photonRate = isInPulse ? CONFIG.photonRateHigh : CONFIG.photonRateLow;
    const normalizedPhotonRate = photonRate / (pixelsX * pixelsY);

    // Update pass
    gl.useProgram(updateProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1 - currentState]);
    gl.viewport(0, 0, pixelsX, pixelsY);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateTextures[currentState]);
    gl.uniform1i(gl.getUniformLocation(updateProgram, 'u_state'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, probabilityTexture);
    gl.uniform1i(gl.getUniformLocation(updateProgram, 'u_probability'), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    gl.uniform1i(gl.getUniformLocation(updateProgram, 'u_noise'), 2);

    gl.uniform1f(
      gl.getUniformLocation(updateProgram, 'u_decayRate'),
      CONFIG.intensityDecay,
    );
    gl.uniform1f(
      gl.getUniformLocation(updateProgram, 'u_pulseFade'),
      1 / CONFIG.pulseFadeDuration,
    );
    gl.uniform1f(
      gl.getUniformLocation(updateProgram, 'u_photonRate'),
      normalizedPhotonRate,
    );
    gl.uniform1f(
      gl.getUniformLocation(updateProgram, 'u_maxIntensity'),
      CONFIG.maxIntensity,
    );
    gl.uniform1f(gl.getUniformLocation(updateProgram, 'u_time'), time * 0.001);
    gl.uniform2f(
      gl.getUniformLocation(updateProgram, 'u_resolution'),
      pixelsX,
      pixelsY,
    );

    gl.bindVertexArray(quadVAO);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    currentState = 1 - currentState;

    // Render pass
    gl.useProgram(renderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, stateTextures[currentState]);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_state'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, colorLutTexture);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_colorLut'), 1);

    gl.uniform1f(
      gl.getUniformLocation(renderProgram, 'u_maxIntensity'),
      CONFIG.maxIntensity,
    );
    gl.uniform1f(
      gl.getUniformLocation(renderProgram, 'u_pulseBoost'),
      CONFIG.pulseBoost,
    );
    gl.uniform2f(
      gl.getUniformLocation(renderProgram, 'u_resolution'),
      width,
      height,
    );
    gl.uniform2f(
      gl.getUniformLocation(renderProgram, 'u_detectorSize'),
      pixelsX,
      pixelsY,
    );
    gl.uniform1f(
      gl.getUniformLocation(renderProgram, 'u_pixelSize'),
      CONFIG.pixelSize,
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    frameCounter = (frameCounter + 1) % (CONFIG.pulseFrames + CONFIG.gapFrames);
    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!browser) return;

    gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    // Enable float textures
    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) {
      console.error('EXT_color_buffer_float not supported');
      return;
    }

    initWebGL();
    animationId = requestAnimationFrame(animate);

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
