/* ════════════════════════════════════════════════════════════════
   THE CONTINUOUS ARCHIVE — 3D WEB EXPERIENCE
   Powered by Three.js (3d-web-experience skill)
   - Interactive rotating geometric core with inner nucleus
   - Dynamic orbital particle field (250 motes)
   - Cursor parallax + Scroll-driven rotation
   - Dark Mode / Light Mode dynamic color synchronization
   ════════════════════════════════════════════════════════════════ */

let scene, camera, renderer;
let coreGroup, outerMesh, innerMesh, particleSystem;
let pointLight, ambientLight;

// Smooth interaction state
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isDarkTheme = true;
let isRunning = false;
let rafId = null;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialize the 3D WebGL Canvas Scene
 */
export function init3DExperience() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        console.warn('Three.js canvas or library not available');
        return;
    }

    // 1. Scene & Camera setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8.5;

    // 2. High-performance WebGL Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3. Lighting setup
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0x38bdf8, 2.4, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xf59e0b, 1.2, 50);
    backLight.position.set(-5, -5, -2);
    scene.add(backLight);

    // 4. Construct 3D Architectural Core
    coreGroup = new THREE.Group();

    // Outer architectural wireframe lattice
    const outerGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const outerMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        roughness: 0.15,
        metalness: 0.85
    });
    outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Inner glowing geometric core
    const innerGeo = new THREE.OctahedronGeometry(1.1, 0);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.1,
        metalness: 0.95,
        wireframe: false
    });
    innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Dynamic Orbital Particles
    const particleCount = 260;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const radius = 3.2 + Math.random() * 4.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        scales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.065,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particleSystem);

    scene.add(coreGroup);

    // 5. Position core slightly right-biased for hero layout on desktop
    updateCoreLayout();

    // 6. Event listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 7. Initial theme sync
    update3DTheme(document.documentElement.getAttribute('data-theme') || 'dark');

    // 8. Begin loop
    start();
}

function updateCoreLayout() {
    if (!coreGroup) return;
    if (window.innerWidth > 960) {
        coreGroup.position.x = 1.6;
        coreGroup.position.y = 0.2;
    } else {
        coreGroup.position.x = 0;
        coreGroup.position.y = 0.8;
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCoreLayout();
}

function onMouseMove(e) {
    targetX = (e.clientX - windowHalfX) * 0.0008;
    targetY = (e.clientY - windowHalfY) * 0.0008;
}

let scrollOffset = 0;
function onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollOffset = window.scrollY / maxScroll;
}

/**
 * Synchronize 3D materials with Dark/Light mode toggle
 */
export function update3DTheme(theme) {
    isDarkTheme = theme === 'dark';
    if (!outerMesh || !innerMesh || !particleSystem || !pointLight) return;

    if (isDarkTheme) {
        outerMesh.material.color.setHex(0x38bdf8); // Electric Cyan
        innerMesh.material.color.setHex(0xf59e0b); // Brass Gold
        particleSystem.material.color.setHex(0x38bdf8);
        particleSystem.material.opacity = 0.75;
        pointLight.color.setHex(0x38bdf8);
        pointLight.intensity = 2.4;
        ambientLight.intensity = 0.6;
    } else {
        outerMesh.material.color.setHex(0x0284c7); // Deep Cobalt
        innerMesh.material.color.setHex(0xd97706); // Amber
        particleSystem.material.color.setHex(0x0284c7);
        particleSystem.material.opacity = 0.45;
        pointLight.color.setHex(0x0284c7);
        pointLight.intensity = 1.8;
        ambientLight.intensity = 1.0;
    }
}

/**
 * Render Animation Loop
 */
let clock = 0;
function animate() {
    if (!isRunning) return;
    rafId = requestAnimationFrame(animate);

    clock += 0.01;

    // Smooth cursor tracking lerp
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    if (coreGroup && !reducedMotion) {
        // Continuous ambient rotation
        outerMesh.rotation.x += 0.003;
        outerMesh.rotation.y += 0.005;

        innerMesh.rotation.x -= 0.006;
        innerMesh.rotation.y -= 0.004;

        particleSystem.rotation.y += 0.0015;

        // Mouse Parallax
        coreGroup.rotation.y = mouseX + (scrollOffset * Math.PI * 2.5);
        coreGroup.rotation.x = mouseY + (scrollOffset * Math.PI * 0.8);

        // Gentle floating pulsation
        coreGroup.position.y = (window.innerWidth > 960 ? 0.2 : 0.8) + Math.sin(clock) * 0.14;
    }

    renderer.render(scene, camera);
}

function start() {
    if (isRunning) return;
    isRunning = true;
    animate();
}

function stop() {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
}

function onVisibilityChange() {
    if (document.hidden) stop();
    else start();
}
