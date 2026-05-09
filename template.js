import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


const canvas = document.getElementById("exhibit");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, sizes.width / sizes.height, 0.1, 1000 );


scene.background = new THREE.Color('rgb(0, 0, 0)');
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI/2;
controls.minPolarAngle = 0;
controls.minDistance = 2;
controls.maxDistance = 10;


camera.position.set(-0.3672030125771253, 4.412067600198818, 8.889476753090971);
controls.target.set(-0.4665037358931956, 0.5198986740054395, -0.32144939015451207);



camera.updateProjectionMatrix();
controls.update();
const loader = new GLTFLoader();

const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)',5);
scene.add(ambientLight);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

let model;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
loader.setDRACOLoader(dracoLoader);


loader.load('models/MODEL_NAME.glb', function(gltf){
  model = gltf.scene;
  scene.add(model);
  requestAnimationFrame(() => {
    console.log("model loaded");
    
  });
},
function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
  function (error) {
    console.error('Error loading model:', error);
  }
);
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  controls.update();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener("mousedown",(event)=>{
    console.log("camera.position.set("+camera.position.x+", "+camera.position.y+", "+camera.position.z+");");
    console.log("controls.target.set("+controls.target.x+", "+controls.target.y+", "+controls.target.z+");");

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (!model) return;
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj) {
            console.log("Object Name: " + obj.name);
            console.log("Camera Zoom: " + camera.zoom);
            if(obj.name = ""){
                
            }
            obj = obj.parent;
        }
      }
});


document.addEventListener('keydown', (event) => {

});
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();