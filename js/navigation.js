/**
 * navigation.js
 * Handles all navigation behaviour:
 *   - Scroll-aware nav state
 *   - Mobile menu toggle
 *   - Active link highlighting
 *   - Keyboard trap in mobile menu
 *
 * @module navigation
 */

/**
 * Initialise navigation behaviour.
 * Called from main.js on DOMContentLoaded.
 */
export function initNavigation() {
    const nav      = document.querySelector('.nav');
    const toggle   = document.querySelector('.nav__toggle');
    const navList  = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!nav) return;

    // ── Scroll-aware nav ──────────────────────────────────────
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 64) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on init

    // ── Mobile menu toggle ────────────────────────────────────
    if (toggle && navList) {
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            navList.setAttribute('aria-hidden', String(!isOpen));

            if (isOpen) {
                // Focus first nav link when menu opens
                const firstLink = navList.querySelector('.nav__link');
                firstLink?.focus();
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            } else {
                document.body.style.overflow = '';
                toggle.focus();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                navList.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    navList.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                navList.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Active link highlighting ──────────────────────────────
    /**
     * Set the active nav link based on current page.
     * Compares href against current pathname.
     */
    const setActiveLink = () => {
        const currentPath = window.location.pathname;

        navLinks.forEach((link) => {
            const linkPath = new URL(link.href, window.location.origin).pathname;

            // Exact match, or index page matching root
            const isActive =
                linkPath === currentPath ||
                (currentPath === '/' && linkPath.endsWith('index.html')) ||
                (currentPath.endsWith('/') && linkPath === currentPath + 'index.html');

            link.classList.toggle('is-active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
    };

    setActiveLink();
}
