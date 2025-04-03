<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Three.js Stick Figure - Workshop 3</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script>
<script>
// Setup
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Materials
const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const blueMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Geometry
const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), greenMat);
head.position.y = 1.5;

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), redMat);
body.position.y = 0;

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), blueMat);
leftArm.position.set(-0.8, 0.5, 0);
leftArm.rotation.z = Math.PI / 4;

const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), blueMat);
rightArm.position.set(0.8, 0.5, 0);
rightArm.rotation.z = -Math.PI / 4;

const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), blueMat);
leftLeg.position.set(-0.3, -1.5, 0);
leftLeg.rotation.z = Math.PI / 16;

const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), blueMat);
rightLeg.position.set(0.3, -1.5, 0);
rightLeg.rotation.z = -Math.PI / 16;

// Group
const figureGroup = new THREE.Group();
figureGroup.add(head);
figureGroup.add(body);
figureGroup.add(leftArm);
figureGroup.add(rightArm);
figureGroup.add(leftLeg);
figureGroup.add(rightLeg);
scene.add(figureGroup);

// Animate
function animate() {
  requestAnimationFrame(animate);
  figureGroup.rotation.y += 0.01;
  figureGroup.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animate();
</script>
</body>
</html>

