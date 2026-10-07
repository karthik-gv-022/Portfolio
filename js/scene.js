/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — scene.js
   Lightweight CSS-3D camera engine.
   Holds camera state, interpolates towards targets on rAF, and
   writes the world transform. Pure DOM/CSS 3D — no WebGL.
   ════════════════════════════════════════════════════════════════
   Model:
   Rooms are full-viewport planes stacked in 3D. The camera does NOT
   cross a room plane (that would blow up perspective). Instead the
   world rotates/tilts by a few degrees while rooms crossfade — a
   cinematic "turn to face another space". A small safe Z push is
   reserved for the entry door moment.
   ════════════════════════════════════════════════════════════════ */

import { prefersReducedMotion } from './accessibility.js';

const world = document.getElementById('world');

export const camera = {
    x: 0, y: 0, z: 0, rx: 0, ry: 0,
    _tx: 0, _ty: 0,
    _trx: 0, _try: 0,
};

export const cameraTarget = {
    z: 0,
    rx: 0,
    ry: 0,
    parallax: true,
};

const SAFE_Z_MIN = 0;
const SAFE_Z_MAX = 220;   // tiny dolly used for the entry push

let rafId = null;
let lastT = null;
let tweening = null;      // null | {from, to, elapsed, dur, onArrive}

/** Frames-per-second independent lerp weight (0..1 per frame at 60fps). */
function chase(weight, dt) {
    return 1 - Math.pow(1 - weight, dt / (1000 / 60));
}

/**
 * Begin the render loop.
 */
export function startScene() {
    if (rafId) return;
    const tick = (t) => {
        rafId = requestAnimationFrame(tick);
        if (document.visibilityState !== 'visible') {
            lastT = null;
            return;
        }
        if (lastT === null) lastT = t;
        // Cap the step so a stall never produces a wild jump; 250ms keeps
        // animation time honest down to ~4fps.
        const dt = Math.min(250, t - lastT);
        lastT = t;
        step(dt);
    };
    rafId = requestAnimationFrame(tick);
}

function step(dt) {
    // gentle chases
    camera.x += (camera._tx - camera.x) * chase(0.12, dt);
    camera.y += (camera._ty - camera.y) * chase(0.12, dt);
    camera.rx += (camera._trx - camera.rx) * chase(0.1, dt);
    camera.ry += (camera._try - camera.ry) * chase(0.1, dt);

    if (tweening) {
        tweening.elapsed += dt;
        const k = easeInOutCubic(Math.min(1, tweening.elapsed / tweening.dur));
        camera.z = tweening.from + (tweening.to - tweening.from) * k;
        if (tweening.elapsed >= tweening.dur) {
            camera.z = tweening.to;
            const cb = tweening.onArrive;
            tweening = null;
            if (cb) cb();
        }
    } else {
        camera.z += (cameraTarget.z - camera.z) * chase(0.09, dt);
        if (Math.abs(cameraTarget.z - camera.z) < 0.5) camera.z = cameraTarget.z;
    }

    writeTransform();
}

function writeTransform() {
    world.style.transform =
        `translate3d(${camera.x.toFixed(2)}px, ${camera.y.toFixed(2)}px, 0) ` +
        `rotateX(${camera.rx.toFixed(3)}deg) rotateY(${camera.ry.toFixed(3)}deg) ` +
        `translateZ(${-camera.z.toFixed(2)}px)`;
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Cinematic dolly — bounded Z push. Used for the entry moment and
 * subtle approach pulses. Never approaches the perspective plane.
 * @param {{to:number, dur?:number, onArrive?:Function}} opts
 */
export function dollyTo(opts) {
    const to = clamp(opts.to, SAFE_Z_MIN, SAFE_Z_MAX);
    if (prefersReducedMotion()) {
        camera.z = to;
        cameraTarget.z = to;
        if (opts.onArrive) opts.onArrive();
        return;
    }
    tweening = {
        from: camera.z,
        to,
        elapsed: 0,
        dur: opts.dur || 900,
        onArrive: opts.onArrive,
    };
}

/**
 * Set the standing camera Z (safe range).
 */
export function setCameraZ(z, instant = false) {
    const safe = clamp(z, SAFE_Z_MIN, SAFE_Z_MAX);
    cameraTarget.z = safe;
    if (instant || prefersReducedMotion()) camera.z = safe;
}

/**
 * Subtle turn toward a space. Call again with {ry:0, rx:0} to rest.
 * @param {{ry?:number, rx?:number}} opts
 */
export function turnTo(opts) {
    if (prefersReducedMotion()) return;
    camera._try = opts.ry || 0;
    camera._trx = opts.rx || 0;
}

/**
 * Mouse parallax — extremely subtle orientation.
 * @param {number} nx -1..1
 * @param {number} ny -1..1
 */
export function applyParallax(nx, ny) {
    if (!cameraTarget.parallax || prefersReducedMotion()) return;
    camera._tx = nx * -14;
    camera._ty = ny * -9;
    camera._trx = ny * 1.1;
    camera._try = nx * 1.5;
}

/** Re-centre parallax when the pointer leaves the viewport. */
export function resetParallax() {
    camera._tx = 0;
    camera._ty = 0;
    camera._trx = 0;
    camera._try = 0;
}

/** Halt the loop (performance / tests). */
export function stopScene() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
}

/** @returns {boolean} whether CSS 3D transforms are usable */
export function detect3D() {
    try {
        const el = document.createElement('div');
        el.style.transform = 'translateZ(1px) rotateY(1deg)';
        el.style.transformStyle = 'preserve-3d';
        return el.style.transformStyle === 'preserve-3d';
    } catch (e) {
        return false;
    }
}

/**
 * Rooms carry data-depth attributes. For robustness every room sits at
 * the perspective plane (z=0) so it fills the viewport exactly; camera
 * travel is simulated by world rotation + controlled dolly. The depth
 * value feeds only the interior parallax feel.
 */
export function positionRooms() {
    document.querySelectorAll('.room').forEach((room) => {
        room.querySelectorAll('.room__plane').forEach((plane) => {
            plane.style.transform = 'translate3d(0, 0, 0)';
        });
    });
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}