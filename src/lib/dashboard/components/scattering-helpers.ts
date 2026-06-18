export function setTexParams(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number,
) {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
}

export function createTexture2D(
  gl: WebGL2RenderingContext,
  internalFormat: number,
  width: number,
  height: number,
  format: number,
  type: number,
  data: ArrayBufferView,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number,
): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
  setTexParams(gl, minFilter, magFilter, wrapS, wrapT);
  return tex;
}

export function bindTextureToUnit(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniformName: string,
  texture: WebGLTexture,
  unit: number,
) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, uniformName), unit);
}
