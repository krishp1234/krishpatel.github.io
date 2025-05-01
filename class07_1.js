import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//
// Workshop 7: N-Body Gravity (sum forces from multiple planets)
//

const G = 6.674e-3;     // gravitational constant (scaled down for visuals)
const PARTICLE_MASS = 1;
const PLANETS = [
  { mass: 20, color: 0xff4444, position: new THREE.Vector3( 5,  0, 0) },
  { mass: 10, color: 0x44ff44, position: new THREE.Vector3(-5,  0, 0) },
  { mass: 15, color: 0x4444ff, position: new THREE.Vector3( 0,  5, 0) }
];

let scene, camera, renderer, controls;
let particle, velocity;

init();
animate();

function init() {
  // scene + camera
  scene    = new THREE.Scene();
  camera   = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(0,0,20);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  // light
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(1,1,1);
  scene.add(dir);

  // planets
  for (let p of PLANETS) {
    const mat = new THREE.MeshStandardMaterial({ color: p.color });
    const geo = new THREE.SphereGeometry(0.8, 16, 16);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(p.position);
    scene.add(mesh);
    p.mesh = mesh;
  }

  // particle
  const pmat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const pgeo = new THREE.SphereGeometry(0.3, 12, 12);
  particle = new THREE.Mesh(pgeo, pmat);
  particle.position.set(0, -8, 0);
  scene.add(particle);

  velocity = new THREE.Vector3(2,0,0);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  window.addEventListener('resize', onResize);
}

function onResize() {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // compute net force on the particle
  let netF = new THREE.Vector3(0,0,0);
  for (let p of PLANETS) {
    let r = new THREE.Vector3().subVectors(p.mesh.position, particle.position);
    let dist2 = r.lengthSq();
    let Fmag  = G * (PARTICLE_MASS * p.mass) / dist2;
    netF.add(r.normalize().multiplyScalar(Fmag));
  }

  // simple Euler integration: a = F/m
  let accel = netF.clone().divideScalar(PARTICLE_MASS);
  velocity.add(accel.multiplyScalar(0.016));            // dt ≈ 1/60
  particle.position.add(velocity.clone().multiplyScalar(0.016));

  controls.update();
  renderer.render(scene, camera);
}
