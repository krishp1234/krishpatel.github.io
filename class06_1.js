// … your imports …
import { OBJLoader }      from 'three/addons/loaders/OBJLoader.js';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';

// …

// when loading the cube‑map
const envMaploader = new THREE.CubeTextureLoader().setPath('textures/Bridge2/');
const environmentMap = envMaploader.load([
  'posx.jpg','negx.jpg',
  'posy.jpg','negy.jpg',
  'posz.jpg','negz.jpg'
]);

// …

// when loading your bunny OBJ
loader.load(
  'models/bunny.obj',
  …

// …
