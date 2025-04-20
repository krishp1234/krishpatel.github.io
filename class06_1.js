// bare imports matched by our importmap in HTML
import * as THREE            from 'three';
import { OrbitControls }     from 'three/addons/controls/OrbitControls.js';
import { ShadowMapViewer }   from 'three/addons/utils/ShadowMapViewer.js';
import { OBJLoader }         from 'three/addons/loaders/OBJLoader.js';

const viewDepthMap = true;

let camera, scene, renderer, clock;
let dirLight, spotLight;
let dirLightShadowMapViewer, spotLightShadowMapViewer;

init();
animate();

function init() {
  initScene();
  initShadowMapViewers();
  initMisc();

  document.body.appendChild(renderer.domElement);
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

  // spot light (with shadows)
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

  // directional light (with shadows)
  dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.name = 'Dir. Light';
  dirLight.position.set(0, 10, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.left  = -15;
  dirLight.shadow.camera.top   = 15;
  dirLight.shadow.camera.bottom= -15;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);
  scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

  // red shiny material for both cubes & bunny
  let material = new THREE.MeshPhongMaterial({
    color:     0xff0000,
    shininess: 150,
    specular:  0x222222
  });

  // grid of little cubes
  const group = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  for (let x = -3; x <= 3; x++)
    for (let y = -3; y <= 3; y++)
      for (let z = -3; z <= 3; z++) {
        const cube = new THREE.Mesh(boxGeo, material);
        cube.position.set(x, y, z);
        cube.castShadow = cube.receiveShadow = true;
        group.add(cube);
      }
  group.position.set(0, 5, 0);
  // (you can uncomment the next line if you want to see the cubes)
  // scene.add(group);

  // load the bunny OBJ
  const loader = new OBJLoader();
  loader.load(
    'models/bunny.obj',
    (obj) => {
      obj.traverse(child => {
        if (child.isMesh) {
          child.material       = material;
          child.castShadow     = true;
          child.receiveShadow  = true;
        }
      });
      // center & scale to height ≈4 units
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4.0 / maxDim;
      obj.scale.set(scale, scale, scale);

      const center = box.getCenter(new THREE.Vector3());
      obj.position.set(
        -center.x * scale,
         10 - center.y * scale,
        -center.z * scale
      );

      scene.add(obj);
      render(); // draw first frame
    },
    // onProgress
    (xhr) => {
      if (xhr.lengthComputable) {
        // console.log(`bunny ${(xhr.loaded/xhr.total*100).toFixed(1)}% loaded`);
      }
    },
    // onError
    () => {
      console.error('Failed to load bunny.obj');
    }
  );

  // ground plane
  const groundGeo = new THREE.BoxGeometry(10, 0.15, 10);
  material = new THREE.MeshPhongMaterial({
    color:     0xa0adaf,
    shininess: 150,
    specular:  0x111111
  });
  const ground = new THREE.Mesh(groundGeo, material);
  ground.scale.multiplyScalar(3);
  ground.receiveShadow = true;
  scene.add(ground);
}

function initShadowMapViewers() {
  dirLightShadowMapViewer  = new ShadowMapViewer(dirLight);
  spotLightShadowMapViewer = new ShadowMapViewer(spotLight);
  resizeShadowMapViewers();
}

function initMisc() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.BasicShadowMap;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  clock = new THREE.Clock();
}

function resizeShadowMapViewers() {
  const size = window.innerWidth * 0.15;
  dirLightShadowMapViewer.position.set(10, 10);
  dirLightShadowMapViewer.size.set(size, size);
  dirLightShadowMapViewer.update();

  spotLightShadowMapViewer.position.set(size + 20, 10);
  spotLightShadowMapViewer.size.set(size, size);
  spotLightShadowMapViewer.update();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeShadowMapViewers();
  dirLightShadowMapViewer.updateForWindowResize();
  spotLightShadowMapViewer.updateForWindowResize();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function renderScene() {
  renderer.render(scene, camera);
}

function renderShadowMapViewers() {
  dirLightShadowMapViewer.render(renderer);
  spotLightShadowMapViewer.render(renderer);
}

function render() {
  const delta = clock.getDelta();
  renderScene();
  if (viewDepthMap) renderShadowMapViewers();
}
