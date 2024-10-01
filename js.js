
     // Liste des planètes et de leurs descriptions
     const planets = [
        { name: 'Mercure', description: 'Mercure est la planète la plus proche du Soleil.' },
        { name: 'Vénus', description: 'Vénus est souvent appelée la planète sœur de la Terre.' },
        { name: 'Terre', description: 'La Terre est la troisième planète du Système solaire et abrite la vie.' },
        { name: 'Mars', description: 'Mars est la quatrième planète et est connue pour son sol rouge.' },
        { name: 'Jupiter', description: 'Jupiter est la plus grande planète du Système solaire.' },
        { name: 'Saturne', description: 'Saturne est célèbre pour ses anneaux impressionnants.' },
        { name: 'Uranus', description: 'Uranus a une rotation unique, elle roule sur le côté.' },
        { name: 'Neptune', description: 'Neptune est la huitième planète, connue pour ses vents violents.' }
 ];

let currentPlanetIndex = 0;
  


let isPlaying = false; // État de la vue cinématique
// Variables de contrôle de mouvement
const speed = 0.01; // Vitesse de rotation
const radius = 30; // Rayon de la caméra autour du point cible
let angleX = 0; // Angle de rotation autour de l'axe Y
let angleY = 0; // Angle de rotation autour de l'axe X
let isDragging = false; // État de glissement

function toggleCinematicView() {
isPlaying = !isPlaying; // Inverser l'état
const playPath = document.getElementById('playPath');
const pausePath = document.getElementById('pausePath');

// Alterner entre play et pause
if (isPlaying) {
    playPath.style.display = 'none'; // Cacher l'icône play
    pausePath.style.display = 'block'; // Afficher l'icône pause
} else {
    playPath.style.display = 'block'; // Afficher l'icône play
    pausePath.style.display = 'none'; // Cacher l'icône pause
}

// Ici, tu peux ajouter le code pour démarrer ou arrêter la vue cinématique
console.log(isPlaying ? "Démarrer la vue cinématique" : "Arrêter la vue cinématique");
}

  
  let cinematicMode = false;
  let asteroidBelt = [];
  let labelsVisible = true; // État initial des étiquettes
  
  // Initialisation de la scène, de la caméra et du rendu
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 30); // Positionner la caméra
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Point cible autour duquel faire le tour
  const target = new THREE.Vector3(0, 0, 0);



  const labelsContainer = document.getElementById('labels');
  const toggleLabelsButton = document.getElementById('toggleLabels');
  


  // Charger les textures 
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('texture/earth_texture_map_1000px.jpg');
  const sunTexture = textureLoader.load('texture/8k_sun.jpg');
  const marsTexture = textureLoader.load('texture/8k_mars.jpg');
  const mercuryTexture = textureLoader.load('texture/8k_mercury.jpg');
  const venusTexture = textureLoader.load('texture/4k_venus_atmosphere.jpg');
  const jupiterTexture = textureLoader.load('texture/8k_jupiter.jpg');
  const uranusTexture = textureLoader.load('texture/2k_uranus.jpg');
  const neptuneTexture = textureLoader.load('texture/2k_neptune.jpg');
  const saturnTexture = textureLoader.load('texture/8k_saturn.jpg');
  const moonTexture = textureLoader.load('texture/8k_moon.jpg');
  const ringTexture = textureLoader.load('texture/8k_saturn_ring_alpha.png');
  const asteroidTexture = textureLoader.load('texture/asteroid.jpg');
  const galaxyTexture = textureLoader.load('texture/8k_stars_milky_way.jpg');
  const nightTexture = textureLoader.load('texture/8k_earth_nightmap.jpg');


  // Récupération du bouton dans le DOM
  const cinematicButton = document.getElementById('cinematicView');

  // Ajout de l'événement de clic pour activer/désactiver la vue cinématique
  cinematicButton.addEventListener('click', () => { cinematicMode = !cinematicMode;  // Basculer l'état du mode cinématique
    });

  


  // Lumière pour simuler le Soleil
  const pointLight = new THREE.PointLight(0xffffff, 2, 100);
  pointLight.position.set(0, 0, 0); // Le Soleil sera aussi la source de lumière
  scene.add(pointLight);

  // Lumière ambiante
  const ambientLight = new THREE.AmbientLight(0x404040); // Lumière douce
  scene.add(ambientLight);

  // Matériaux pour les planètes
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffff00,  // Émissivité pour ajouter un effet lumineux
    emissiveIntensity: 1.5 // Intensité de la brillance
  });
  const mercuryMaterial = new THREE.MeshPhongMaterial({ map:mercuryTexture});
  const venusMaterial = new THREE.MeshPhongMaterial({ map:venusTexture });
  const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
  const marsMaterial = new THREE.MeshPhongMaterial({ map:marsTexture});
  const jupiterMaterial = new THREE.MeshPhongMaterial({ map:jupiterTexture });
  const saturnMaterial = new THREE.MeshPhongMaterial({ map:saturnTexture});
  const uranusMaterial = new THREE.MeshPhongMaterial({ map:uranusTexture });
  const neptuneMaterial = new THREE.MeshPhongMaterial({ map:neptuneTexture });
  const moonMaterial = new THREE.MeshPhongMaterial({ map:moonTexture}); // Matériau pour les lunes
  const asteroidMaterial = new THREE.MeshPhongMaterial({map:asteroidTexture});
  
  // Création des géométries
  const sunGeometry = new THREE.SphereGeometry(3, 32, 32); // Soleil
  const mercuryGeometry = new THREE.SphereGeometry(0.2, 32, 32); // Mercure
  const venusGeometry = new THREE.SphereGeometry(0.4, 32, 32); // Vénus
  const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Terre
  const marsGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Mars
  const jupiterGeometry = new THREE.SphereGeometry(1.2, 32, 32); // Jupiter
  const saturnGeometry = new THREE.SphereGeometry(1.1, 32, 32); // Saturne
  const uranusGeometry = new THREE.SphereGeometry(0.8, 32, 32); // Uranus
  const neptuneGeometry = new THREE.SphereGeometry(0.7, 32, 32); // Neptune
  const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Lune
  // Création d'une grande sphère pour représenter l'arrière-plan
  const galaxyGeometry = new THREE.SphereGeometry(300, 64, 64); // Taille large pour entourer la scène
  const galaxyMaterial = new THREE.MeshBasicMaterial({
    map: galaxyTexture,
    side: THREE.BackSide // Afficher l'intérieur de la sphère
  });

  // Créer une étiquette pour les planètes
  const earthLabel = document.createElement('div');
  earthLabel.className = 'label';
  earthLabel.textContent = 'Terre';
  labelsContainer.appendChild(earthLabel);

  const marsLabel = document.createElement('div');
  marsLabel.className = 'label';
  marsLabel.textContent = 'Mars';
  labelsContainer.appendChild(marsLabel);

  const neptuneLabel = document.createElement('div');
  neptuneLabel.className = 'label';
  neptuneLabel.textContent = 'Neptune';
  labelsContainer.appendChild(neptuneLabel);

  const jupiterLabel = document.createElement('div');
  jupiterLabel.className = 'label';
  jupiterLabel.textContent = 'Jupiter';
  labelsContainer.appendChild(jupiterLabel);

  const uranusLabel = document.createElement('div');
  uranusLabel.className = 'label';
  uranusLabel.textContent = 'Uranus';
  labelsContainer.appendChild(uranusLabel);

  const venusLabel = document.createElement('div');
  venusLabel.className = 'label';
  venusLabel.textContent = 'Venus';
  labelsContainer.appendChild(venusLabel);

  const mercureLabel = document.createElement('div');
  mercureLabel.className = 'label';
  mercureLabel.textContent = 'Mercure';
  labelsContainer.appendChild(mercureLabel);

  const saturnLabel = document.createElement('div');
  saturnLabel.className = 'label';
  saturnLabel.textContent = 'Saturn';
  labelsContainer.appendChild(saturnLabel);

  // Création des maillages (Mesh)
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  mercury.position.x = 3.5;
  mercury.name = "Mercure";
  scene.add(mercury);

  const venus = new THREE.Mesh(venusGeometry, venusMaterial);
  venus.position.x = 5;
  venus.name = "Vénus";
  scene.add(venus);

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.x = 6.5;
  earth.name = "Terre";
  scene.add(earth);

  const mars = new THREE.Mesh(marsGeometry, marsMaterial);
  mars.position.x = 8;
  mars.name = "Mars";
  scene.add(mars);

  const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
  jupiter.position.x = 11;
  jupiter.name = "Jupiter";
  scene.add(jupiter);

  const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturn.position.x = 14;
  saturn.name = "Saturne";
  scene.add(saturn);

  const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
  uranus.position.x = 17;
  uranus.name = "Uranus";
  scene.add(uranus);

  const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
  neptune.position.x = 20;
  neptune.name = "Neptune";
  scene.add(neptune);

  // Création de la sphère avec la texture de la Voie lactée
  const galaxyBackground = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
  scene.add(galaxyBackground);
  
  // Ajout des anneaux pour Saturne
  const ringGeometry = new THREE.RingGeometry(1.3, 2, 64); // Augmenter la résolution
  // Matériau des anneaux avec double face activé
  const ringMaterial = new THREE.MeshPhongMaterial({
    map: ringTexture,
    side: THREE.DoubleSide, // Important pour rendre les deux faces du ring visibles
    transparent: true       // Si vous avez une texture avec transparence
  });
  const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
  saturnRings.rotation.x = Math.PI / 2; // Inclinaison des anneaux
  // Positionner les anneaux au même endroit que Saturne
  saturn.add(saturnRings); // Ajout des anneaux à la scène

  // Création des Lunes
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  scene.add(moon);

  const jupiterMoons = [];
  for (let i = 0; i < 4; i++) {
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(jupiter.position.x + 1.5 + i * 0.3, 0, 0);
    scene.add(moon);
    jupiterMoons.push(moon);
  }

  const saturnMoons = [];
  for (let i = 0; i < 5; i++) {
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(saturn.position.x + 1.8 + i * 0.4, 0, 0);
    scene.add(moon);
    saturnMoons.push(moon);
  }

  const uranusMoons = [];
  for (let i = 0; i < 3; i++) {
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(uranus.position.x + 1.2 + i * 0.3, 0, 0);
    scene.add(moon);
    uranusMoons.push(moon);
  }

  const neptuneMoons = [];
  for (let i = 0; i < 2; i++) {
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(neptune.position.x + 1.1 + i * 0.2, 0, 0);
    scene.add(moon);
    neptuneMoons.push(moon);
  }

  // Variables pour le raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
const planetInfoDiv = document.getElementById('planet-info');
const planetName = document.getElementById('planet-name');
const planetDescription = document.getElementById('planet-description');


  
  
function createAsteroidBelt() {
const asteroidGeometry = new THREE.DodecahedronGeometry(0.1, 1); // Taille des astéroïdes
const asteroidCount = 600; // Nombre d'astéroïdes
for (let i = 0; i < asteroidCount; i++) {
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  // Positionnement aléatoire dans une région annulaire
  const distance = THREE.MathUtils.randFloat(9, 11); // Distance entre Mars et Jupiter
  const angle = THREE.MathUtils.randFloat(0, Math.PI * 2); // Angle aléatoire

  asteroid.position.x = distance * Math.cos(angle);
  asteroid.position.z = distance * Math.sin(angle);
  asteroid.position.y = THREE.MathUtils.randFloat(-0.5, 0.5); // Légère dispersion sur l'axe Y

  asteroid.userData = { distance: distance, angle: angle, speed: THREE.MathUtils.randFloat(0.0005, 0.0015) }; // Stockage des informations pour l'animation

  scene.add(asteroid);
  asteroidBelt.push(asteroid);
}


}

function showPlanetInfo() {
        // Afficher la boîte d'information avec la première planète
        updatePlanetInfo(currentPlanetIndex);
        document.getElementById('planet-info').style.display = 'block';
    }

    function hidePlanetInfo() {
        // Masquer la boîte d'information
        document.getElementById('planet-info').style.display = 'none';
    }

    function updatePlanetInfo(index) {
        document.getElementById('planet-name').textContent = planets[index].name;
        document.getElementById('planet-description').textContent = planets[index].description;
    }

    function nextPlanet() {
        // Passer à la planète suivante
        currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
        updatePlanetInfo(currentPlanetIndex);
    }

    function previousPlanet() {
        // Revenir à la planète précédente
        currentPlanetIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
        updatePlanetInfo(currentPlanetIndex);
    }

// Fonction pour mettre à jour la position de la caméra
function updateCameraPosition() {
    const radiusY = radius * Math.cos(angleY);
    camera.position.x = target.x + radiusY * Math.cos(angleX);
    camera.position.z = target.z + radiusY * Math.sin(angleX);
    camera.position.y = radius * Math.sin(angleY); // Hauteur dynamique
    camera.lookAt(target); // La caméra regarde le point cible
}

  // Gestionnaire d'événements pour le clic de souris
  document.addEventListener('mousedown', (event) => {
      isDragging = true; // Activer le mode de glissement
  });

  document.addEventListener('mouseup', () => {
    isDragging = false; // Désactiver le mode de glissement
 });

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        // Calculer la position de la souris normalisée
        const movementX = event.movementX; // Déplacement horizontal
        const movementY = event.movementY; // Déplacement vertical

        // Modifier les angles en fonction du mouvement de la souris
        angleX += movementX * speed;
        angleY -= movementY * speed; // Inverser le mouvement vertical

        // Limiter l'angle Y pour éviter que la caméra ne fasse un loop complet
        angleY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angleY));
    }

    updateCameraPosition(); // Met à jour la position de la caméra
});




// Ajout de cette fonction pour créer les trajectoires des planètes
function createOrbits() {
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });

const planets = [
  { mesh: mercury, radius: 3.5 },
  { mesh: venus, radius: 5 },
  { mesh: earth, radius: 6.5 },
  { mesh: mars, radius: 8 },
  { mesh: jupiter, radius: 11 },
  { mesh: saturn, radius: 14 },
  { mesh: uranus, radius: 17 },
  { mesh: neptune, radius: 20 },
];

planets.forEach(planet => {
  const points = [];
  const segments = 100; // Nombre de segments pour la ligne de la trajectoire
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2; // Angle de 0 à 2*PI
    const x = planet.radius * Math.cos(angle);
    const z = planet.radius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z)); // Y = 0 pour les orbites
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbitLine); // Ajouter la ligne d'orbite à la scène
});
}
// Ajout des étoiles dans l'espace
function createStars() {
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05, // Taille des étoiles
});

const starCount = 10000; // Nombre d'étoiles
const starVertices = [];

for (let i = 0; i < starCount; i++) {
  const x = THREE.MathUtils.randFloatSpread(500); // Positionnement aléatoire dans l'espace
  const y = THREE.MathUtils.randFloatSpread(500);
  const z = THREE.MathUtils.randFloatSpread(500);

  starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
}


// Fonction pour déplacer doucement les étoiles
function moveStars() {
const positions = stars.geometry.attributes.position.array;

for (let i = 0; i < positions.length; i += 3) {
    positions[i] += 0.01; // Déplacer légèrement sur l'axe X
    positions[i + 1] += 0.01 * Math.sin(Date.now() * 0.5); // Oscillation légère sur l'axe Y
    positions[i + 2] += 0.01 * Math.cos(Date.now() * 0.5); // Oscillation légère sur l'axe Z
}

stars.geometry.attributes.position.needsUpdate = true; // Indiquer que les positions ont changé
}

// Mettre à jour la position des astéroïdes dans l'animation
function animateAsteroidBelt() {
asteroidBelt.forEach((asteroid) => {
  asteroid.userData.angle += asteroid.userData.speed; // Mise à jour de l'angle de chaque astéroïde

  // Calcul des nouvelles positions en fonction de l'angle
  asteroid.position.x = asteroid.userData.distance * Math.cos(asteroid.userData.angle);
  asteroid.position.z = asteroid.userData.distance * Math.sin(asteroid.userData.angle);
});
}


// Fonction pour créer une atmosphere à toutes les planètes
function createHalo(planet, color, size, opacity = 0.3) {
const halo2Geometry = new THREE.SphereGeometry(size, 32, 32);
const halo2Material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide
});

const halo2 = new THREE.Mesh(halo2Geometry, halo2Material);
scene.add(halo2);
planet.add(halo2); // Positionner le halo au même endroit que la planète


return halo2;
}

//ajouter l'atmosphere sur les planètes
createHalo(sun, 0xffff66,3.2);
createHalo(mars, 0xff4444,0.33);
createHalo(earth, 0x00aaff,0.55);
createHalo(mercury, 0xaaaaaa,0.25);
createHalo(venus, 0xffa500,0.45);
createHalo(jupiter, 0x8B4513,1.3);
createHalo(saturn, 0xFFD700,1.2);
createHalo(uranus, 0x00FFFF,0.9);
createHalo(neptune, 0x00008B,0.8);



// Événement de clic de la souris
window.addEventListener('click', (event) => {
 mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
 mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

 raycaster.setFromCamera(mouse, camera);
 const intersects = raycaster.intersectObjects(scene.children);

if (intersects.length > 0) {
  const planet = intersects[0].object;
  displayPlanetInfo(planet);
}
});

// Événement pour le bouton
toggleLabelsButton.addEventListener('click', () => {
  labelsVisible = !labelsVisible; // Bascule l'état
  labelsContainer.style.display = labelsVisible ? 'block' : 'none'; // Affiche ou masque les étiquettes
});


// Fonction pour zoomer et dézoomer avec la molette de la souris
function handleMouseWheel(event) {
event.preventDefault();

const zoomSpeed = 0.1; // Contrôle la vitesse de zoom
const delta = event.deltaY * zoomSpeed;

// Pour une caméra Perspective (changement du champ de vision)
camera.fov += delta;
camera.fov = Math.max(10, Math.min(camera.fov, 75)); // Limiter le zoom (champ de vision)
camera.updateProjectionMatrix(); // Mettre à jour la projection après le changement du FOV

}

window.addEventListener('wheel', handleMouseWheel);

  

// Fonction d'animation
function animate() {
requestAnimationFrame(animate);

if(cinematicMode){
  camera.position.x = 25 * Math.cos(Date.now() * 0.0002);
  camera.position.z = 10+5 * Math.sin(Date.now() * 0.0001);
  camera.position.y = 25 * Math.sin(Date.now() * 0.0002);
  camera.lookAt(sun.position); // S'assurer que la caméra regarde toujours vers le Soleil
}
// Rotation des planètes autour de leur propre axe
sun.rotation.y += -0.002;
mercury.rotation.y += -0.06;
venus.rotation.y += -0.05;
earth.rotation.y += -0.03;
mars.rotation.y += -0.02;
jupiter.rotation.y += -0.01;
saturn.rotation.y += -0.01;
uranus.rotation.y += -0.01;
neptune.rotation.y += -0.01;
galaxyBackground.rotation.y += 0.0001; // Ajustez la vitesse de rotation ici

// Animation des orbites des planètes autour du soleil
 mercury.position.x = 3.5 * Math.cos(Date.now() * 0.0008);
 mercury.position.z = 3.5 * Math.sin(Date.now() * 0.0008);

 venus.position.x = 5 * Math.cos(Date.now() * 0.0006);
 venus.position.z = 5 * Math.sin(Date.now() * 0.0006);

 earth.position.x = 6.5 * Math.cos(Date.now() * 0.0005);
 earth.position.z = 6.5 * Math.sin(Date.now() * 0.0005);

 mars.position.x = 8 * Math.cos(Date.now() * 0.0004);
 mars.position.z = 8 * Math.sin(Date.now() * 0.0004);

 jupiter.position.x = 11 * Math.cos(Date.now() * 0.0003);
 jupiter.position.z = 11 * Math.sin(Date.now() * 0.0003);

 saturn.position.x = 14 * Math.cos(Date.now() * 0.0002);
 saturn.position.z = 14 * Math.sin(Date.now() * 0.0002);

 uranus.position.x = 17 * Math.cos(Date.now() * 0.00015);
 uranus.position.z = 17 * Math.sin(Date.now() * 0.00015);

 neptune.position.x = 20 * Math.cos(Date.now() * 0.0001);
 neptune.position.z = 20 * Math.sin(Date.now() * 0.0001);

   // Animation des lunes de Jupiter
    jupiterMoons.forEach((moon, i) => {
      moon.position.x = jupiter.position.x + (1.5 + i * 0.3) * Math.cos(Date.now() * 0.0002 * (i + 1));
      moon.position.z = jupiter.position.z + (1.5 + i * 0.3) * Math.sin(Date.now() * 0.0002 * (i + 1));
    });

    // Animation des lunes de Saturne
    saturnMoons.forEach((moon, i) => {
      moon.position.x = saturn.position.x + (1.8 + i * 0.4) * Math.cos(Date.now() * 0.0002 * (i + 1));
      moon.position.z = saturn.position.z + (1.8 + i * 0.4) * Math.sin(Date.now() * 0.0002 * (i + 1));
    });

    // Animation des lunes d'Uranus
    uranusMoons.forEach((moon, i) => {
      moon.position.x = uranus.position.x + (1.2 + i * 0.3) * Math.cos(Date.now() * 0.0005 * (i + 1));
      moon.position.z = uranus.position.z + (1.2 + i * 0.3) * Math.sin(Date.now() * 0.0005 * (i + 1));
    });

    // Animation des lunes de Neptune
    neptuneMoons.forEach((moon, i) => {
      moon.position.x = neptune.position.x + (1.1 + i * 0.2) * Math.cos(Date.now() * 0.0002 * (i + 1));
      moon.position.z = neptune.position.z + (1.1 + i * 0.2) * Math.sin(Date.now() * 0.0002 * (i + 1));
    });

    // Animation de la Lune autour de la Terre
    moon.position.x = earth.position.x + 0.7 * Math.cos(Date.now() * 0.001);
    moon.position.z = earth.position.z + 0.7 * Math.sin(Date.now() * 0.001);
        // Positionner l'étiquette
if (labelsVisible) {
  const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
  const planetLabels = [mercureLabel, venusLabel, earthLabel, marsLabel, jupiterLabel, saturnLabel, uranusLabel, neptuneLabel];

    planets.forEach((planet, index) => {
          const planetScreenPosition = planet.position.clone();
          planetScreenPosition.project(camera); // Convertir la position 3D en 2D

          const xPlanet = (planetScreenPosition.x * .5 + .5) * window.innerWidth;
          const yPlanet = (planetScreenPosition.y * -.5 + .5) * window.innerHeight;

          planetLabels[index].style.left = `${xPlanet}px`;
          planetLabels[index].style.top = `${yPlanet}px`;
      });
}   


    animateAsteroidBelt();
    renderer.render(scene, camera);
     
}

  // Appel de la fonction pour créer la ceinture d'astéroïdes
  createAsteroidBelt();
  // Appel de la fonction pour créer les orbites
  createOrbits();
  
  // Appel de la fonction pour créer les étoiles
  createStars();
  animate();
  
