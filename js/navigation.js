/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — navigation.js
   Hash router + reusable transition system.
   navigateTo() is the only entry point: lock input → animate camera
   → update room → update URL → restore → focus.
   ════════════════════════════════════════════════════════════════ */

import { dollyTo, turnTo, setCameraZ } from './scene.js';
import { prefersReducedMotion, announce } from './accessibility.js';

const T = {
    fade: 620,
    wait: 60,
    door: 1000,
};

const ROOMS = new Set(['entry', 'archive', 'gallery', 'projects', 'project', 'architecture', 'records', 'skills', 'contact']);

/**
 * Route → DOM room id.
 *   projects/<id> → the investigation room (room-project)
 *   projects      → the gallery room (room-gallery)
 *   anything else → room-<route>
 * @param {string} route
 * @param {string|null} [projectId]
 * @returns {string} room id suffix (without `room-`)
 */
const roomIdFor = (route, projectId = null) => {
    if (route === 'projects') return projectId ? 'project' : 'gallery';
    return route;
};

/* Callbacks registered by callers (main.js / projects.js). */
const routeHandlers = {};

export function registerRouteHandler(room, fn) {
    routeHandlers[room] = fn;
}

let transitioning = false;
let currentRoom = 'entry';
let currentProject = null;

const world = document.getElementById('world');

/**
 * Resolve a hash to a location.
 * @returns {{room:string, projectId:string|null, path:string}}
 */
export function parseHash(raw) {
    const hash = raw || location.hash || '#/';
    const norm = hash.replace(/^#\/?/, '');
    const parts = norm.split('/').filter(Boolean);
    const room = (parts[0] || 'entry').toLowerCase();
    const projectId = parts[1] || null;
    return {
        room: ROOMS.has(room) ? room : 'entry',
        projectId: room === 'projects' ? projectId : null,
        path: room === 'projects' && projectId ? `projects/${projectId}` : room,
    };
}

/**
 * Public navigation entry point.
 * @param {string} target   e.g. "archive" | "projects/task-tracker" | "projects"
 * @param {{replace?:boolean}} [opts]
 */
export async function navigateTo(target, opts = {}) {
    if (transitioning) return;

    const parts = target.split('/');
    let room = parts[0];
    let projectId = parts[1] || null;

    // A bare record route has no record to show — open the gallery instead.
    if (room === 'project') {
        room = 'projects';
        projectId = null;
    }

    if (!ROOMS.has(room)) return;

    // no-op if already seated
    if (currentRoom === room && (projectId || null) === currentProject) return;

    const targetRoom = document.getElementById(`room-${roomIdFor(room, projectId)}`);
    if (!targetRoom) return;

    setIsLocked(true);
    try {
        // URL state first, so a back/forward press during the transition is
        // the authority on where we end up (reconciled in flushPendingHash).
        const path = room === 'projects' && projectId ? `projects/${projectId}` : room;
        const url = `#/${path}`;
        if (opts.replace) history.replaceState(null, '', url);
        else history.pushState(null, '', url);

        // Render the destination's content before the camera arrives.
        // A renderer failure must never abort the transition itself.
        try {
            if (room === 'projects' && projectId && routeHandlers.project) {
                routeHandlers.project(projectId);
            }
            if (room === 'projects' && !projectId && routeHandlers.gallery) {
                routeHandlers.gallery();
            }
        } catch (err) {
            console.error('[archive] route handler failed:', err);
        }

        if (currentRoom === 'entry' && room === 'archive') {
            await playEntrySequence(targetRoom);
        } else {
            await playStandardSequence(targetRoom);
        }

        activateRoom(room, projectId);
        currentRoom = room;
        currentProject = (room === 'projects' ? projectId : null);

        // scene dressing per room
        dressRoom(targetRoom);
        announceRoom(room, projectId);
    } finally {
        setIsLocked(false);
        flushPendingHash();
    }
}

function announceRoom(room, projectId) {
    announce(`You are in the ${roomIdFor(room, projectId).replace('-', ' ')} area of the archive`);
}

function setIsLocked(v) {
    transitioning = v;
    document.documentElement.classList.toggle('is-locked', v);
    world.setAttribute('aria-busy', String(v));
}

/**
 * Room → first findable heading to receive focus after arrival.
 * @param {HTMLElement} room
 */
function focusHeading(room) {
    const f = room.querySelector('h1, h2');
    if (f) {
        f.setAttribute('tabindex', '-1');
        f.focus({ preventScroll: true });
    }
}

/**
 * The main crossfade: turn toward the space, fade rooms, set pose.
 */
async function playStandardSequence(targetRoom) {
    const current = document.querySelector('.room.is-active');
    const from = current ? current.id.replace('room-', '') : 'entry';

    // direction feel
    const dir = navSign(from, targetRoom.id.replace('room-', ''));
    turnTo({ ry: dir * 4, rx: Math.abs(dir) * -0.6 });
    dollyTo({ to: 40 + Math.abs(dir) * 30, dur: 700 });

    if (prefersReducedMotion()) {
        finish();
        rest();
        return;
    }

    // crossfade
    if (current) current.classList.remove('is-active');
    await sleep(T.wait);
    targetRoom.classList.add('is-active');
    await sleep(T.fade);
    finish();
    rest();

    function finish() {
        targetRoom.classList.add('is-active');
        if (current && current !== targetRoom) current.classList.remove('is-active');
    }

    function rest() {
        // settle: face forward again and drift back to standing distance
        turnTo({ ry: 0, rx: 0 });
        setCameraZ(0);
    }
}

/**
 * Entry sequence: open the door, push the camera through, then arrive.
 */
async function playEntrySequence(targetRoom) {
    const door = document.getElementById('entry-door');
    const current = document.querySelector('.room.is-active');

    if (prefersReducedMotion()) {
        if (current && current !== targetRoom) current.classList.remove('is-active');
        targetRoom.classList.add('is-active');
        setCameraZ(0, true);
        return;
    }

    if (door) door.classList.add('is-open');

    // dolly forward while the door swings
    await new Promise((resolve) =>
        dollyTo({ to: 200, dur: 1500, onArrive: resolve })
    );

    // swap rooms just as we cross the threshold
    if (current && current !== targetRoom) current.classList.remove('is-active');
    targetRoom.classList.add('is-active');

    // settle back to parade rest
    setCameraZ(0);

    if (door) setTimeout(() => door.classList.remove('is-open'), 900);
}

function navSign(from, to) {
    const order = ['entry', 'archive', 'gallery', 'project', 'architecture', 'records', 'skills', 'contact'];
    const a = order.indexOf(from);
    const b = order.indexOf(to);
    if (a === -1 || b === -1) return 1;
    return b >= a ? 1 : -1;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

/**
 * Toggle a room's visibility + aria state.
 * `name` is the route; the DOM room id is resolved through roomIdFor.
 */
function activateRoom(name, projectId = null) {
    const roomId = roomIdFor(name, projectId);
    const target = document.getElementById(`room-${roomId}`);
    if (!target) return;

    document.querySelectorAll('.room.is-active').forEach((r) => {
        if (r !== target) r.classList.remove('is-active');
    });
    target.removeAttribute('hidden');
    target.classList.add('is-active');
    focusHeading(target);

    // notify UI + any lazy renderers (terminal, etc.)
    document.dispatchEvent(new CustomEvent('arc-room-change', { detail: { room: roomId } }));
    document.dispatchEvent(new CustomEvent('arc-room-active', { detail: { room: roomId } }));
}

/**
 * Per-room dressing: e.g. reset scroll on content rooms.
 */
function dressRoom(targetRoom) {
    const vp = targetRoom.querySelector('.room__viewport');
    if (vp) vp.scrollTop = 0;
}

/* ── Hash routing (browser back/forward/refresh) ──────────────── */
let booted = false;

export function initRouter() {
    window.addEventListener('hashchange', onHash);
    if (!booted) {
        booted = true;
        const loc = parseHash(location.hash);
        if (loc.room === 'entry') {
            activateRoom('entry');
            setCameraZ(0, true);
            return;
        }
        navigateTo(loc.path, { replace: true });
    }
}

function onHash() {
    // A back/forward press mid-transition changes the URL before the room
    // is ready. Remember it and reconcile once the lock releases.
    if (transitioning) {
        pendingHash = location.hash;
        return;
    }
    const loc = parseHash(location.hash);
    navigateTo(loc.path, { replace: true });
}

let pendingHash = null;

function flushPendingHash() {
    if (pendingHash === null) return;
    pendingHash = null;
    onHash();
}

/* expose for no-op polling sanity */
export const isTransitioning = () => transitioning;