import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sandVertexShader } from './shaders/sandVertexShader';
import { sandFragmentShader } from './shaders/sandFragmentShader';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Szene, Kamera und Renderer erstellen
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer erstellen und an Pixel-Verhältnis anpassen
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lichtquelle hinzufügen
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Kamera-Position setzen
    camera.position.z = 5;
    camera.position.y = 2;

    // Kamera-Steuerung hinzufügen
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const sandMaterial = new THREE.ShaderMaterial({
      vertexShader: sandVertexShader,
      fragmentShader: sandFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uColor1: { value: new THREE.Color(0xe0ac69) },  // Sandfarbe 1
        uColor2: { value: new THREE.Color(0xf4deb8) }   // Sandfarbe 2
      },
      side: THREE.DoubleSide
    });
    

    // Sand-Plane erstellen
    const sandGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = 0.2;
    scene.add(sand);

    // Würfel erstellen
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Funktion zum Laden und Hinzufügen des Hintergrunds
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

    // Animationsfunktion
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01; 
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      
      // Aktualisiere die Zeit für die Shader-Animation
      sandMaterial.uniforms.uTime.value += 0.02; 
    };
    

    animate();

    // Fenstergrößenänderung
    const handleResize = () => {
      if (mountRef.current) {
        const { clientWidth, clientHeight } = mountRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup bei Komponentenunmount
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
