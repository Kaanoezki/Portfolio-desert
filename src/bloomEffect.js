// BloomEffect.js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as THREE from 'three';
import { Effects } from '@react-three/drei'

const BloomEffect = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer);
  
  // Render Pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  // Bloom Pass
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.5, // Stärke des Bloom-Effekts
   0, // Radius
   0 // Schwellenwert
  );
  composer.addPass(bloomPass);
  
  return composer;
};

export default BloomEffect;
