/**
 * interactions.js
 * Handles interactive UI behaviours for Modern South Indian Editorial portfolio:
 *   - Editorial project spread rendering & architecture pipelines
 *   - Category filtering on projects page
 *   - Editorial skills taxonomy rendering
 *   - Timeline chronology rendering
 *   - Smooth scroll with fixed editorial nav offset
 *   - Copy-to-clipboard for contact email
 *   - Native/observer lazy image loading
 *
 * @module interactions
 */

import { observeElement } from './animations.js';
import { projects, featuredProjects } from '../data/projects.js';
import { skills } from '../data/skills.js';
import { experience } from '../data/experience.js';
import { certifications } from '../data/certifications.js';

/**
 * Initialise all interactions.
 * Called from main.js on DOMContentLoaded.
 */
export function initInteractions() {
    initSmoothScroll();
    initLazyImages();
    initCopyEmail();
    initDataRendering();
    initProjectFiltering();
}

/**
 * Render structured data into page containers if present.
 */
function initDataRendering() {
    // 1. Projects on Homepage (featured only)
    const homeProjectsContainer = document.getElementById('projects-grid');
    if (homeProjectsContainer) {
        renderProjectSpreads(featuredProjects, homeProjectsContainer);
    }

    // 2. Projects on All Projects Page
    const allProjectsContainer = document.getElementById('all-projects-grid');
    if (allProjectsContainer) {
        renderProjectSpreads(projects, allProjectsContainer);
    }

    // 3. Skills on Homepage
    const skillsContainer = document.getElementById('skills-grid');
    if (skillsContainer) {
        renderSkills(skills, skillsContainer);
    }

    // 4. Experience on Homepage & Experience Page
    const homeExpContainer = document.getElementById('experience-list');
    if (homeExpContainer) {
        renderExperience(experience, homeExpContainer);
    }

    const fullExpContainer = document.getElementById('experience-list-full');
    if (fullExpContainer) {
        renderExperience(experience, fullExpContainer);
    }

    // 5. Certifications
    const certsContainer = document.getElementById('certifications-list');
    if (certsContainer) {
        renderCertifications(certifications, certsContainer);
    }

    const certsExpContainer = document.getElementById('certifications-exp-list');
    if (certsExpContainer) {
        renderCertifications(certifications, certsExpContainer);
    }
}

// ── Smooth scroll ──────────────────────────────────────────────

/**
 * Apply smooth scroll behaviour to all internal anchor links (#).
 * Offsets scroll position to account for fixed editorial nav.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue(
                    '--nav-height'
                ) || '72'
            );

            const targetTop =
                target.getBoundingClientRect().top +
                window.scrollY -
                navHeight -
                20;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth',
            });

            history.pushState(null, '', href);

            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
}

// ── Lazy image loading ─────────────────────────────────────────

function initLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    if (!('IntersectionObserver' in window)) {
        lazyImages.forEach(loadImage);
        return;
    }

    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadImage(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: '200px 0px' }
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
}

function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');
    img.classList.add('is-loaded');
}

// ── Copy email ──────────────────────────────────────────────────

function initCopyEmail() {
    document.querySelectorAll('[data-copy-email]').forEach((el) => {
        el.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = el.getAttribute('data-copy-email');
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                showCopyFeedback(el, 'Copied to clipboard');
            } catch {
                showCopyFeedback(el, email);
            }
        });
    });
}

function showCopyFeedback(el, message) {
    const original = el.textContent;
    el.textContent = message;
    el.setAttribute('aria-label', message);

    setTimeout(() => {
        el.textContent = original;
        el.removeAttribute('aria-label');
    }, 2000);
}

// ── Project Spread Rendering ────────────────────────────────────

/**
 * Render an array of project objects into an editorial container.
 * @param {Array}   projectList - Array of project data objects
 * @param {Element} container   - DOM element to render spreads into
 */
export function renderProjectSpreads(projectList, container) {
    if (!container || !Array.isArray(projectList)) return;

    container.innerHTML = '';

    projectList.forEach((project) => {
        const spread = createProjectSpread(project);
        container.appendChild(spread);

        // Observe for scroll-reveal animation
        spread.classList.add('reveal');
        observeElement(spread);
    });
}

/**
 * Backward compatibility alias for renderProjectSpreads
 */
export function renderProjectCards(projects, container) {
    renderProjectSpreads(projects, container);
}

/**
 * Create a single project editorial spread DOM element with integrated
 * system architecture flow diagram.
 * @param {Object} project - Project data object
 * @returns {HTMLElement}
 */
function createProjectSpread(project) {
    const article = document.createElement('article');
    article.className = 'project-spread';
    article.setAttribute('data-project-id', project.id);

    const nodes = (project.diagram && project.diagram.length > 0)
        ? project.diagram
        : ['Client / UI', 'API Gateway', 'Core Service', 'Database'];

    const diagramHtml = nodes.map((node, i) => {
        const nodeEl = `
            <div class="system-node">
                <span class="system-node__index">0${i + 1}</span>
                <span class="system-node__name">${escapeHtml(node)}</span>
            </div>
        `;
        const connector = (i < nodes.length - 1)
            ? `<div class="system-node__connector" aria-hidden="true"></div>`
            : '';
        return nodeEl + connector;
    }).join('');

    article.innerHTML = `
        <div class="project-spread__inner">
            <div class="project-spread__editorial">
                <div>
                    <div class="project-spread__meta-header">
                        <span class="project-spread__number">${escapeHtml(project.number)}</span>
                        <span class="project-spread__category">${escapeHtml(project.label || project.category)}</span>
                    </div>
                    <h3 class="project-spread__title">${escapeHtml(project.title)}</h3>
                    <p class="project-spread__description">${escapeHtml(project.description)}</p>
                </div>
                <div>
                    <div class="project-spread__tags" role="list" aria-label="Technologies used">
                        ${project.technologies
                            .map((tech) => `<span class="tag" role="listitem">${escapeHtml(tech)}</span>`)
                            .join('')}
                    </div>
                    <div class="project-spread__actions">
                        ${project.github
                            ? `<a href="${escapeHtml(project.github)}"
                                   class="btn btn--ghost btn--sm"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="View ${escapeHtml(project.title)} source on GitHub">
                                   GitHub
                               </a>`
                            : ''}
                        ${project.demo
                            ? `<a href="${escapeHtml(project.demo)}"
                                   class="btn btn--primary btn--sm"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="View live demo of ${escapeHtml(project.title)}">
                                   Live Demo
                               </a>`
                            : ''}
                        <span class="metadata">SYSTEM SPEC / 2026</span>
                    </div>
                </div>
            </div>
            <div class="project-spread__diagram-panel" aria-label="System Architecture Flow">
                <div class="diagram-header">
                    <span class="diagram-title">System Architecture</span>
                    <span class="diagram-badge">FLOW / PIPELINE</span>
                </div>
                <div class="system-flow">
                    ${diagramHtml}
                </div>
            </div>
        </div>
    `;

    return article;
}

// ── Skills Taxonomy Rendering ───────────────────────────────────

export function renderSkills(skillsData, container) {
    if (!container || !Array.isArray(skillsData)) return;

    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'skills-taxonomy-grid';

    skillsData.forEach((group) => {
        const card = document.createElement('div');
        card.className = 'taxonomy-card reveal';
        card.innerHTML = `
            <div class="taxonomy-card__header">
                <span class="taxonomy-card__label">${escapeHtml(group.category)}</span>
                <span class="taxonomy-card__count">[ ${group.items.length} ]</span>
            </div>
            <div class="taxonomy-card__list">
                ${group.items.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
            </div>
        `;
        grid.appendChild(card);
        observeElement(card);
    });

    container.appendChild(grid);
}

// ── Experience Timeline Rendering ───────────────────────────────

export function renderExperience(experienceData, container) {
    if (!container || !Array.isArray(experienceData)) return;

    container.innerHTML = '';
    const timeline = document.createElement('div');
    timeline.className = 'timeline-editorial';

    experienceData.forEach((exp) => {
        const entry = document.createElement('div');
        entry.className = 'timeline-entry reveal';
        entry.innerHTML = `
            <div class="timeline-entry__year-col">
                <span class="timeline-entry__year">${escapeHtml(exp.year)}</span>
                <span class="timeline-entry__type">${escapeHtml(exp.type)}</span>
            </div>
            <div class="timeline-entry__content">
                <h3 class="timeline-entry__company">${escapeHtml(exp.company)}</h3>
                <span class="timeline-entry__role">${escapeHtml(exp.role)}</span>
                <p class="timeline-entry__desc">${escapeHtml(exp.description)}</p>
                ${exp.technologies && exp.technologies.length > 0 ? `
                    <div class="timeline-entry__tags">
                        ${exp.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        timeline.appendChild(entry);
        observeElement(entry);
    });

    container.appendChild(timeline);
}

// ── Certifications Rendering ────────────────────────────────────

export function renderCertifications(certsData, container) {
    if (!container || !Array.isArray(certsData)) return;

    container.innerHTML = '';
    certsData.forEach((cert) => {
        const card = document.createElement('div');
        card.className = 'taxonomy-card reveal';
        card.style.marginBottom = 'var(--space-4)';
        card.innerHTML = `
            <div class="taxonomy-card__header">
                <span class="taxonomy-card__label">${escapeHtml(cert.title)}</span>
                <span class="taxonomy-card__count">${escapeHtml(cert.year)}</span>
            </div>
            <p class="body-sm text-secondary">${escapeHtml(cert.issuer)}</p>
        `;
        container.appendChild(card);
        observeElement(card);
    });
}

// ── Project Filtering (on Projects page) ────────────────────────

function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const targetGrid = document.getElementById('all-projects-grid');
    if (!filterButtons.length || !targetGrid) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => {
                b.classList.remove('is-active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');
            let filtered = projects;

            if (filter === 'web') {
                filtered = projects.filter(p => 
                    p.category.toLowerCase().includes('web') || 
                    p.technologies.some(t => ['React', 'HTML', 'CSS', 'Node.js'].includes(t))
                );
            } else if (filter === 'data') {
                filtered = projects.filter(p => 
                    p.category.toLowerCase().includes('data') ||
                    p.technologies.some(t => ['SQL', 'PostgreSQL', 'MySQL', 'Pandas'].includes(t))
                );
            } else if (filter === 'ml') {
                filtered = projects.filter(p => 
                    p.category.toLowerCase().includes('ai') || 
                    p.category.toLowerCase().includes('ml') ||
                    p.technologies.some(t => ['Python', 'FastAPI'].includes(t))
                );
            } else if (filter === 'systems') {
                filtered = projects.filter(p => 
                    p.category.toLowerCase().includes('systems') ||
                    p.technologies.some(t => ['Docker', 'FastAPI', 'Spring Boot'].includes(t))
                );
            }

            renderProjectSpreads(filtered, targetGrid);
        });
    });
}

// ── HTML Escape Utility ─────────────────────────────────────────

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
