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
loader.load("./models/Rocket/rocket_scene_2.glb", (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);

  let children = [...gltf.scene.children];
  for (const child of children) {
    scene.add(child);
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
  updateAllMaterials();
});

/**
 * Cube Text loader
 */
let cubeTextLoader = new THREE.CubeTextureLoader();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);

directionalLight.castShadow = true;
directionalLight.position.set(0.25, 20, -10);

directionalLight.shadow.camera.far = 40;
directionalLight.shadow.camera.left = -13;
directionalLight.shadow.camera.right = 13;
directionalLight.shadow.camera.top = 13;
directionalLight.shadow.camera.bottom = -13;

// const directionalLightCamera = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCamera);

scene.add(directionalLight);

/**
 * Enviroment maps
 */
const debugObject = {};

const mapId = 0;
const enviromentMap = cubeTextLoader.load([
  "./environmentMaps/" + mapId + "/px.jpg",
  "./environmentMaps/" + mapId + "/nx.jpg",
  "./environmentMaps/" + mapId + "/py.jpg",
  "./environmentMaps/" + mapId + "/ny.jpg",
  "./environmentMaps/" + mapId + "/pz.jpg",
  "./environmentMaps/" + mapId + "/nz.jpg",
]);

enviromentMap.encoding = THREE.sRGBEncoding;
// const backColor = new THREE.Color(0.05, 0.05, 0.05);
// scene.background = backColor;
scene.environment = enviromentMap;

function updateAllMaterials() {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = debugObject.envMapInensity;
      child.material.needsUpdate = true;
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });
}

debugObject.envMapInensity = 2.4;

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
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.96;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * GUI Tweakes
 */

gui
  .add(directionalLight, "intensity")
  .min(0.1)
  .max(10)
  .step(0.1)
  .name("lightIntensity");

gui
  .add(ambientLight, "intensity")
  .min(0.1)
  .max(10)
  .step(0.1)
  .name("Ambient Intensity");

gui
  .add(directionalLight.position, "x")
  .min(-50)
  .max(50)
  .step(0.1)
  .name("LightPosX");
gui
  .add(directionalLight.position, "y")
  .min(-50)
  .max(50)
  .step(0.1)
  .name("LightPosY");
gui
  .add(directionalLight.position, "z")
  .min(-50)
  .max(5)
  .step(0.1)
  .name("LightPosZ");

gui
  .add(debugObject, "envMapInensity")
  .min(0)
  .max(10)
  .onChange(updateAllMaterials);

gui
  .add(renderer, "toneMapping", {
    NO: THREE.NoToneMapping,
    Cineon: THREE.CineonToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
  });

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.01);

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
