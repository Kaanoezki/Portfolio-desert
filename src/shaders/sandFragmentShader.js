const sandFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    float wave = sin(vUv.y * 10.0 + uTime) * 0.1;
    vec3 sandColor = mix(uColor1, uColor2, vUv.y + wave);
    gl_FragColor = vec4(sandColor, 1.0);
  }
`;

export { sandFragmentShader };
