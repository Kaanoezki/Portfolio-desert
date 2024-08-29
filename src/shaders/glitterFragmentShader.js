export const glitterFragmentShader = `
  uniform float uGlitterIntensity;
  uniform vec3 uCameraPosition;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec3 cameraDir = normalize(vPosition - uCameraPosition);
    float glitterFactor = max(dot(cameraDir, vec3(0.0, 1.0, 0.0)), 0.0);
    glitterFactor = pow(glitterFactor, 4.0); // Reduziere die Glitzerstärke

    vec3 glitterColor = vec3(1.0, 1.0, 1.0) * glitterFactor * uGlitterIntensity;
    gl_FragColor = vec4(glitterColor, 0.2); // Setze die Transparenz
  }
`;
