import {
  CONFIG,
  VERTEX_SHADER,
  RENDER_SHADER,
  UPDATE_SHADER,
  buildColorLUT,
  computeScatteringIntensity,
} from './scattering-shaders';
import { bindTextureToUnit, createTexture2D } from './scattering-helpers';

export class ScatteringRenderer {
  private gl: WebGL2RenderingContext;
  private updateProgram!: WebGLProgram;
  private renderProgram!: WebGLProgram;
  private stateTextures: WebGLTexture[] = [];
  private framebuffers: WebGLFramebuffer[] = [];
  private probabilityTexture!: WebGLTexture;
  private colorLutTexture!: WebGLTexture;
  private noiseTexture!: WebGLTexture;
  private quadVAO!: WebGLVertexArrayObject;
  private currentState = 0;
  private pixelsX = 0;
  private pixelsY = 0;
  private frameCounter = 0;
  private animationId = 0;
  private isDarkMode = false;
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    darkMode: boolean,
  ) {
    this.isDarkMode = darkMode;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;
    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) throw new Error('EXT_color_buffer_float not supported');
  }

  private createShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  private createProgram(vertSrc: string, fragSrc: string): WebGLProgram {
    const gl = this.gl;
    const program = gl.createProgram()!;
    gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }
    return program;
  }

  private initWebGL() {
    const gl = this.gl;
    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.pixelsX = Math.ceil(w / CONFIG.pixelSize);
    this.pixelsY = Math.ceil(h / CONFIG.pixelSize);
    const bcX = this.pixelsX * CONFIG.beamCenter.x;
    const bcY = this.pixelsY * CONFIG.beamCenter.y;
    const maxR = Math.hypot(this.pixelsX, this.pixelsY) / 2;

    this.updateProgram = this.createProgram(VERTEX_SHADER, UPDATE_SHADER);
    this.renderProgram = this.createProgram(VERTEX_SHADER, RENDER_SHADER);

    this.quadVAO = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVAO);
    const qb = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, qb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(this.updateProgram, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const initData = new Float32Array(this.pixelsX * this.pixelsY * 4);
    for (let i = 0; i < 2; i++) {
      const tex = createTexture2D(gl, gl.RGBA32F, this.pixelsX, this.pixelsY, gl.RGBA, gl.FLOAT, initData, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
      this.stateTextures.push(tex);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      this.framebuffers.push(fb);
    }

    const probData = new Float32Array(this.pixelsX * this.pixelsY * 4);
    for (let py = 0; py < this.pixelsY; py++) {
      for (let px = 0; px < this.pixelsX; px++) {
        probData[(py * this.pixelsX + px) * 4] = computeScatteringIntensity(Math.hypot(px - bcX, py - bcY) / maxR);
      }
    }
    this.probabilityTexture = createTexture2D(gl, gl.RGBA32F, this.pixelsX, this.pixelsY, gl.RGBA, gl.FLOAT, probData, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
    this.colorLutTexture = createTexture2D(gl, gl.RGBA, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, buildColorLUT(this.isDarkMode), gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const ns = 512;
    const nd = new Uint8Array(ns * ns * 4);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 255;
    this.noiseTexture = createTexture2D(gl, gl.RGBA, ns, ns, gl.RGBA, gl.UNSIGNED_BYTE, nd, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private cleanupTextures() {
    const gl = this.gl;
    this.stateTextures.forEach((t) => gl.deleteTexture(t));
    this.framebuffers.forEach((f) => gl.deleteFramebuffer(f));
    gl.deleteTexture(this.probabilityTexture);
    gl.deleteTexture(this.colorLutTexture);
    gl.deleteTexture(this.noiseTexture);
    this.stateTextures = [];
    this.framebuffers = [];
    this.currentState = 0;
  }

  private resize() {
    this.cleanupTextures();
    this.initWebGL();
  }

  private animate = (time: number) => {
    if (this.disposed) return;
    const gl = this.gl;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const inPulse = this.frameCounter < CONFIG.pulseFrames;
    const rate = inPulse ? CONFIG.photonRateHigh : this.isDarkMode ? 0 : CONFIG.photonRateLowMax;
    const nRate = rate / (this.pixelsX * this.pixelsY);
    const bg = this.isDarkMode ? { r: 20 / 255, g: 20 / 255, b: 30 / 255 } : { r: 250 / 255, g: 250 / 255, b: 252 / 255 };

    gl.useProgram(this.updateProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[1 - this.currentState]);
    gl.viewport(0, 0, this.pixelsX, this.pixelsY);
    bindTextureToUnit(gl, this.updateProgram, 'u_state', this.stateTextures[this.currentState], 0);
    bindTextureToUnit(gl, this.updateProgram, 'u_probability', this.probabilityTexture, 1);
    bindTextureToUnit(gl, this.updateProgram, 'u_noise', this.noiseTexture, 2);
    const up = this.updateProgram;
    gl.uniform1f(gl.getUniformLocation(up, 'u_decayRate'), CONFIG.intensityDecay);
    gl.uniform1f(gl.getUniformLocation(up, 'u_pulseFade'), 1 / CONFIG.pulseFadeDuration);
    gl.uniform1f(gl.getUniformLocation(up, 'u_photonRate'), nRate);
    gl.uniform1f(gl.getUniformLocation(up, 'u_maxIntensity'), CONFIG.maxIntensity);
    gl.uniform1f(gl.getUniformLocation(up, 'u_time'), time * 0.001);
    gl.uniform2f(gl.getUniformLocation(up, 'u_resolution'), this.pixelsX, this.pixelsY);
    gl.bindVertexArray(this.quadVAO);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.currentState = 1 - this.currentState;

    gl.useProgram(this.renderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    bindTextureToUnit(gl, this.renderProgram, 'u_state', this.stateTextures[this.currentState], 0);
    bindTextureToUnit(gl, this.renderProgram, 'u_colorLut', this.colorLutTexture, 1);
    const rp = this.renderProgram;
    gl.uniform1f(gl.getUniformLocation(rp, 'u_maxIntensity'), CONFIG.maxIntensity);
    gl.uniform1f(gl.getUniformLocation(rp, 'u_pulseBoost'), CONFIG.pulseBoost);
    gl.uniform2f(gl.getUniformLocation(rp, 'u_resolution'), w, h);
    gl.uniform2f(gl.getUniformLocation(rp, 'u_detectorSize'), this.pixelsX, this.pixelsY);
    gl.uniform1f(gl.getUniformLocation(rp, 'u_pixelSize'), CONFIG.pixelSize);
    gl.uniform3f(gl.getUniformLocation(rp, 'u_bgColor'), bg.r, bg.g, bg.b);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.frameCounter = (this.frameCounter + 1) % (CONFIG.pulseFrames + CONFIG.gapFrames);
    this.animationId = requestAnimationFrame(this.animate);
  };

  setDarkMode(dark: boolean) {
    if (dark === this.isDarkMode) return;
    this.isDarkMode = dark;
    const gl = this.gl;
    gl.deleteTexture(this.colorLutTexture);
    this.colorLutTexture = createTexture2D(gl, gl.RGBA, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, buildColorLUT(dark), gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
  }

  start() {
    this.initWebGL();
    this.animationId = requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize);
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener('resize', this.resize);
    cancelAnimationFrame(this.animationId);
    this.cleanupTextures();
  }
}
