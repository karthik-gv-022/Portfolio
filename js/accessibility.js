/**
 * accessibility.js
 * Accessibility enhancements:
 *   - Focus management for keyboard navigation
 *   - Focus trap utilities (for modals / mobile menu)
 *   - Announce dynamic content to screen readers
 *   - Manage aria-live region
 *   - Keyboard shortcut hints
 *
 * @module accessibility
 */

/**
 * Initialise accessibility enhancements.
 * Called from main.js on DOMContentLoaded.
 */
export function initAccessibility() {
    initFocusClassTracking();
    initAriaLiveRegion();
    initSkipNav();
}

// ── Focus class tracking ───────────────────────────────────────

/**
 * Add 'is-keyboard-user' class to <body> when Tab key is used.
 * Remove it when mouse is clicked.
 * Allows CSS to show focus rings only for keyboard users.
 */
function initFocusClassTracking() {
    let isKeyboardUser = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (!isKeyboardUser) {
                isKeyboardUser = true;
                document.body.classList.add('is-keyboard-user');
            }
        }
    });

    document.addEventListener('mousedown', () => {
        if (isKeyboardUser) {
            isKeyboardUser = false;
            document.body.classList.remove('is-keyboard-user');
        }
    });
}

// ── Aria live region ───────────────────────────────────────────

/** @type {HTMLElement|null} */
let liveRegion = null;

/**
 * Create a hidden aria-live region for announcing dynamic
 * content changes to screen readers.
 * The element is appended to <body> once.
 */
function initAriaLiveRegion() {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);
}

/**
 * Announce a message to screen readers via the live region.
 * Clears previous message first to ensure re-announcement.
 *
 * @param {string}  message  - Text to announce
 * @param {'polite'|'assertive'} [politeness='polite']
 */
export function announce(message, politeness = 'polite') {
    if (!liveRegion) return;

    liveRegion.setAttribute('aria-live', politeness);

    // Brief empty assignment forces re-announcement of same message
    liveRegion.textContent = '';

    // Small timeout allows DOM update to register with AT
    requestAnimationFrame(() => {
        liveRegion.textContent = message;
    });
}

// ── Skip navigation ────────────────────────────────────────────

/**
 * Ensure the skip-nav link correctly scrolls to main content
 * and focuses the main element for keyboard users.
 */
function initSkipNav() {
    const skipLink = document.querySelector('.skip-nav');
    const mainContent = document.querySelector('main, [role="main"], #main-content');

    if (!skipLink || !mainContent) return;

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus({ preventScroll: false });

        // Remove tabindex after focus to avoid persistent tab stop
        mainContent.addEventListener('blur', () => {
            mainContent.removeAttribute('tabindex');
        }, { once: true });
    });
}

// ── Focus trap ─────────────────────────────────────────────────

/**
 * Trap keyboard focus within a container element.
 * Useful for modals, drawers, or dialogs.
 *
 * Returns a cleanup function to release the trap.
 *
 * @param {Element} container - Element to trap focus within
 * @returns {Function} cleanup — call to remove the trap
 */
export function trapFocus(container) {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusable = () =>
        Array.from(container.querySelectorAll(focusableSelectors)).filter(
            (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]')
        );

    const handleKeydown = (e) => {
        if (e.key !== 'Tab') return;

        const focusable = getFocusable();
        if (!focusable.length) return;

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeydown);

    return function cleanup() {
        container.removeEventListener('keydown', handleKeydown);
    };
}
