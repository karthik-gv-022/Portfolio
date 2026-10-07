/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — accessibility.js
   Reduced-motion, keyboard navigation, focus management, live
   announcements. The archive stays fully usable without 3D.
   ════════════════════════════════════════════════════════════════ */

/* ── Reduced motion ────────────────────────────────────────────── */
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mq.matches;

export function prefersReducedMotion() {
    return reduced;
}

export function watchReducedMotion(fn) {
    const handler = (e) => {
        reduced = e.matches;
        document.documentElement.classList.toggle('reduced-motion', reduced);
        if (fn) fn(reduced);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
}

/* ── Live region announcements ─────────────────────────────────── */
const live = document.createElement('div');
live.className = 'sr-only';
live.setAttribute('aria-live', 'polite');
awaitReady(() => document.body.appendChild(live));

export function announce(msg) {
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 40);
}

/* ── Focus management ──────────────────────────────────────────── */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Trap focus inside a container while it is open.
 * @param {HTMLElement} container
 */
export function trapFocus(container) {
    const onKey = (e) => {
        if (e.key !== 'Tab') return;
        const nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (!container.contains(active)) {
            e.preventDefault();
            (e.shiftKey ? last : first).focus();
            return;
        }
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
}

export function removeReturn() {}

/* ── Keyboard navigation (global) ──────────────────────────────── */
export function bindKeyboard(actions) {
    document.addEventListener('keydown', (e) => {
        const t = e.target;
        const typing = t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName);

        if (e.key === 'Escape') {
            if (actions.onEscape) actions.onEscape();
            return;
        }
        if (typing) return;

        if (e.key.toLowerCase() === 'm') {
            if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                if (actions.onMapToggle) actions.onMapToggle();
            }
            return;
        }
        if (actions.onArrow) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                actions.onArrow(e.key === 'ArrowRight' ? 1 : -1);
            }
        }
    });
}

/* ── helpers ───────────────────────────────────────────────────── */
function awaitReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
        fn();
    }
}

export const ready = (fn) =>
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', fn, { once: true })
        : fn();