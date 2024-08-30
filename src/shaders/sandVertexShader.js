export const sandVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    // Wellen-Effekt
    float waveHeight = sin(position.x * 0.5 + uTime) * 0.1; // Höhe und Geschwindigkeit der Welle
    vec3 newPosition = position + normal * waveHeight;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;
