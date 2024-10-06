const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; 

const starGeometry = new THREE.SphereGeometry(1, 32, 32);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const star = new THREE.Mesh(starGeometry, starMaterial);
scene.add(star);
const starPosition = new THREE.Vector3(0, 0, 0);

const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.set(5, 5, 15);
camera.lookAt(starPosition);

const exoplanets = [];

function resetCamera() {
    camera.position.set(5, 5, 15);
    controls.target.copy(starPosition); 
    controls.update(); 
}

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

    resetCamera();
}

function animate() {
    requestAnimationFrame(animate);
    
    exoplanets.forEach(exoplanet => {
        exoplanet.angle += exoplanet.speed; 
        exoplanet.planet.position.x = Math.cos(exoplanet.angle) * exoplanet.distance; 
        exoplanet.planet.position.z = Math.sin(exoplanet.angle) * exoplanet.distance; 
    });

    controls.update(); 
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

function getColorFromTemperature(temperature) {

    if (temperature === "data not found" || temperature === null) {
        return 0xFFFFFF; 
    }

    const tempK = parseFloat(temperature);

    if (tempK < 415) return 0x00FFFF; 
    if (tempK < 2500) return 0x8B0000; 
    if (tempK < 3500) return 0xFF4500; 
    if (tempK < 5000) return 0x800080; 
    if (tempK < 6500) return 0x00FF00; 
    if (tempK < 8000) return 0x00BFFF; 
    if (tempK < 10000) return 0x1E90FF; 
    if (tempK <= 57000) return 0x0000FF; 
    return 0xFFFFFF; 
}



data.forEach(planet => {
    const temperature = planet.StellarEffectiveTemperature; 
    const color = getColorFromTemperature(temperature); 
    const distance = planet.pl_orbsmax * 10; 
    const size = planet.pl_rade / 10; 
    const speed = Math.random() * 0.01 + 0.005; 

    createExoplanet(distance, size, color, speed);
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
        const temperature = planet.st_teff;
        const color = getColorFromTemperature(temperature);
        const speed = Math.random() * 0.01 + 0.005; 
        createExoplanet(distance, size, color, speed);
    });

    resetCamera();
}

