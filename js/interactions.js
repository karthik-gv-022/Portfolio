/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — interactions.js
   Mouse parallax, door trigger, map overlay, and spatial stepping
   between rooms.
   ════════════════════════════════════════════════════════════════ */

import { applyParallax, resetParallax } from './scene.js';
import { navigateTo } from './navigation.js';
import { bindKeyboard, trapFocus, prefersReducedMotion } from './accessibility.js';

const ROOM_ORDER = ['entry', 'archive', 'gallery', 'project', 'architecture', 'records', 'skills', 'contact'];

const btnMap = document.getElementById('btn-map');
const mapOverlay = document.getElementById('map-overlay');
const btnMapClose = document.getElementById('btn-map-close');
const destList = document.getElementById('dest-list');

/* ── Mouse parallax (very subtle) ──────────────────────────────── */
export function bindParallax() {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        applyParallax(nx, ny);
    });
    document.addEventListener('pointerleave', () => resetParallax());
}

/* ── Global navigation wiring ──────────────────────────────────── */
export function bindGlobalNavigation() {
    // Every [data-route] control (including #btn-enter) routes through here.
    document.addEventListener('click', (e) => {
        const routeBtn = e.target.closest('[data-route]');
        if (routeBtn) {
            e.preventDefault();
            navigateTo(routeBtn.getAttribute('data-route'));
            return;
        }
        const door = e.target.closest('#entry-door');
        if (door) {
            navigateTo('archive');
            return;
        }
    });

    bindEnterKeyForDoor();
}

function bindEnterKeyForDoor() {
    const door = document.getElementById('entry-door');
    if (!door) return;
    door.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateTo('archive');
        }
    });
}

/* ── HUD + map overlay ─────────────────────────────────────────── */
export function bindMap() {
    buildDestList();

    btnMap.addEventListener('click', openMap);
    btnMapClose.addEventListener('click', closeMap);
    mapOverlay.addEventListener('click', (e) => {
        if (e.target === mapOverlay) closeMap();
    });
}

function buildDestList() {
    const DESTINATIONS = [
        { route: 'archive',      code: 'POS-01', name: 'Archive Index' },
        { route: 'gallery',      code: 'HLD-01', name: 'Engineering Gallery' },
        { route: 'architecture', code: 'HLD-02', name: 'System Architecture' },
        { route: 'records',      code: 'HLD-03', name: 'Engineering Records' },
        { route: 'skills',       code: 'HLD-04', name: 'Skills Network' },
        { route: 'contact',      code: 'HLD-05', name: 'Contact Terminal' },
        { route: 'entry',        code: 'XIT-00', name: 'Return to Lobby' },
    ];
    DESTINATIONS.forEach((d) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerHTML = `<span class="dest-code">${d.code}</span><span class="dest-name">${d.name}</span>`;
        btn.addEventListener('click', () => {
            closeMap();
            navigateTo(d.route);
        });
        li.appendChild(btn);
        destList.appendChild(li);
    });
}

let mapHideTimer = null;

export function openMap() {
    clearTimeout(mapHideTimer);
    mapOverlay.hidden = false;
    void mapOverlay.offsetHeight; // flush base style so the open transition runs
    mapOverlay.classList.add('is-open');
    btnMap.setAttribute('aria-expanded', 'true');
    const release = trapFocus(mapOverlay);
    mapOverlay._release = release;
    const first = mapOverlay.querySelector('button');
    if (first) first.focus();
}

export function closeMap() {
    mapOverlay.classList.remove('is-open');
    clearTimeout(mapHideTimer);
    mapHideTimer = setTimeout(() => {
        if (!mapOverlay.classList.contains('is-open')) mapOverlay.hidden = true;
    }, 300);
    btnMap.setAttribute('aria-expanded', 'false');
    if (mapOverlay._release) {
        mapOverlay._release();
        mapOverlay._release = null;
    }
    btnMap.focus();
}

/* ── Spatial stepping (arrow keys) ─────────────────────────────── */
export function bindStepping(getCurrentRoom) {
    bindKeyboard({
        onEscape: () => {
            if (!mapOverlay.classList.contains('is-open')) return;
            closeMap();
        },
        onMapToggle: () => {
            if (mapOverlay.classList.contains('is-open')) closeMap();
            else openMap();
        },
        onArrow: (dir) => {
            const current = getCurrentRoom();
            const idx = ROOM_ORDER.indexOf(current);
            if (idx === -1) return;
            const next = ROOM_ORDER[idx + dir];
            if (!next) return;
            // entering the investigation room needs a project context
            if (next === 'project') {
                navigateTo('projects/task-tracker');
                return;
            }
            navigateTo(next);
        },
    });
}

export { destList };