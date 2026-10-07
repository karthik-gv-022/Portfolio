/* ════════════════════════════════════════════════════════════════
   THE CONTINUOUS ARCHIVE — APPLICATION LOGIC
   Theme manager, 3D bridge, interactive bento projects,
   architecture schematic, and modal deep-dive inspection.
   ════════════════════════════════════════════════════════════════ */

import { init3DExperience, update3DTheme } from './experience3d.js';
import { projects } from '../data/projects.js';
import { skills, skillNodes } from '../data/skills.js';
import { experience } from '../data/experience.js';
import { certifications } from '../data/certifications.js';
import { referenceSystem } from '../data/architecture.js';

// DOM Selectors
const themeToggleBtn = document.getElementById('btn-theme-toggle');
const themeIconSun   = document.getElementById('theme-icon-sun');
const themeIconMoon  = document.getElementById('theme-icon-moon');
const projectsContainer = document.getElementById('projects-container');
const credentialsContainer = document.getElementById('credentials-container');
const projectModal   = document.getElementById('project-modal');
const modalCloseBtn  = document.getElementById('modal-close-btn');
const modalSurface   = document.getElementById('modal-content-surface');
const copyEmailBtn   = document.getElementById('btn-copy-email');

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    init3DExperience();
    initProjectsSection();
    initCertificationsSection();
    initArchitectureDiagram();
    initSkillsMatrix();
    initExperienceTimeline();
    initActiveNavScroll();
    initContactActions();
    initResumeTriggers();
});

/* ═══════════════════ 1. Theme Manager ═══════════════════ */
function initThemeManager() {
    const savedTheme = localStorage.getItem('archive-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }

    // System color scheme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('archive-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('archive-theme', theme);

    if (theme === 'dark') {
        if (themeIconSun) themeIconSun.style.display = 'block';
        if (themeIconMoon) themeIconMoon.style.display = 'none';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#07080b');
    } else {
        if (themeIconSun) themeIconSun.style.display = 'none';
        if (themeIconMoon) themeIconMoon.style.display = 'block';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    }

    // Synchronize 3D WebGL materials
    update3DTheme(theme);
}

/* ═══════════════════ 2. Active Navigation Scroll ═══════════════════ */
function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('is-active');
                    } else {
                        link.classList.remove('is-active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach((sec) => observer.observe(sec));
}

/* ═══════════════════ 3. Projects Showcase & Modal ═══════════════════ */
function initProjectsSection() {
    if (!projectsContainer) return;

    renderProjectsList('all');

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach((b) => b.classList.remove('is-active'));
            e.currentTarget.classList.add('is-active');
            const filter = e.currentTarget.getAttribute('data-filter');
            renderProjectsList(filter);
        });
    });

    // Modal Close
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && !projectModal.hidden) {
            closeModal();
        }
    });
}

function renderProjectsList(filter) {
    projectsContainer.innerHTML = '';

    const filtered = projects.filter((p) => {
        if (filter === 'all') return true;
        return p.category.toLowerCase().includes(filter.toLowerCase());
    });

    filtered.forEach((p) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Inspect record for ${p.title}`);

        card.innerHTML = `
            <div>
                <div class="project-card-top">
                    <span class="project-record-code">${p.record} · ${p.category}</span>
                    <span class="project-status">${p.status}</span>
                </div>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-synopsis">${p.synopsis}</p>
                <div class="project-tech-stack">
                    ${p.technologies.map((t) => `<span class="project-tech-pill">${t}</span>`).join('')}
                </div>
            </div>
            <div class="project-cta-line">
                <span>Inspect Deep-Dive Record</span>
                <span aria-hidden="true">→</span>
            </div>
        `;

        card.addEventListener('click', () => openProjectModal(p));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(p);
            }
        });

        projectsContainer.appendChild(card);
    });
}

function openProjectModal(p) {
    if (!projectModal || !modalSurface) return;

    modalSurface.innerHTML = `
        <div style="margin-bottom: var(--space-4);">
            <span class="project-record-code">${p.record} — ${p.category}</span>
            <h2 class="section-title" style="margin-top: var(--space-2);">${p.title}</h2>
            <span class="project-status">${p.status}</span>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">01 · Problem Statement</h4>
            <p style="color: var(--text-secondary); line-height: 1.7;">${p.problem}</p>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">02 · System Architecture &amp; Layers</h4>
            <div style="display: grid; gap: var(--space-2); margin-top: var(--space-2);">
                ${p.architecture.map((a) => `
                    <div style="padding: var(--space-3); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                        <strong style="color: var(--text-primary); font-family: var(--font-mono); font-size: var(--fs-xs); text-transform: uppercase;">${a.layer}</strong>
                        <p style="color: var(--text-secondary); font-size: var(--fs-sm); margin-top: 4px;">${a.note}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">03 · Technical Implementation</h4>
            <p style="color: var(--text-secondary); line-height: 1.7;">${p.implementation}</p>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">04 · Technologies Employed</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
                ${p.technologies.map((t) => `<span class="project-tech-pill" style="font-size: var(--fs-sm);">${t}</span>`).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">05 · Engineering Challenges &amp; Tradeoffs</h4>
            <ul style="display: grid; gap: var(--space-2); list-style: none;">
                ${p.challenges.map((c) => `
                    <li style="color: var(--text-secondary); display: flex; gap: var(--space-2); font-size: var(--fs-sm);">
                        <span style="color: var(--accent-primary);">⚡</span>
                        <span>${c}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h4 class="modal-section-title">06 · Production Lessons &amp; Takeaways</h4>
            <ul style="display: grid; gap: var(--space-2); list-style: none;">
                ${p.lessons.map((l) => `
                    <li style="color: var(--text-secondary); display: flex; gap: var(--space-2); font-size: var(--fs-sm);">
                        <span style="color: var(--accent-brass);">✓</span>
                        <span>${l}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    projectModal.hidden = false;
    setTimeout(() => projectModal.classList.add('is-open'), 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-open');
    setTimeout(() => {
        projectModal.hidden = true;
        document.body.style.overflow = '';
    }, 280);
}

/* ═══════════════════ 4. Certifications & Credentials ═══════════════════ */
function initCertificationsSection() {
    if (!credentialsContainer) return;

    credentialsContainer.innerHTML = certifications.map((c) => `
        <article class="credential-card credential-card-clean" id="${c.id}">
            <div class="cert-body">
                <div class="cert-badge-row">
                    <span class="cert-type-badge">${c.type}</span>
                    <span class="cert-year-tag">${c.date || c.year}</span>
                </div>
                <h3 class="cert-title">${c.title}</h3>
                <div class="cert-issuer">
                    <span>${c.issuer}</span>
                </div>
                ${c.credential ? `<div class="cert-id-tag">ID: ${c.credential}</div>` : ''}
                <p class="cert-desc">${c.description}</p>
                <div class="cert-skills-tags">
                    ${c.skills.map((s) => `<span class="cert-skill-pill">${s}</span>`).join('')}
                </div>
                <div class="cert-actions">
                    <button class="btn btn-sm btn-primary btn-inspect-cert" data-cert-id="${c.id}">
                        <span>Inspect</span>
                    </button>
                    ${c.pdfPath ? `
                        <a href="${c.pdfPath}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
                            <span>Open PDF</span>
                            <span aria-hidden="true">↗</span>
                        </a>
                        <a href="${c.pdfPath}" download class="btn btn-sm btn-secondary" title="Download Document">
                            <span>⬇</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `).join('');

    // Wire clicks
    credentialsContainer.querySelectorAll('.credential-card').forEach((card) => {
        const certId = card.id;
        const cert = certifications.find((item) => item.id === certId);
        if (!cert) return;

        const inspectBtn = card.querySelector('.btn-inspect-cert');
        const triggerInspection = () => openCertificateModal(cert);

        inspectBtn?.addEventListener('click', triggerInspection);
    });
}

function openCertificateModal(c) {
    if (!projectModal || !modalSurface) return;

    modalSurface.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
            <div>
                <span class="project-record-code">${c.issuerLogo} · ${c.type}</span>
                <h2 class="section-title" style="margin-top: 4px; font-size: var(--fs-xl);">${c.title}</h2>
                <p style="color: var(--text-secondary); font-size: var(--fs-sm);">
                    Issuer: <strong>${c.issuer}</strong> · Date: <strong>${c.date || c.year}</strong>
                </p>
            </div>
            ${c.pdfPath ? `
                <div style="display: flex; gap: var(--space-2);">
                    <a href="${c.pdfPath}" download class="btn btn-sm btn-primary">
                        <span>Download PDF</span>
                        <span aria-hidden="true">⬇</span>
                    </a>
                    <a href="${c.pdfPath}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
                        <span>Open Document</span>
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
            ` : ''}
        </div>

        ${c.credential ? `
            <div style="margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
                <span class="cert-id-tag">Credential ID: ${c.credential}</span>
                ${c.signatory ? `<span style="font-size: var(--fs-xs); color: var(--text-muted); font-family: var(--font-mono);">Authority: ${c.signatory}</span>` : ''}
            </div>
        ` : ''}

        <p style="color: var(--text-secondary); font-size: var(--fs-sm); line-height: 1.68; margin-bottom: var(--space-4);">${c.description}</p>

        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: var(--space-4);">
            ${c.skills.map((s) => `<span class="project-tech-pill">${s}</span>`).join('')}
        </div>

        ${c.pdfPath ? `
            <div style="margin-top: var(--space-4); padding: var(--space-4); background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
                <div>
                    <strong style="color: var(--text-primary); font-size: var(--fs-sm);">Official Certificate Document (PDF)</strong>
                    <p style="color: var(--text-secondary); font-size: var(--fs-xs); margin-top: 2px;">Verified credential document available for download and authentication.</p>
                </div>
                <a href="${c.pdfPath}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    <span>View Official PDF ↗</span>
                </a>
            </div>
        ` : ''}
    `;

    projectModal.hidden = false;
    setTimeout(() => projectModal.classList.add('is-open'), 10);
    document.body.style.overflow = 'hidden';
}

/* ═══════════════════ 5. Resume Triggers & Modal ═══════════════════ */
function initResumeTriggers() {
    const resumeButtons = [
        document.getElementById('nav-btn-resume'),
        document.getElementById('btn-hero-resume'),
        document.getElementById('btn-card-resume'),
    ];

    resumeButtons.forEach((btn) => {
        if (!btn) return;
        btn.addEventListener('click', openResumeModal);
    });
}

function openResumeModal() {
    if (!projectModal || !modalSurface) return;

    modalSurface.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
            <div>
                <span class="project-record-code">OFFICIAL RECORD · CURRICULUM VITAE</span>
                <h2 class="section-title" style="margin-top: 4px; font-size: var(--fs-xl);">Karthik G V — Resume</h2>
                <p style="color: var(--text-secondary); font-size: var(--fs-sm);">
                    B.Tech AI &amp; Data Science (CGPA: 7.9) · Systems &amp; Software Engineering
                </p>
            </div>
            <div style="display: flex; gap: var(--space-2);">
                <a href="assets/resume/Karthik_GV_Resume.pdf" download="Karthik_GV_Resume.pdf" class="btn btn-sm btn-primary">
                    <span>Download PDF</span>
                    <span aria-hidden="true">⬇</span>
                </a>
                <a href="assets/resume/Karthik_GV_Resume.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
                    <span>Open in New Tab</span>
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </div>

        <div style="margin-bottom: var(--space-4); display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <span class="project-tech-pill">Python &amp; Java</span>
            <span class="project-tech-pill">FastAPI &amp; Spring Boot</span>
            <span class="project-tech-pill">React &amp; Redux</span>
            <span class="project-tech-pill">Federated ML</span>
            <span class="project-tech-pill">PostgreSQL &amp; Docker</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-3);">
                <div>
                    <h3 style="font-size: var(--fs-md); color: var(--text-primary); font-family: var(--font-display);">Karthik_GV_Resume.pdf</h3>
                    <span style="font-size: var(--fs-xs); color: var(--text-muted); font-family: var(--font-mono);">Official Single-Page PDF Document · 127 KB</span>
                </div>
                <span class="cert-type-badge" style="background: var(--bg-badge); color: var(--accent-verified); border-color: var(--accent-verified);">VERIFIED ATTACHMENT</span>
            </div>

            <div style="margin-top: var(--space-2); display: grid; gap: var(--space-3);">
                <div>
                    <strong style="color: var(--text-primary); font-size: var(--fs-xs); font-family: var(--font-mono); text-transform: uppercase;">Core Specializations:</strong>
                    <p style="color: var(--text-secondary); font-size: var(--fs-sm); margin-top: 2px;">Artificial Intelligence, Machine Learning, Full-Stack Architecture, Distributed Multi-Tenant Computing, Federated Optimization.</p>
                </div>
                <div>
                    <strong style="color: var(--text-primary); font-size: var(--fs-xs); font-family: var(--font-mono); text-transform: uppercase;">Education:</strong>
                    <p style="color: var(--text-secondary); font-size: var(--fs-sm); margin-top: 2px;">B.Tech in Artificial Intelligence and Data Science (2022–2026), R P Sarathy Institute of Technology (Autonomous), Salem. CGPA: 7.9.</p>
                </div>
                <div>
                    <strong style="color: var(--text-primary); font-size: var(--fs-xs); font-family: var(--font-mono); text-transform: uppercase;">Direct Contact:</strong>
                    <p style="color: var(--text-secondary); font-size: var(--fs-sm); margin-top: 2px;">Email: karthikgv022@gmail.com · Phone: +91 98942 47654 · Location: Salem / Bangalore, India.</p>
                </div>
            </div>

            <div style="margin-top: var(--space-3); display: flex; gap: var(--space-2); justify-content: flex-end;">
                <a href="assets/resume/Karthik_GV_Resume.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    <span>View Complete PDF Document ↗</span>
                </a>
            </div>
        </div>
    `;

    projectModal.hidden = false;
    setTimeout(() => projectModal.classList.add('is-open'), 10);
    document.body.style.overflow = 'hidden';
}

/* ═══════════════════ 4. Interactive Architecture Diagram ═══════════════════ */
function initArchitectureDiagram() {
    const host = document.getElementById('arch-svg-host');
    const titleEl = document.getElementById('arch-inspect-title');
    const metaEl = document.getElementById('arch-inspect-meta');
    const bodyEl = document.getElementById('arch-inspect-body');
    if (!host) return;

    const layers = [
        {
            id: 'client',
            label: 'CLIENT LAYER',
            x: 20, y: 50, w: 160, h: 64,
            tech: 'React · Three.js · HTML5/CSS',
            desc: 'Single-page client interface with WebGL hardware acceleration, dynamic reactive state, and sub-100ms response targets.',
            tradeoff: 'Client-side rendering enables rich 3D interactions but requires strict bundle budgeting and lazy loading.'
        },
        {
            id: 'gateway',
            label: 'API GATEWAY',
            x: 220, y: 50, w: 160, h: 64,
            tech: 'FastAPI / NGINX · JWT Auth',
            desc: 'Central traffic ingress handling rate limiting, TLS termination, token verification, and intelligent request routing.',
            tradeoff: 'Centralized ingress simplifies security enforcement at the cost of being a critical path component requiring multi-region redundancy.'
        },
        {
            id: 'services',
            label: 'CORE SERVICES',
            x: 420, y: 50, w: 160, h: 64,
            tech: 'Python · Node.js · Docker',
            desc: 'Decoupled domain services executing business logic, data normalization, AI model inference, and distributed jobs.',
            tradeoff: 'Isolated services prevent cascading failures but require disciplined API contract versioning and observability.'
        },
        {
            id: 'cache',
            label: 'DISTRIBUTED CACHE',
            x: 620, y: 20, w: 170, h: 54,
            tech: 'Redis Cluster · In-Memory',
            desc: 'Sub-millisecond cache layer storing session states, rate limiter counters, and hot query projections.',
            tradeoff: 'Dramatic read performance gain with the added complexity of cache invalidation strategies.'
        },
        {
            id: 'storage',
            label: 'PERSISTENCE',
            x: 620, y: 90, w: 170, h: 54,
            tech: 'PostgreSQL · TimescaleDB',
            desc: 'ACID-compliant relational store with connection pooling, partitioned time-series logs, and automated schema migrations.',
            tradeoff: 'Guarantees strict data integrity and consistency, requiring read replicas under high concurrency.'
        }
    ];

    host.innerHTML = `
        <svg viewBox="0 0 810 160" width="100%" height="160" style="display: block;">
            <!-- Connector Lines -->
            <line x1="180" y1="82" x2="220" y2="82" class="arch-edge-line" stroke-width="2" />
            <line x1="380" y1="82" x2="420" y2="82" class="arch-edge-line" stroke-width="2" />
            <line x1="580" y1="70" x2="620" y2="47" class="arch-edge-line" stroke-width="2" />
            <line x1="580" y1="94" x2="620" y2="117" class="arch-edge-line" stroke-width="2" />

            <!-- Nodes -->
            ${layers.map((l) => `
                <g class="arch-node-group" data-node-id="${l.id}" style="cursor: pointer;">
                    <rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" rx="8" class="arch-node-rect" stroke-width="1.5"></rect>
                    <text x="${l.x + l.w / 2}" y="${l.y + l.h / 2 + 5}" text-anchor="middle" class="arch-node-text">${l.label}</text>
                </g>
            `).join('')}
        </svg>
    `;

    const nodeGroups = host.querySelectorAll('.arch-node-group');
    nodeGroups.forEach((g) => {
        g.addEventListener('click', () => {
            const id = g.getAttribute('data-node-id');
            const data = layers.find((l) => l.id === id);
            if (!data) return;

            host.querySelectorAll('.arch-node-rect').forEach((r) => r.classList.remove('is-active'));
            g.querySelector('.arch-node-rect')?.classList.add('is-active');

            if (titleEl) titleEl.textContent = `${data.label} — ${data.tech}`;
            if (metaEl) metaEl.textContent = 'ACTIVE INSPECTION';
            if (bodyEl) bodyEl.innerHTML = `
                <p><strong>Role:</strong> ${data.desc}</p>
                <p style="margin-top: 6px;"><strong>Tradeoff &amp; Strategy:</strong> ${data.tradeoff}</p>
            `;
        });
    });

    // Default select first node
    nodeGroups[0]?.querySelector('.arch-node-rect')?.classList.add('is-active');
}

/* ═══════════════════ 7. Skills Matrix ═══════════════════ */
function initSkillsMatrix() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    container.innerHTML = skills.map((cat) => `
        <div class="skill-category-card">
            <div class="skill-cat-title">
                <span>${cat.category}</span>
                <span style="font-size: 10px; color: var(--accent-primary);">● VERIFIED</span>
            </div>
            <div class="skill-items-list">
                ${cat.nodes.map((n) => `<span class="skill-bubble">${n.name}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

/* ═══════════════════ 8. Experience Timeline ═══════════════════ */
function initExperienceTimeline() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    container.innerHTML = experience.map((item) => `
        <article class="timeline-item">
            <div class="timeline-time">${item.period || item.year}</div>
            <div>
                <h3 class="timeline-role">${item.role}</h3>
                <div class="timeline-org">${item.company} · ${item.type}</div>
                <p style="color: var(--text-secondary); font-size: var(--fs-sm); margin-bottom: var(--space-3);">${item.description}</p>
                <ul class="timeline-bullets">
                    ${(item.highlights || item.bullets || []).map((b) => `<li>${b}</li>`).join('')}
                </ul>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--space-3);">
                    ${(item.technologies || []).map((t) => `<span class="project-tech-pill" style="font-size: 11px;">${t}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

/* ═══════════════════ 7. Contact Actions ═══════════════════ */
function initContactActions() {
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('karthikgv022@gmail.com');
                const prevText = copyEmailBtn.textContent;
                copyEmailBtn.textContent = 'Copied to Clipboard! ✓';
                copyEmailBtn.style.borderColor = 'var(--accent-verified)';
                copyEmailBtn.style.color = 'var(--accent-verified)';
                setTimeout(() => {
                    copyEmailBtn.textContent = prevText;
                    copyEmailBtn.style.borderColor = '';
                    copyEmailBtn.style.color = '';
                }, 2200);
            } catch (err) {
                window.location.href = 'mailto:karthikgv022@gmail.com';
            }
        });
    }
}
