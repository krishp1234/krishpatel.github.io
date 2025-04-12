import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Load Textures
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/worldColour.5400x2700.jpg');
const bumpTexture = textureLoader.load('textures/earth_bumpmap.jpg');

earthTexture.colorSpace = THREE.SRGBColorSpace;
bumpTexture.colorSpace = THREE.SRGBColorSpace;

// Earth Material
const material = new THREE.MeshStandardMaterial({
  map: earthTexture,
  bumpMap: bumpTexture,
  bumpScale: 0.05
});

// Earth Geometry
const geometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enableDamping = true;

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002; // Optional: slow spin
  controls.update();
  renderer.render(scene, camera);
}

animate();
