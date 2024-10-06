const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25; // an easing factor to control the damping
controls.screenSpacePanning = false; // prevents panning up and down

const starGeometry = new THREE.SphereGeometry(1, 32, 32);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const star = new THREE.Mesh(starGeometry, starMaterial);
scene.add(star);

const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.set(5, 5, 15);
camera.lookAt(2, -3, 0);

const exoplanets = [];

function createExoplanet(distance, size, color, speed) {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const orbit = new THREE.CircleGeometry(distance, 64);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const orbitMesh = new THREE.LineLoop(orbit, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 2;

    scene.add(orbitMesh);
    planet.position.x = distance;  
    planet.position.z = 0; 
    scene.add(planet);

    exoplanets.push({ planet: planet, orbit: orbitMesh, speed: speed, angle: 0, distance: distance });
}

function loadDefaultSystem() {
    exoplanets.forEach(exoplanet => {
        scene.remove(exoplanet.planet);
        scene.remove(exoplanet.orbit);
    });
    exoplanets.length = 0;

    const solarSystemPlanets = [
        { name: 'Mercury', distance: 3.2, size: 0.2, color: 0xaaaaaa, speed: 0.02 },  
        { name: 'Venus', distance: 4.5, size: 0.5, color: 0xffcc99, speed: 0.018 }, 
        { name: 'Earth', distance: 5, size: 0.6, color: 0x0000ff, speed: 0.017 },  
        { name: 'Mars', distance: 6.7, size: 0.4, color: 0xffcc00, speed: 0.015 }, 
        { name: 'Jupiter', distance: 9.5, size: 1.4, color: 0xff9900, speed: 0.013 }, 
        { name: 'Saturn', distance: 11.5, size: 1.2, color: 0xffcc66, speed: 0.011 }, 
        { name: 'Uranus', distance: 14.5, size: 0.9, color: 0x66ccff, speed: 0.009 }, 
        { name: 'Neptune', distance: 17.5, size: 0.8, color: 0x0000cc, speed: 0.008 }  
    ];

    solarSystemPlanets.forEach(planet => {
        createExoplanet(planet.distance, planet.size, planet.color, planet.speed);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    exoplanets.forEach(exoplanet => {
        exoplanet.angle += exoplanet.speed; 
        exoplanet.planet.position.x = Math.cos(exoplanet.angle) * exoplanet.distance; 
        exoplanet.planet.position.z = Math.sin(exoplanet.angle) * exoplanet.distance; 
    });

    controls.update(); // Update the controls for smooth movement
    renderer.render(scene, camera);
}

loadDefaultSystem();
animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function plotSolarSystemFromData(data) {
    exoplanets.forEach(exoplanet => {
        scene.remove(exoplanet.planet);
        scene.remove(exoplanet.orbit);
    });
    exoplanets.length = 0; 

    data.forEach(planet => {
        const distance = planet.pl_orbsmax * 10; 
        const size = planet.pl_rade / 10; 
        const color = Math.random() * 0xffffff; 
        const speed = Math.random() * 0.01 + 0.005; 

        createExoplanet(distance, size, color, speed);
    });
}
