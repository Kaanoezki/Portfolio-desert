// createMessageSprite.js
import * as THREE from 'three';

const createMessageSprite = (message) => {
    // Erstelle ein Canvas mit höherer Auflösung
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Erhöhte Breite
    canvas.height = 512; // Erhöhte Höhe
    const context = canvas.getContext('2d');
    
    // Setze die Schriftgröße und -art für besseren Text
    context.font = '64px Arial'; // Größere Schriftgröße
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.fillText(message, canvas.width / 2, canvas.height / 2); // Text zentrieren

    // Erstelle ein Texture aus dem Canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Erstelle das Sprite-Material und -Sprite
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Setze die Größe des Sprites
    sprite.scale.set(10, 10, 1); // Erhöhte Größe für bessere Sichtbarkeit

    return sprite;
};

export default createMessageSprite;
