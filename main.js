 import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js';
 import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';

let scene, camera, renderer, controls;
let objects = [];
let currentIndex = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    addStars();
    addHeart();

    window.addEventListener('resize', onWindowResize, false);
    animate();
    autoNavigate();
}

async function fetchTexture(url) {
    return new Promise((resolve) => {
        new THREE.TextureLoader().load(url, resolve);
    });
}

async function addStars() {
    const stars = [
        { name: 'Earth', size: 50, texture: 'https://planetary-api.com/earth.jpg' },
        { name: 'Neptune', size: 60, texture: 'https://planetary-api.com/neptune.jpg' },
        { name: 'Uranus', size: 70, texture: 'https://planetary-api.com/uranus.jpg' },
        { name: 'Saturn', size: 90, texture: 'https://planetary-api.com/saturn.jpg' },
        { name: 'Jupiter', size: 110, texture: 'https://planetary-api.com/jupiter.jpg' },
        { name: 'Sirius A', size: 200, texture: 'https://stellar-api.com/sirius.jpg' },
        { name: 'Pollux', size: 300, texture: 'https://stellar-api.com/pollux.jpg' },
        { name: 'Betelgeuse', size: 400, texture: 'https://stellar-api.com/betelgeuse.jpg' },
        { name: 'VY Canis Majoris', size: 600, texture: 'https://stellar-api.com/vycanismajoris.jpg' }
    ];
    
    let positionX = -500;
    for (let star of stars) {
        const texture = await fetchTexture(star.texture);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(star.size, 32, 32), material);
        sphere.position.x = positionX;
        positionX += star.size * 2;
        scene.add(sphere);
        objects.push(sphere);
    }
}

function addHeart() {
    const geometry = new THREE.SphereGeometry(1000, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const heart = new THREE.Mesh(geometry, material);
    heart.position.x = objects[objects.length - 1].position.x + 2000;
    scene.add(heart);
    objects.push(heart);
}

function autoNavigate() {
    setInterval(() => {
        if (currentIndex < objects.length) {
            camera.position.x = objects[currentIndex].position.x;
            currentIndex++;
        }
    }, 3000);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
