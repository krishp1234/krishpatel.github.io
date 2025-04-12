// Importing OrbitControls (make sure the path matches the version you are using)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/controls/OrbitControls.js';

// Creating the scene
var scene = new THREE.Scene();

// Creating the camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Creating the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add light.
const directionLight = new THREE.DirectionalLight(0xffffff, 3.0)
directionLight.position.set(0, 0, 10)
scene.add(directionLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // white light at 50% intensity
scene.add(ambientLight)

// load different color textures
const textureGold = new THREE.TextureLoader().load('textures/silver.png');
const textureUV = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');

textureGold.colorSpace = THREE.SRGBColorSpace;
textureUV.colorSpace = THREE.SRGBColorSpace;

const materialGold = new THREE.MeshStandardMaterial({ map: textureGold });
const materialUV = new THREE.MeshStandardMaterial({ map: textureUV });

// Creating a cube
const boxX = 1, boxY = 1, boxZ = 1;
const boxSegment = 100;
const boxGeometry = new THREE.BoxGeometry(boxX, boxY, boxZ, boxSegment, boxSegment, boxSegment);

// add cube to the scene
const cube = new THREE.Mesh(boxGeometry, materialUV);
cube.position.set(0, 1, 0);
scene.add(cube);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); // top radius, bottom radius, height, radial segments
const cylinder = new THREE.Mesh(cylinderGeometry, materialGold);
cylinder.position.set(-1.5, 1, 0);
scene.add(cylinder);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // radius, widthSegments, heightSegments
const sphere = new THREE.Mesh(sphereGeometry, materialUV);
sphere.position.set(1.5, 1, 0)
scene.add(sphere);

{
    const texture = new THREE.TextureLoader().load('textures/worldColour.5400x2700.jpg');
    const dispTexture = new THREE.TextureLoader().load('textures/earth_bumpmap.jpg');
    const materialBump = new THREE.MeshStandardMaterial({ map: texture, bumpMap: dispTexture, bumpScale: 0.05 });

    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globe = new THREE.Mesh(globeGeometry, materialBump);
    globe.position.set(0, -1.5, 0);
    scene.add(globe);

    // Optional: spin the globe slowly
    function rotateGlobe() {
        globe.rotation.y += 0.002;
    }

    // Animate with globe rotation
    function animate() {
        requestAnimationFrame(animate);
        rotateGlobe();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

// Adding OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enablePan = true;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
