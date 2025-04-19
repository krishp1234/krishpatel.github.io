import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader }      from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader }      from 'three/addons/loaders/OBJLoader.js';

let camera, scene, renderer, controls;
init();

function init() {
  // 1) camera + scene
  camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 20);
  camera.position.set(0,1.5,4);
  scene = new THREE.Scene();

  // 2) lights + env map (optional)
  scene.add(new THREE.AmbientLight(0x888888, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(5,10,5);
  scene.add(dir);

  // if you have a Bridge2 folder under textures/ for an env map:
  const cubeLoader = new THREE.CubeTextureLoader().setPath('textures/Bridge2/');
  const env = cubeLoader.load([
    'posx.jpg','negx.jpg',
    'posy.jpg','negy.jpg',
    'posz.jpg','negz.jpg'
  ]);
  scene.environment = scene.background = env;

  // 3) renderer + controls
  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 4) load models
  loadModel('bunny');
  loadModel('sphere');

  // 5) resize handler + start loop
  window.addEventListener('resize', onResize);
  animate();
}

function loadModel(name) {
  const mtlLoader = new MTLLoader().setPath('models/');
  mtlLoader.load(
    `${name}_texture.mtl`,            // for bunny: bunny_texture.mtl
    (materials) => {
      materials.preload();
      const objLoader = new OBJLoader().setMaterials(materials).setPath('models/');
      objLoader.load(
        `${name}.obj`,
        (obj) => {
          // center + scale down if you like:
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3()).length();
          const scale = 1.0/size;
          obj.scale.set(scale,scale,scale);
          box.getCenter(obj.position).multiplyScalar(-scale);
          scene.add(obj);
        }
      );
    },
    undefined,
    (err)=>console.error('MTL load error:', err)
  );
}

function onResize(){
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
