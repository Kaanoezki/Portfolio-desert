import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Füge den Renderer zur Seite hinzu
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

    // Ein einfaches Würfel-Mesh erstellen
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

        // Traverse das Modell, um jedes Mesh zu bearbeiten
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

        scene.add(backgroundScene); // Hintergrund zur Szene hinzufügen
      });
    }

    // Hintergrund laden und initialisieren
    loadBackground();

    // Animationsfunktion
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01; // Würfel rotieren lassen
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    // Start der Animation
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
    handleResize(); // Initiale Größenanpassung

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
