// script.js

const canvas = document.getElementById('waterCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// Obtenez les éléments des menus et des flèches
const sideMenuLeft = document.getElementById('sideMenuLeft');
const sideMenuRight = document.getElementById('sideMenu');
const arrowRight = document.getElementById('arrowRight');
const arrowLeft = document.getElementById('arrowLeft');


// Afficher le menu lors du survol de la flèche droite
arrowRight.addEventListener('mouseover', () => {
    sideMenu.classList.add('show');
});


// Cacher le menu lorsque la souris quitte le menu
sideMenu.addEventListener('mouseleave', () => {
    sideMenu.classList.remove('show');
});


// Afficher le menu à gauche lors du survol de la flèche gauche
arrowLeft.addEventListener('mouseover', () => {
    sideMenuLeft.classList.add('show');
});

// Cacher le menu lorsque la souris quitte le menu
sideMenuLeft.addEventListener('mouseleave', () => {
    sideMenuLeft.classList.remove('show');
});

// Assurez-vous que le menu est caché lorsque la souris quitte l'écran (optionnel)
document.addEventListener('mousemove', (event) => {
    if (event.clientX < window.innerWidth - 250) {
        sideMenu.classList.remove('show');
    }
});

// Paramètres des vagues
let waveCount = 4;
let amplitude = 20;
let frequency = 0.01;
let speed = 0.02;



// Paramètres du cycle jour/nuit
const sunRadius = 50;
const moonRadius = 30;
const starCount = 100;
const dayLength = 20000; // Durée d'un cycle complet (jour + nuit) en millisecondes
const circleRadius = height / 2.5; // Rayon du cercle pour le soleil et la lune
let currentTime = 0;

let waves = Array.from({ length: waveCount }, (_, i) => ({
    phase: Math.random() * Math.PI * 2,
    frequency: frequency * (i + 1)
}));

const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * (height / 2.5), // Limiter les étoiles à la partie supérieure du ciel
    opacity: 0 // Les étoiles sont initialement invisibles
}));

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Fraction de temps dans le cycle (0 à 1)
    const timeFraction = currentTime / dayLength;
    const angle = timeFraction * 2 * Math.PI;  // Convertir la fraction de temps en un angle (0 à 2π)
    const sunX = width / 2 + circleRadius * Math.cos(angle);
    const sunY = height / 2 + circleRadius * Math.sin(angle);
    const moonX = width / 2 + circleRadius * Math.cos(angle + Math.PI);  // La lune est opposée au soleil sur le cercle
    const moonY = height / 2 + circleRadius * Math.sin(angle + Math.PI);

    // Calculer l'intensité de la lumière du jour
    const isDay = Math.cos(angle) > 0;
    const sunPositionFactor = Math.cos(angle); // Varie de -1 à 1
    let skyGradient;

    // Créer un dégradé de couleurs pour le ciel
    if (sunPositionFactor > 0) {
        const intensity = (sunPositionFactor + 1) / 2; // Varie de 0 à 1, où 1 est le jour complet
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, `rgba(${50 + 205 * intensity}, ${50 + 205 * intensity}, 255, 1)`); // Ciel bleu clair
        skyGradient.addColorStop(1, `rgba(255, ${50 + 205 * intensity}, 50, ${intensity * 0.7})`); // Orange vif en bas
    } else {
        const intensity = (sunPositionFactor + 1) / 2; // Varie de 0 à 1, où 0 est la nuit complète
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, `rgba(0, 28, 84, ${1 - intensity})`); // Ciel bleu très sombre en haut
        skyGradient.addColorStop(1, `rgba(255, 69, 0, ${1 - intensity})`); // Orange vif en bas pour le coucher de soleil
    }

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Dessiner les étoiles (visibles pendant la nuit et disparaissent au lever du soleil)
    if (!isDay) {
        stars.forEach(star => {
            if (star.opacity < 1) {
                star.opacity += 0.01; // Augmenter progressivement l'opacité des étoiles
            }
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    } else {
        stars.forEach(star => {
            if (star.opacity > 0) {
                star.opacity -= 0.02; // Diminuer progressivement l'opacité des étoiles
            }
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    // Soleil
    ctx.fillStyle = '#FFD700'; // Couleur du soleil
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Lune
    ctx.fillStyle = '#F0E68C'; // Couleur de la lune
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Dessiner les vagues
    ctx.fillStyle = '#1E90FF'; // Couleur de l'eau
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let x = 0; x < width; x++) {
        let y = height / 2;
        for (const wave of waves) {
            y += amplitude * Math.sin(x * wave.frequency + wave.phase);
        }
        ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Mettre à jour les phases des vagues
    for (const wave of waves) {
        wave.phase += speed;
    }

    // Mettre à jour le temps pour le cycle jour/nuit
    currentTime += 10; // Approximation pour 60 FPS
    if (currentTime > dayLength) {
        currentTime = 0;
    }

    requestAnimationFrame(draw);
}

// Ajuster les paramètres de la simulation en fonction des contrôles du menu
const waveSpeedControl = document.getElementById('waveSpeed');
const waveAmplitudeControl = document.getElementById('waveAmplitude');
const starCountControl = document.getElementById('starCount');
const skyColorControl = document.getElementById('skyColor');

waveSpeedControl.addEventListener('input', () => {
    speed = parseFloat(waveSpeedControl.value);
});

waveAmplitudeControl.addEventListener('input', () => {
    amplitude = parseFloat(waveAmplitudeControl.value);
});

starCountControl.addEventListener('input', () => {
    const newStarCount = parseInt(starCountControl.value, 10);
    stars.length = 0; // Réinitialiser les étoiles
    for (let i = 0; i < newStarCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * (height / 2.5),
            opacity: 0
        });
    }
});



// Ajuster la taille du canevas lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Démarrer l'animation
draw();
