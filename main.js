import './style.css'
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import {Text} from 'troika-three-text'
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass"
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer"
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import gsap from 'gsap';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const rabbitURL = new URL('./assets/rabbit.glb  ', import.meta.url)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

let far = 4000;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, far);
camera.position.setX(0);
camera.position.setY(-15);
camera.position.setZ(300);

let myCanvas = document.querySelector('#bg');

const renderer = new THREE.WebGLRenderer({
  
  antialias: true,

  canvas: myCanvas // which DOM element to use
});

renderer.setSize( window.innerWidth, innerHeight ); // full screen canvas
renderer.setPixelRatio( window.devicePixelRatio );

// controls

const controls = new FirstPersonControls(camera, myCanvas);
controls.movementSpeed = 200;
controls.lookSpeed = 0.2;

controls.target = new THREE.Vector3(0, 0, -40);

// light

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Add neon effect

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.6,
  0.1,
  0.1
);

bloomPass.strength = 0.9;

composer.addPass(bloomPass);

// load 3D model and add to the scene

const assetLoader = new GLTFLoader();
assetLoader.load(rabbitURL.href, function(gltf) {
  let model = gltf.scene;
  let scale = 0.05;
  model.scale.x = scale;
  model.scale.y = scale;
  model.scale.z = scale;
  model.rotation.x = -90;

  const story = [
    {
      txt: "",
      x: 957,
      y: -150,
      z: -9500
    },
    {
      txt: "",
      x: 1300,
      y: -75,
      z: -11500
    },
    {
      txt: "",
      x: 1300,
      y: -75,
      z: -13500
    },
    {
      txt: "",
      x: 1300,
      y: -75,
      z: -15500
    },
    {
      txt: "Made by Guilherme Franco",
      x: 1000,
      y: -75,
      z: -17000
    },
    {
      txt: "",
      x: -1000,
      y: 0,
      z: -21000
    },
    {
      txt: "How deep the rabbit hole goes?",
      x: -2000,
      y: 0,
      z: -22000
    },
    {
      txt: "",
      x: -2000,
      y: 0,
      z: -25000
    },
    {
      txt: "",
      x: -2200,
      y: 76,
      z: -27500
    },
    {
      txt: "",
      x: -2400,
      y: 210,
      z: -29500
    },
    {
      txt: "",
      x: -2600,
      y: 250,
      z: -32500
    },
    {
      txt: "Free your mind.",
      x: -2700,
      y: 270,
      z: -35500
    },
  ];
  
  story.forEach(elem => {
    let rabbitClone = SkeletonUtils.clone(model);
    rabbitClone.position.x = elem.x;
    rabbitClone.position.y = elem.y;
    rabbitClone.position.z = elem.z;
    scene.add(rabbitClone);
    createText(elem.txt, elem.x - 300, elem.y, elem.z - 1000, 5);
  });
}, undefined, function ( error ) {
  console.log( 'An error happened' );
});

// create 2 capsules

const geometry = new THREE.CapsuleGeometry( 5, 18, 32, 41 );
const materialBlue = new THREE.MeshPhysicalMaterial( {color: 0x0081cc} );
const materialRed = new THREE.MeshStandardMaterial( {color: 0xcc0000} );
const capsuleBlue = new THREE.Mesh( geometry, materialBlue );
const capsuleRed = new THREE.Mesh( geometry, materialRed );
capsuleBlue.position.x = 15
capsuleRed.position.x = -15
capsuleBlue.position.y = -15
capsuleRed.position.y = -15
capsuleBlue.position.z = 100
capsuleRed.position.z = 100
capsuleBlue.name = "blue";
capsuleRed.name = "red";
scene.add( capsuleBlue );
scene.add( capsuleRed );

// create text (horizontal white text)

function createText(string, x, y, z, size) {
  const myText = new Text()
  scene.add(myText)
  myText.text = string
  myText.font = './fonts/courier.ttf'
  myText.fontSize = size;
  myText.color = 0xffffff;
  myText.position.x = x;
  myText.position.y = y;
  myText.position.z = z;

  return myText
}

function deleteText(text) {
  scene.remove(text);
  text.dispose();
}

// RainDrop (vertical green text)

function createRainDrop(renderBehind) {
  let zPos;
  if (renderBehind) {
    zPos = 400;
  }
  else {
    zPos = -300;
  }
  const myText = new Text()
  const textArray = new Text()
  scene.add(myText)
  
  // Set properties to configure:
  let r = (Math.random() + 1).toString(36).substring(7).charAt(0);

  myText.text = r
  myText.font = './fonts/matrix-code-nfi.ttf'
  myText.fontSize = 20 // Math.floor(Math.random() * 20);
  myText.position.z = zPos + camera.position.z + Math.ceil(Math.random() * 1000) * (Math.round(Math.random()) ? 1 : -1) // Math.floor(Math.random() * 100);
  myText.position.x = 100 + camera.position.x + Math.ceil(Math.random() * 500) * (Math.round(Math.random()) ? 1 : -1)
  myText.position.y = camera.position.y + Math.floor(Math.random() * 200)
  myText.color = 0x3bc264
  myText.letterSpacing = 10;
  myText.textAlign = 'center'
  
  return myText
}

/* This function is not working properly yet

function randomizeText(string) {
  let randomizedString = "";
  let randomIndex;
  for (var i = 0; i < string.length; i++) {
    let r = (Math.random() + 1).toString(36).substring(7).charAt(0);
    randomIndex = Math.floor(Math.random() * 20);
    if(randomIndex == 1) {
      randomizedString = randomizedString + "\n" + r;
    }
    else {
      randomizedString = randomizedString + "\n" + string.charAt(i);
    }
  }
  console.log(randomizedString)
  return randomizedString;
}

*/

function eraseRainDrop(rainDrop) {
  scene.remove(rainDrop);
  rainDrop.dispose();
}

// 2 different patterns for rotation

function rotateCapsulePattern1(capsule) {
  capsule.rotation.x = capsule.rotation.x + 0.01;
  capsule.rotation.y = capsule.rotation.y + 0.02;
  capsule.rotation.z = capsule.rotation.z + 0.01;
}

function rotateCapsulePattern2(capsule) {
  capsule.rotation.x = capsule.rotation.x + 0.02;
  capsule.rotation.y = capsule.rotation.y + 0.01;
  capsule.rotation.z = capsule.rotation.z + 0.01;
}

// gsap animation

const t1 = gsap.timeline({paused: true});
t1.to(camera.position, {
  x: 870,
  y: -150,
  z: -10000,
  duration: 15
});
const t2 = gsap.timeline({paused: true});
t2.to(camera.position, {
  x: 0,
  y: -15,
  z: 300,
  duration: 6
});
const t3 = gsap.timeline({paused: true});
t3.to(camera.position, {
  x: 15,
  y: -15,
  z: 300,
  duration: 3
});

// some global variables used in animate function

let raining = true;
let raindrop_falls_counter = 0
let new_raindrop_counter = 0
let textList = [];
let canControl = false;
let alreadyClickedOnce = false;
let renderBehind = false;
let textsForNeo = [];
let txt = new Text();
const clock = new THREE.Clock();

// raycaster

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(scene.children);
}

// Update the rendering:

function animate() {
  rotateCapsulePattern1(capsuleBlue)
  rotateCapsulePattern2(capsuleRed)

  let r = (Math.random() + 1).toString(36).substring(7).charAt(0);
  
  raindrop_falls_counter = raindrop_falls_counter + 1
  new_raindrop_counter = new_raindrop_counter + 1

  if (new_raindrop_counter == 1) {
    if (raining) {
      let textGenerated = createRainDrop(renderBehind);
      textList.push(textGenerated);
      new_raindrop_counter = 0;
    }
  }
  if (raindrop_falls_counter == 4) {
    textList.forEach(textOnScreen => {
      textOnScreen.text = textOnScreen.text + "\n" + r;
      if ((textOnScreen.text).length > 70) {
        var index = textList.indexOf(textOnScreen)
        textList.splice(index, 1);
        eraseRainDrop(textOnScreen);
      }
    });
    raindrop_falls_counter = 0;
  }

  // On mouse click
  
  window.addEventListener("mouseup", function() {
    console.log(intersects)
    if(intersects){
      // if clicked on blue pill
      if(intersects[0].object.name == "blue" && !canControl && capsuleBlue.visible){
        document.getElementById("info").innerHTML = ""
        renderBehind = false;
        capsuleBlue.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        capsuleRed.visible = false;
        t2.pause();
        if(alreadyClickedOnce) {
          raining= false;
          t3.play();
        }
        else{ // first time on blue pill
          txt = createText("Wake up, Neo...", 120, -45, -2747, 20);
          textsForNeo.push(txt);
          txt = null
          txt = createText("The Matrix has you...", 183, 0, -4747, 20);
          textsForNeo.push(txt);
          txt = null
          txt = createText("Follow the white rabbit.", 307, -100, -7347, 20);
          textsForNeo.push(txt);
          txt = null
          txt = createText("Knock, knock, Neo.", 757, -140, -10147, 20);
          textsForNeo.push(txt);
          txt = null
          t1.play();
        }
      }
      // if clicked on blue pill
      if(intersects[0].object.name == "red" && !renderBehind && capsuleRed.visible){
        capsuleRed.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        capsuleBlue.visible = false;
        canControl = true // allow control
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) { // for mobile devices
          document.getElementById("info").innerHTML = "Go to desktop for better experience"
          controls.movementSpeed = 700
        }
        else{ // for desktop devices
          document.getElementById("info").innerHTML = "Press SPACE BAR to run"
        }
      }
    }
  });

  // on red pill, allow control and don't start animation

  if (canControl == true) { 
    controls.update(clock.getDelta())
  }
  else { // on blue pill or no pill, proceed with the code below
    // end of animation
    if(camera.position.z == -10000) { 
      t1.pause();
      t2.play();
      alreadyClickedOnce = true;
      renderBehind = true;
      capsuleRed.visible = true;
      capsuleBlue.material = new THREE.MeshPhysicalMaterial( {color: 0x0081cc} );
    }
    // begin of animation
    if (camera.position.z == 300 && renderBehind) { // when back to pills
      textsForNeo.forEach(text => {
        deleteText(text)
      });
      textsForNeo = [];
      renderBehind = false; // stop rendering behind
    }
  }

  // Increase velocity when space bar is pressed

  document.addEventListener('keypress', (event) => {
    if (event.key == " ") {
      controls.movementSpeed = 600
    }
  });

  // Decrease velocity when space bar is pressed

  document.addEventListener('keyup', (event) => {
    if (event.key == " ") {
      controls.movementSpeed = 200
    }
  });

  // Tracking camera position

  // document.getElementById("info").innerHTML = "X: " + (camera.position.x).toFixed(3) + " Y: " + (camera.position.y).toFixed(3) + " Z: " + (camera.position.z).toFixed(3);
  
  composer.render();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', onMouseMove);

document.body.appendChild(renderer.domElement);
animate();