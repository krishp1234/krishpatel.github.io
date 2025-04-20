import * as THREE                  from 'three';
import { OrbitControls }           from 'three/addons/controls/OrbitControls.js';
import { ShadowMapViewer }         from 'three/addons/utils/ShadowMapViewer.js';
import { OBJLoader }               from 'three/addons/loaders/OBJLoader.js';

const viewDepthMap = true;

let camera, scene, renderer, clock;
let dirLight, spotLight;
let dirLightShadowMapViewer, spotLightShadowMapViewer;

init();
animate();

function init() {
  // build scene + lights + models
  initScene();
  initShadowMapViewers();
  initRendererAndControls();

  // append the GL canvas into our <div id="shadow-container">
  const container = document.getElementById('shadow-container');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function initScene() {
  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 15, 35);

  // scene
  scene = new THREE.Scene();

  // ambient
  scene.add(new THREE.AmbientLight(0x404040, 3));

  // spotLight
  spotLight = new THREE.SpotLight(0xffffff, 500);
  spotLight.name = 'Spot Light';
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.3;
  spotLight.position.set(10, 15, 5);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 8;
  spotLight.shadow.camera.far = 30;
  spotLight.shadow.mapSize.set(1024, 1024);
  scene.add(spotLight);
  scene.add(new THREE.CameraHelper(spotLight.shadow.camera));

  // dirLight
  dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.name = 'Dir. Light';
  dirLight.position.set(0, 10, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;
  dirLight.shadow.camera.left = -15;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.top = 15;
  dirLight.shadow.camera.bottom = -15;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);
  scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

  // red phong material for cubes & bunny
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 150,
    specular: 0x222222
  });

  // grid of cubes (optional)
  const group = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  for (let x = -3; x <= 3; x++) {
    for (let y = -3; y <= 3; y++) {
      for (let z = -3; z <= 3; z++) {
        const cube = new THREE.Mesh(boxGeo, cubeMaterial);
        cube.position.set(x, y, z);
        cube.castShadow = cube.receiveShadow = true;
        group.add(cube);
      }
    }
  }
  group.position.y = 5;
  // scene.add(group); // comment/uncomment to toggle

  // load bunny.obj
  const loader = new OBJLoader();
  loader.load(
    'models/bunny.obj',
    (obj) => {
      obj.traverse((c) => {
        if (c.isMesh) {
          c.material = cubeMaterial;
          c.castShadow = c.receiveShadow = true;
        }
      });
      // center + scale
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 4 / size;
      obj.scale.setScalar(scale);
      box.getCenter(obj.position).multiplyScalar(-scale).add(new THREE.Vector3(0,10,0));
      scene.add(obj);
    },
    undefined,
    console.error
  );

  // ground plane
  const groundMat = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    shininess: 150,
    specular: 0x111111
  });
  const ground = new THREE.Mesh(new THREE.BoxGeometry(10, 0.15, 10), groundMat);
  ground.scale.multiplyScalar(3);
  ground.receiveShadow = true;
  scene.add(ground);
}

function initShadowMapViewers() {
  dirLightShadowMapViewer  = new ShadowMapViewer(dirLight);
  spotLightShadowMapViewer = new ShadowMapViewer(spotLight);
  onWindowResize(); // size + position them
}

function initRendererAndControls() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.BasicShadowMap;

  clock = new THREE.Clock();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0,2,0);
  controls.update();
}

function onWindowResize() {
  const w = window.innerWidth, h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);

  // resize shadow viewers to 15% of width
  const size = w * 0.15;
  dirLightShadowMapViewer.position.set(10, 10);
  dirLightShadowMapViewer.size.set(size, size);
  dirLightShadowMapViewer.update();

  spotLightShadowMapViewer.position.set(size + 20, 10);
  spotLightShadowMapViewer.size.set(size, size);
  spotLightShadowMapViewer.update();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  renderer.render(scene, camera);

  if (viewDepthMap) {
    dirLightShadowMapViewer.render(renderer);
    spotLightShadowMapViewer.render(renderer);
  }
}
