
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const starGeometry = new THREE.SphereGeometry(1, 32, 32);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const star = new THREE.Mesh(starGeometry, starMaterial);
scene.add(star);

const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 0, 0);
scene.add(light);


camera.position.z = 15;


const exoplanets = [];
const orbitRadiusFactor = 2;

function createExoplanet(distance, size, color, speed) {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    const orbit = new THREE.Object3D();  
    orbit.add(planet);
    planet.position.x = distance;  
    scene.add(orbit);

    exoplanets.push({ planet: planet, orbit: orbit, speed: speed });
}


createExoplanet(4, 0.5, 0x44aa88, 0.01); 
createExoplanet(8, 0.7, 0x8844aa, 0.008);
createExoplanet(12, 1.0, 0xaa8844, 0.005);

function animate() {
    requestAnimationFrame(animate);
    
    exoplanets.forEach(exoplanet => {
        exoplanet.orbit.rotation.y += exoplanet.speed;  // Rotación de la órbita
    });

    renderer.render(scene, camera);
}

animate();

// Ajustar tamaño cuando se cambia la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
