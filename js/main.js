/**
 * main.js — Application entry point
 * Initialises all modules on DOMContentLoaded.
 *
 * Module graph:
 *   main.js
 *     ├── navigation.js
 *     ├── animations.js
 *     ├── interactions.js
 *     └── accessibility.js
 *
 * @module main
 */

import { initNavigation }    from './navigation.js';
import { initAnimations }    from './animations.js';
import { initInteractions }  from './interactions.js';
import { initAccessibility } from './accessibility.js';

/**
 * Bootstrap the application.
 * Modules are initialised in dependency order:
 *   1. Accessibility — earliest possible, so focus management works
 *   2. Navigation    — sets up nav before any scroll events
 *   3. Animations    — IntersectionObserver setup
 *   4. Interactions  — UI behaviours last (may depend on rendered DOM)
 */
function init() {
    initAccessibility();
    initNavigation();
    initAnimations();
    initInteractions();

    // Mark body as JS-loaded for progressive enhancement hooks
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js-loaded');
}

// Initialise on DOMContentLoaded — guarantees DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded (e.g., deferred script execution)
    init();
}
