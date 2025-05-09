import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

//testing
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/9.png');

// Particles
//Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 50000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //like that you can see the edges of the particle image and they also
  //  hide the items behind from map convert to alphamap and set transparent to true
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.001
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
// particlesMaterial.color = new THREE.Color('#ff88cc');
//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate particles
  // particles.rotation.y = elapsedTime * 0.1;
  // particles.rotation.x = elapsedTime * 0.1;
  // particles.rotation.z = elapsedTime * 0.1;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
