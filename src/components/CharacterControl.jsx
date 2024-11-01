import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const CharacterControl = ({ scene }) => {
  const characterRef = useRef(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const character = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    character.position.y = 0.5;
    scene.add(character);
    characterRef.current = character;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          velocity.current.z = -0.05;
          break;
        case "ArrowDown":
          velocity.current.z = 0.05;
          break;
        case "ArrowLeft":
          velocity.current.x = -0.05;
          break;
        case "ArrowRight":
          velocity.current.x = 0.05;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          velocity.current.z = 0;
          break;
        case "ArrowLeft":
        case "ArrowRight":
          velocity.current.x = 0;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (character) scene.remove(character);
    };
  }, [scene]);

  useEffect(() => {
    const animate = () => {
      if (characterRef.current) {
        characterRef.current.position.add(velocity.current);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return null;
};

export default CharacterControl;
