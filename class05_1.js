// Importing Three.js and necessary controls/loaders
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/loaders/OBJLoader.js';

let camera, scene, renderer;
init();

function init() {
  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20);
  camera.position.z = 2.5;

  // Scene
  scene = new THREE.Scene();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Environment map
  const envMapLoader = new THREE.CubeTextureLoader();
  const environmentMap = envMapLoader.load([
    'textures/Bridge2/posx.jpg',
    'textures/Bridge2/negx.jpg',
    'textures/Bridge2/posy.jpg',
    'textures/Bridge2/negy.jpg',
    'textures/Bridge2/posz.jpg',
    'textures/Bridge2/negz.jpg'
  ]);
  scene.environment = environmentMap;
  scene.background = environmentMap;

  // Glass-like material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffff00,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    transparent: true,
    reflectivity: 1,
    refractionRatio: 0.9
  });

  // Load OBJ model
  const loader = new OBJLoader();
  loader.load(
    'models/sphere.obj',
    function (obj) {
      // Apply material
      obj.traverse(function (child) {
        if (child.isMesh) {
          child.material = glassMaterial;
        }
      });

      // Scale and center the model
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 1.0 / Math.max(size.x, size.y, size.z);
      obj.scale.setScalar(scale);
      obj.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      scene.add(obj);
      render();
    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}
