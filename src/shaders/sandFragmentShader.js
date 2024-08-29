export const sandFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uLightPosition;
  uniform vec3 uCameraPosition;
  uniform float uShininess;
  uniform float uRimPower;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Simplex noise function placeholder (replace with a more complex noise function if needed)
  float noise(vec2 p) {
    return fract(sin(dot(p ,vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 sandColor = mix(uColor1, uColor2, vUv.y);

    // Licht- und Kamerapositionen
    vec3 lightDir = normalize(uLightPosition - vPosition);
    vec3 viewDir = normalize(uCameraPosition - vPosition);
    vec3 reflectDir = reflect(-lightDir, vNormal);

    // Specular Highlight
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = vec3(1.0) * spec;

    // Glitzerreflexion hinzufügen (Noise)
    float noiseValue = noise(vUv * 10.0 + vec2(uTime * 0.1, uTime * 0.1));
    float glitter = pow(noiseValue, 1.0);

    // Rim Lighting
    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
    rim = pow(rim, uRimPower);

    sandColor += specular * 0.5 + glitter * 0.1 + rim * 0.5;

    gl_FragColor = vec4(sandColor, 1.0);
  }
`;
