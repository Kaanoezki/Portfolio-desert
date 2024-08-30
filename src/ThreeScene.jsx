import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sandVertexShader } from './shaders/sandVertexShader.js';
import { sandFragmentShader } from './shaders/sandFragmentShader.js';
import { glitterFragmentShader } from './shaders/glitterFragmentShader.js';
import BloomEffect from './bloomEffect'; 



const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    // directionalLight.position.set(10, 10, 10);
    // scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    camera.position.z = 5;
    camera.position.y = 2;

    
    const reflectiveMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x686868, // Leuchtfarbe
      emissiveIntensity: 2.0, // Intensität der Emission
      metalness: 1.0,  // Hohes Metalness für starke Reflexionen
      roughness: 0.1,  // Geringe Rauheit für glänzende Reflexionen
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), reflectiveMaterial);
    scene.add(sphere);
    
    // Sand Material
    const sandMaterial = new THREE.ShaderMaterial({
      vertexShader: sandVertexShader,
      fragmentShader: sandFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uColor1: { value: new THREE.Color(0xe9ac99) }, // Sandfarbe 1
        uColor2: { value: new THREE.Color(0xf4deb8) }, // Sandfarbe 2
        // uLightPosition: { value: new THREE.Vector3(10, 10, 10) },
        uCameraPosition: { value: camera.position },
        uShininess: { value: 3 },
        uRimPower: { value:1 },
      },
      side: THREE.DoubleSide
    });

    const sandGeometry = new THREE.PlaneGeometry(300, 300, 200, 200);
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = 0.0;
    scene.add(sand);

    // Glitzer Material
    const glitterMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: glitterFragmentShader,
      uniforms: {
        uGlitterIntensity: { value: 0.8 }, // Subtle glitter effect
        uCameraPosition: { value: camera.position }
      },
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });

    const glitterGeometry = new THREE.PlaneGeometry(10, 10, 200, 200);
    const glitter = new THREE.Mesh(glitterGeometry, glitterMaterial);
    glitter.rotation.x = -Math.PI / 2;
    glitter.position.y = 0.01;
    glitter.renderOrder = 1; 
    scene.add(glitter);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Background Loader
    function loadBackground() {
      const loader = new GLTFLoader();
      loader.load('/src/assets/background.glb', (gltf) => {
        const backgroundScene = gltf.scene;
        backgroundScene.position.set(0, -10, -10);
        backgroundScene.scale.set(1, 1, 1);

        backgroundScene.traverse((child) => {
          if (child.isMesh) {
            const originalMaterial = child.material;
            const map = originalMaterial.map || null;
            const normalMap = originalMaterial.normalMap || null;
            const displacementMap = originalMaterial.displacementMap || null;

            const newMaterial = new THREE.MeshStandardMaterial({
              map: map,
              normalMap: normalMap,
              displacementMap: displacementMap,
              side: THREE.DoubleSide,
            });

            child.material = newMaterial;
          }
        });

        scene.add(backgroundScene);
      });
    }

    loadBackground();

    const composer = BloomEffect(renderer, scene, camera);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();

      // Update uniforms
      sandMaterial.uniforms.uTime.value += 0.01; 
      sandMaterial.uniforms.uCameraPosition.value = camera.position;

      // Update glitter
      glitterMaterial.uniforms.uCameraPosition.value = camera.position;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (mountRef.current) {
        const { clientWidth, clientHeight } = mountRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        composer.setSize(clientWidth, clientHeight); 
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="canvas-container" />;
};

export default ThreeScene;
