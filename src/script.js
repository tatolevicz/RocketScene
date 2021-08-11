import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Animation
 */

let mixer;
let mixerCam;

/**
 * GLTFLoader
 */

const loader = new GLTFLoader();
loader.load(
  //   "/models/Duck/gltf/Duck.gltf",
  "/models/Rocket/rocket_scene.glb",
  (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);

    let children = [...gltf.scene.children];
    for (const child of children) {
      scene.add(child);
      console.log(child.name);
      if (child.name == "Rocket") {
        console.log("Animation setup!");
        mixer = new THREE.AnimationMixer(child);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      if (child.name == "Empty") {
        child.add(camera);
        console.log("Animation setup Cam!");
        mixerCam = new THREE.AnimationMixer(child);
        const action = mixerCam.clipAction(gltf.animations[1]);
        action.play();
      }
    }
  }
  //   () => {
  //     console.log("progress");
  //   },
  //   () => {
  //     console.log("error");
  //   }
);

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial({
//     color: "#444444",
//     metalness: 0,
//     roughness: 0.5,
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
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
var camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);

// var camera = new THREE.OrthographicCamera(5, 5, 10, 10, 1, 100);
// camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  //Animations
  if (mixer) mixer.update(deltaTime);

  if (mixerCam) mixerCam.update(deltaTime);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();