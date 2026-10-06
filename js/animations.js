/**
 * animations.js
 * Handles scroll-triggered animations via IntersectionObserver.
 * Manages reveal, stagger, fade, and slide animation classes.
 *
 * @module animations
 */

/**
 * Default IntersectionObserver options.
 * rootMargin: trigger slightly before element enters viewport.
 * threshold: element must be at least 10% visible.
 */
const OBSERVER_OPTIONS = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
};

/**
 * CSS classes that mark elements as scroll-reveal targets.
 * When IntersectionObserver fires, 'is-visible' is added.
 */
const REVEAL_SELECTORS = [
    '.reveal',
    '.fade-in',
    '.slide-in-left',
    '.slide-in-right',
    '.scale-in',
    '.reveal-stagger',
];

/**
 * Create and return an IntersectionObserver that adds
 * 'is-visible' when observed elements enter the viewport.
 *
 * @returns {IntersectionObserver}
 */
function createRevealObserver() {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');

            // Stop observing once revealed (one-shot animation)
            observer.unobserve(entry.target);
        });
    }, OBSERVER_OPTIONS);
}

/**
 * Initialise scroll-triggered reveal animations.
 * Finds all elements matching REVEAL_SELECTORS and observes them.
 */
export function initAnimations() {
    // Guard: IntersectionObserver may not exist in very old environments
    if (!('IntersectionObserver' in window)) {
        // Fallback: immediately show all reveal elements
        showAllRevealElements();
        return;
    }

    // Respect reduced-motion preference — skip animation setup entirely
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
        showAllRevealElements();
        return;
    }

    const observer = createRevealObserver();
    const selector = REVEAL_SELECTORS.join(', ');
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => observer.observe(el));
}

/**
 * Fallback: immediately make all animated elements visible.
 * Used when IntersectionObserver is unavailable or
 * prefers-reduced-motion is set.
 */
function showAllRevealElements() {
    const selector = REVEAL_SELECTORS.join(', ');
    document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-visible');
    });
}

/**
 * Utility: observe a specific element manually.
 * Useful for dynamically inserted content (e.g., rendered project cards).
 *
 * @param {Element} element - DOM element to observe
 */
export function observeElement(element) {
    if (!('IntersectionObserver' in window)) {
        element.classList.add('is-visible');
        return;
    }

    const observer = createRevealObserver();
    observer.observe(element);
}
