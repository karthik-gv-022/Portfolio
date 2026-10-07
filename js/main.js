/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — main.js
   Bootstrap: feature detection, room registration, router init,
   content render, interactions, and preference handling.
   ════════════════════════════════════════════════════════════════ */

import {
    startScene,
    positionRooms,
    detect3D,
    setCameraZ,
} from './scene.js';
import {
    initRouter,
    registerRouteHandler,
} from './navigation.js';
import {
    initContent,
    renderProject,
} from './projects.js';
import {
    bindParallax,
    bindGlobalNavigation,
    bindMap,
    bindStepping,
} from './interactions.js';
import {
    watchReducedMotion,
    prefersReducedMotion,
    ready,
} from './accessibility.js';
import { initDust } from './dust.js';

ready(() => {
    // ── Environment flags ────────────────────────────────────────
    const has3D = detect3D();
    document.documentElement.classList.toggle('no-3d', !has3D);

    // Remove `hidden` from rooms so our JS controls visibility.
    document.querySelectorAll('.room').forEach((room) => room.removeAttribute('hidden'));

    // ── HUD reacts to every room change (entry included) ─────────
    document.addEventListener('arc-room-change', (e) => {
        const room = e.detail.room;
        const hudEl = document.getElementById('hud');
        const loc = document.getElementById('hud-loc');
        if (!hudEl || room === 'entry') return;
        if (loc) loc.textContent = roomLabel(room);
        hudEl.classList.add('is-visible');
    });

    // ── Position rooms in 3D ─────────────────────────────────────
    positionRooms();
    setCameraZ(0, true);

    // ── Handlers ─────────────────────────────────────────────────
    registerRouteHandler('project', (id) => renderProject(id));
    registerRouteHandler('gallery', () => initContent());

    initContent();
    bindParallax();
    bindGlobalNavigation();
    bindMap();
    bindStepping(() => currentRoomId());
    initDust();

    // ── Reduced motion ───────────────────────────────────────────
    document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion());
    watchReducedMotion(() => {
        // jump straight back to pyramid rest on toggle
        setCameraZ(0, true);
    });

    // ── Boot camera + router ─────────────────────────────────────
    startScene();
    initRouter();
});

/* ── helpers ───────────────────────────────────────────────────── */

/** DOM id of the room that currently has the floor. */
export function currentRoomId() {
    const active = document.querySelector('.room.is-active');
    return active ? active.id.replace('room-', '') : 'entry';
}

function roomLabel(room) {
    const map = {
        entry:        'ENTRY LOBBY',
        archive:      'ARCHIVE INDEX',
        gallery:      'ENGINEERING GALLERY',
        project:      'PROJECT INVESTIGATION',
        architecture: 'SYSTEM ARCHITECTURE',
        records:      'ENGINEERING RECORDS',
        skills:       'SKILLS NETWORK',
        contact:      'CONTACT TERMINAL',
    };
    return map[room] || room.toUpperCase();
}
