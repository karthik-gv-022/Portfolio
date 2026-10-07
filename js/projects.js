/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — projects.js
   Renderers for structured data: engineering gallery, investigation
   documents (with SVG architecture diagrams), the reference-system
   map, skills network, records, and the contact terminal.
   All content comes from /data — never from markup.
   ════════════════════════════════════════════════════════════════ */

import { projects, projectById } from '../data/projects.js';
import { skillNodes } from '../data/skills.js';
import { experience } from '../data/experience.js';
import { certifications } from '../data/certifications.js';
import { referenceSystem } from '../data/architecture.js';
import { navigateTo } from './navigation.js';
import { announce } from './accessibility.js';

/* ── IDs in markup ─────────────────────────────────────────────── */
const galleryGrid = document.getElementById('gallery-grid');
const projectSurface = document.getElementById('project-surface');
const archSurface = document.getElementById('architecture-surface');
const archInfo = document.getElementById('arch-info');
const skillsSurface = document.getElementById('skills-surface');
const skillPanel = document.getElementById('skill-panel');
const recordList = document.getElementById('record-list');
const terminalEl = document.getElementById('terminal');

/* ═══════════════════ Engineering gallery ═══════════════════ */
export function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    projects.forEach((p, i) => {
        const art = document.createElement('article');
        art.className = 'artifact anim-in';
        art.style.setProperty('--stagger', `${(i + 2) * 90}ms`);
        art.tabIndex = 0;
        art.setAttribute('role', 'button');
        art.setAttribute('aria-label', `Inspect ${p.title}`);
        art.innerHTML = `
            <div class="artifact__top">
                <span>${p.category}</span>
                <span class="artifact__status">${p.status}</span>
            </div>
            <h3 class="artifact__title">${p.title}</h3>
            <p class="artifact__desc">${p.synopsis}</p>
            <div class="artifact__tech">${p.technologies.map((t) => `<span>${t}</span>`).join('')}</div>
            <div class="artifact__inspect">
                <span>Inspect record</span>
                <span aria-hidden="true">→</span>
            </div>`;
        art.addEventListener('click', () => navigateTo(`projects/${p.id}`));
        art.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateTo(`projects/${p.id}`);
            }
        });
        galleryGrid.appendChild(art);
    });
}

/* ═══════════════════ Investigation surface ═══════════════════ */
export function renderProject(projectId) {
    const p = projectById(projectId);
    if (!p || !projectSurface) return;

    const idx = projects.findIndex((x) => x.id === p.id);
    const prevP = projects[(idx - 1 + projects.length) % projects.length];
    const nextP = projects[(idx + 1) % projects.length];

    const doc = document.createElement('article');
    doc.className = 'invest-doc anim-in';
    doc.innerHTML = `
        <header class="invest-doc__mast">
            <div>
                <span class="doc-meta">DOC-ID · ${p.record} — CATEGORY · ${p.category}</span>
                <h1 class="room-head__title" style="margin-top: var(--space-2);">${p.title}</h1>
            </div>
            <span class="doc-meta" style="color: var(--verified);">STATUS · ${p.status}</span>
        </header>
        <div class="invest-doc__body">
            <section class="invest-section">
                <h3><span class="sec-idx">01</span> Problem</h3>
                <p>${p.problem}</p>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">02</span> Architecture</h3>
                <div class="diagram" data-arch-host="${p.id}"></div>
                <div class="node-info" data-arch-info aria-live="polite">
                    <div class="node-info__head">
                        <span class="node-info__title">LAYER — Schematic</span>
                        <span class="node-info__meta">SELECT A LAYER</span>
                    </div>
                    <div class="node-info__body"><span>Select any layer to reveal its role in the system.</span></div>
                </div>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">03</span> Implementation</h3>
                <p>${p.implementation}</p>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">04</span> Technology</h3>
                <div class="tech-rail">${p.technologies.map((t) => `<span>${t}</span>`).join('')}</div>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">05</span> Challenges</h3>
                <ul class="lesson-stack">${p.challenges.map((c) => `<li>${c}</li>`).join('')}</ul>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">06</span> Result</h3>
                <p>${p.result}</p>
            </section>
            <div class="sec-rule"></div>
            <section class="invest-section">
                <h3><span class="sec-idx">07</span> Lessons</h3>
                <ul class="lesson-stack">${p.lessons.map((l) => `<li>${l}</li>`).join('')}</ul>
            </section>
        </div>
        <nav class="invest-nav" aria-label="Record navigation">
            <button class="btn" data-nav-prev="${prevP.id}">← ${shortTitle(prevP.title)}</button>
            <button class="btn" data-nav-gallery>Back to gallery</button>
            <button class="btn" data-nav-next="${nextP.id}">${shortTitle(nextP.title)} →</button>
        </nav>`;

    projectSurface.innerHTML = '';
    projectSurface.appendChild(doc);

    doc.querySelector('[data-nav-prev]').addEventListener('click', (e) =>
        navigateTo(`projects/${e.currentTarget.getAttribute('data-nav-prev')}`));
    doc.querySelector('[data-nav-gallery]').addEventListener('click', () => navigateTo('projects'));
    doc.querySelector('[data-nav-next]').addEventListener('click', (e) =>
        navigateTo(`projects/${e.currentTarget.getAttribute('data-nav-next')}`));

    // architecture schematic for this project
    const host = doc.querySelector('[data-arch-host]');
    renderArchDiagram(host, p.architecture.map((a) => ({ label: a.layer, note: a.note })), p.title);

    announce(`Opened record ${p.record} — ${p.title}`);
}

function shortTitle(t) {
    return t.length > 26 ? t.slice(0, 26) + '…' : t;
}

/* ═══════════════════ SVG diagram engine ═══════════════════ */
const BOX = { w: 200, h: 46 };
const GAP = 66;
const SVG_H = 560;
const SVG_W = 880;

/**
 * Layered stack diagram — clean technical schematic.
 * @param {HTMLElement} host
 * @param {Array<{label:string,note?:string}>} layers  top→bottom
 */
export function renderArchDiagram(host, layers, title = '') {
    const n = layers.length;
    const startY = 90;
    const cx = SVG_W / 2;
    const ns = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${SVG_W} ${SVG_H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Architecture diagram for ${title}`);
    svg.innerHTML = '';

    const defs = document.createElementNS(ns, 'defs');
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '7');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('orient', 'auto');
    marker.innerHTML = '<path d="M0,0 L10,5 L0,10 z" fill="rgba(201,164,91,0.8)"></path>';
    defs.appendChild(marker);
    svg.appendChild(defs);

    const nodes = [];

    layers.forEach((layer, i) => {
        const y = startY + i * (BOX.h + GAP);
        const g = document.createElementNS(ns, 'g');
        g.classList.add('node-group');

        const rect = document.createElementNS(ns, 'rect');
        rect.classList.add('node-rect');
        rect.setAttribute('x', cx - BOX.w / 2);
        rect.setAttribute('y', y);
        rect.setAttribute('width', BOX.w);
        rect.setAttribute('height', BOX.h);
        rect.setAttribute('rx', 2);
        rect.setAttribute('tabindex', '0');
        rect.setAttribute('role', 'button');
        rect.setAttribute('aria-label', `Layer ${layer.label}`);

        const txt = document.createElementNS(ns, 'text');
        txt.classList.add('node-label');
        txt.setAttribute('x', cx);
        txt.setAttribute('y', y + BOX.h / 2 + 4);
        txt.setAttribute('text-anchor', 'middle');
        txt.textContent = layer.label;

        g.appendChild(rect);
        g.appendChild(txt);
        svg.appendChild(g);
        nodes.push({ el: g, rect, y, layer });

        // connector down
        if (i < n - 1) {
            const line = document.createElementNS(ns, 'line');
            line.classList.add('edge');
            line.setAttribute('x1', cx);
            line.setAttribute('y1', y + BOX.h);
            line.setAttribute('x2', cx);
            line.setAttribute('y2', y + BOX.h + GAP);
            line.setAttribute('marker-end', 'url(#arrowhead)');
            svg.insertBefore(line, g);
        }
    });

    host.innerHTML = '';
    host.appendChild(svg);

    // interactivity: click a layer → spotlight + info
    nodes.forEach(({ rect, layer }) => {
        const infoFor = layer.note || 'Layer of the record system.';
        const activate = () => {
            resetActive(nodes);
            rect.classList.add('is-live');
            showNodeInfo(host, layer.label, infoFor, layer.note);
        };
        rect.addEventListener('click', activate);
        rect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}

function resetActive(nodes) {
    nodes.forEach((n) => n.rect.classList.remove('is-live'));
}

function showNodeInfo(host, label, fallback, note) {
    const info = host.parentElement.querySelector('[data-arch-info]');
    if (!info) return;
    info.querySelector('.node-info__title').textContent = label;
    info.querySelector('.node-info__meta').textContent = 'SURFACE · LIVE';
    info.querySelector('.node-info__body').innerHTML = `<span>${note || fallback}</span>`;
}

/* ═══════════════════ Reference-system map ═══════════════════ */
export function renderArchitecture() {
    if (!archSurface) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 960 620');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Reference system architecture map');

    // manual-ish layout per node
    const layout = {
        client:   { x: 380, y: 30 },
        frontend: { x: 380, y: 140 },
        api:      { x: 380, y: 260 },
        services: { x: 130, y: 420 },
        auth:     { x: 620, y: 420 },
        database: { x: 380, y: 540 },
    };

    referenceSystem.edges.forEach((e) => {
        const a = layout[e.from];
        const b = layout[e.to];
        if (!a || !b) return;
        const line = document.createElementNS(ns, 'line');
        line.classList.add('edge');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        svg.appendChild(line);
    });

    referenceSystem.nodes.forEach((node) => {
        const p = layout[node.id];
        if (!p) return;
        const g = document.createElementNS(ns, 'g');
        g.classList.add('node-group');

        const rect = document.createElementNS(ns, 'rect');
        rect.classList.add('node-rect');
        rect.setAttribute('x', p.x - BOX.w / 2);
        rect.setAttribute('y', p.y - BOX.h / 2);
        rect.setAttribute('width', BOX.w);
        rect.setAttribute('height', BOX.h);
        rect.setAttribute('rx', 2);
        rect.setAttribute('tabindex', '0');
        rect.setAttribute('role', 'button');
        rect.setAttribute('aria-label', `Inspect ${node.label} node`);

        const txt = document.createElementNS(ns, 'text');
        txt.classList.add('node-label');
        txt.setAttribute('x', p.x);
        txt.setAttribute('y', p.y + 4);
        txt.setAttribute('text-anchor', 'middle');
        txt.textContent = node.label;

        g.appendChild(rect);
        g.appendChild(txt);
        svg.appendChild(g);

        rect.addEventListener('click', () => {
            svg.querySelectorAll('.node-rect.is-live').forEach((r) => r.classList.remove('is-live'));
            rect.classList.add('is-live');
            archInfo.querySelector('.node-info__title').textContent = node.label;
            archInfo.querySelector('.node-info__meta').textContent = 'SYSTEM · LIVE';
            const body = archInfo.querySelector('.node-info__body');
            body.innerHTML = `
                <p><strong>Responsibility —</strong> ${node.responsibility}</p>
                <p><strong>Technology —</strong> ${node.technology}</p>
                <p><strong>Why —</strong> ${node.reason}</p>
                <p><strong>Tradeoffs —</strong> ${node.tradeoffs}</p>`;
            announce(`Inspecting ${node.label} layer`);
        });
        rect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                rect.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        });
    });

    archSurface.innerHTML = '';
    archSurface.appendChild(svg);
}

/* ═══════════════════ Skills network ═══════════════════ */
export function renderSkills() {
    if (!skillsSurface) return;

    const nodes = skillNodes;
    const W = 880, H = 640;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Skills dependency network');

    // positions: columns by category
    const cats = [...new Set(nodes.map((n) => n.category))];
    const pos = {};
    cats.forEach((cat, ci) => {
        const items = nodes.filter((n) => n.category === cat);
        const x = 110 + (ci * (W - 220)) / Math.max(1, cats.length - 1);
        items.forEach((n, ii) => {
            const y = 110 + (ii * (H - 200)) / Math.max(1, items.length - 1);
            pos[n.id] = { x, y };
        });
    });
    pos.root = { x: W / 2, y: 42 };

    // edges: category root → node (dependencies feed the map)
    const edges = document.createElementNS(ns, 'g');
    nodes.forEach((n) => {
        const p = pos[n.id];
        const r = pos.root;
        const line = document.createElementNS(ns, 'line');
        line.classList.add('skill-edge');
        line.setAttribute('data-edge', n.id);
        line.setAttribute('x1', r.x);
        line.setAttribute('y1', r.y);
        line.setAttribute('x2', p.x);
        line.setAttribute('y2', p.y);
        edges.appendChild(line);
    });
    svg.appendChild(edges);

    const group = document.createElementNS(ns, 'g');
    nodes.forEach((n) => {
        const p = pos[n.id];
        const g = document.createElementNS(ns, 'g');
        g.classList.add('skill-node');
        g.setAttribute('data-skill', n.id);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `Select ${n.name}`);

        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', p.x - 64);
        rect.setAttribute('y', p.y - 20);
        rect.setAttribute('width', 128);
        rect.setAttribute('height', 40);
        rect.setAttribute('rx', 2);

        const txt = document.createElementNS(ns, 'text');
        txt.classList.add('skill-label');
        txt.setAttribute('x', p.x);
        txt.setAttribute('y', p.y + 5);
        txt.setAttribute('text-anchor', 'middle');
        txt.textContent = n.name;

        g.appendChild(rect);
        g.appendChild(txt);
        group.appendChild(g);

        g.addEventListener('click', () => selectSkill(n.id));
        g.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectSkill(n.id);
            }
        });
    });
    svg.appendChild(group);
    svg._pos = pos;

    skillsSurface.innerHTML = '';
    skillsSurface.appendChild(svg);

    function selectSkill(id) {
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

        skillsSurface.querySelectorAll('.skill-node').forEach((g) => {
            g.classList.toggle('is-live', g.getAttribute('data-skill') === id);
        });
        skillsSurface.querySelectorAll('.skill-edge').forEach((l) => {
            l.classList.toggle('is-live', l.getAttribute('data-edge') === id);
        });

        const linked = (node.projectIds && node.projectIds.length)
            ? node.projectIds.map(projectById).filter(Boolean)
            : projects.filter((p) => p.technologies.some((t) => t.toLowerCase() === node.name.toLowerCase()));
        skillPanel.querySelector('.node-info__title').textContent = node.name;
        skillPanel.querySelector('.node-info__meta').textContent = `DOMAIN · ${node.category}`;
        const body = skillPanel.querySelector('.node-info__body');
        if (linked.length) {
            body.innerHTML = `
                <p><strong>Linked records —</strong></p>
                ${linked.map((p, i) => `<button class="linked-project" data-goto="${p.id}">${p.title} →</button>`).join('')}`;
            body.querySelectorAll('[data-goto]').forEach((btn) =>
                btn.addEventListener('click', () => navigateTo(`projects/${btn.getAttribute('data-goto')}`)));
        } else {
            body.innerHTML = `<p>Working tool — exercised across engineering workflows. Select another node to trace its dependencies.</p>`;
        }
        announce(`${node.name} — ${linked.length ? linked.length + ' linked records' : 'core tool'}`);
    }
}

/* ═══════════════════ Records ═══════════════════ */
export function renderRecords() {
    if (!recordList) return;
    recordList.innerHTML = '';

    experience.forEach((rx, i) => {
        const rec = document.createElement('article');
        rec.className = 'record anim-in';
        rec.style.setProperty('--stagger', `${(i + 2) * 80}ms`);
        rec.innerHTML = `
            <div>
                <div class="record__year">${rx.year}</div>
                <div class="record__type">${rx.type}</div>
            </div>
            <div>
                <h3 class="record__title">${rx.role}</h3>
                <p class="record__company">${rx.company} · ${rx.location}</p>
                <p class="record__desc">${rx.description}</p>
                <ul class="record__points">${rx.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
            </div>`;
        recordList.appendChild(rec);
    });

    const validCerts = certifications.filter((c) => c.title && c.title.toLowerCase() !== 'certification title');
    if (validCerts.length) {
        const box = document.createElement('div');
        box.className = 'record paper';
        box.innerHTML = `<div><div class="record__year">CRED</div><div class="record__type">Certifications</div></div>
            <div><h3 class="record__title">Credentials</h3><div class="record__points">
            ${validCerts.map((c) => `<li>${c.title} — ${c.issuer} (${c.year})</li>`).join('')}</div></div>`;
        recordList.appendChild(box);
    }
}

/* ═══════════════════ Contact terminal ═══════════════════ */
export function renderTerminal() {
    if (!terminalEl || terminalEl.dataset.rendered) return;
    terminalEl.dataset.rendered = '1';
    terminalEl.innerHTML = `
        <div class="terminal__bar">
            <div class="terminal__dots"><i class="terminal__dot"></i><i class="terminal__dot"></i><i class="terminal__dot"></i></div>
            <div class="terminal__title">archive-terminal — $ karthik</div>
        </div>
        <div class="terminal__body" id="terminal-body"></div>`;

    const LINKS = [
        { label: 'GITHUB',     href: 'https://github.com/karthik-gv-022' },
        { label: 'LINKEDIN',   href: 'https://www.linkedin.com/in/karthik-gv-a0511725a' },
        { label: 'EMAIL',      href: 'mailto:karthikgv022@gmail.com' },
        { label: 'RESUME',     href: './assets/resume/Karthik_GV_Resume.pdf' },
    ];

    const body = document.getElementById('terminal-body');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lines = [
        { t: '$ archive --status',                                   c: 'prompt' },
        { t: 'ARCHIVE STATUS — RECORD COMPLETE',                     c: 'is-status' },
        { t: '$ operator --availability',                            c: 'prompt' },
        { t: 'ENGINEER — AVAILABLE FOR WORK',                        c: 'is-status' },
        { t: '$ connect --channel',                                  c: 'prompt' },
        { t: 'TRANSMISSION CHANNELS:',                               c: '' },
    ];

    const emit = (i) => {
        if (i >= lines.length) return renderLinks();
        const L = lines[i];
        const div = document.createElement('div');
        div.className = `terminal__line ${L.c}`;
        div.textContent = L.t;
        body.appendChild(div);
        setTimeout(() => emit(i + 1), reduced ? 20 : 320);
    };

    const renderLinks = () => {
        const rail = document.createElement('div');
        rail.className = 'terminal__links';
        LINKS.forEach((l) => {
            const a = document.createElement('a');
            a.className = 'btn btn--sm';
            a.href = l.href;
            if (l.href.startsWith('http')) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            if (l.label === 'RESUME') a.setAttribute('download', '');
            a.textContent = `[${l.label}] ↗`;
            a.setAttribute('aria-label', `${l.label} — opens in new window`);
            rail.appendChild(a);
        });
        body.appendChild(rail);
        const end = document.createElement('div');
        end.className = 'terminal__line';
        end.innerHTML = `<span class="prompt">$</span><span class="terminal__cursor" aria-hidden="true"></span>`;
        body.appendChild(end);
    };

    // trigger when room becomes active
    const activate = () => {
        emit(0);
        document.removeEventListener('arc-room-active', activate);
    };
    document.addEventListener('arc-room-active', activate);
    setTimeout(activate, 650);
}

/* ── Observers: render when the terminal room is shown ─────────── */
const contactRoom = document.getElementById('room-contact');
if (contactRoom) {
    const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            renderTerminal();
            io.disconnect();
        }
    }, { threshold: 0.2 });
    io.observe(contactRoom);
}

/* ═══════════════════ wiring ═══════════════════ */
export function initContent() {
    renderGallery();
    renderArchitecture();
    renderSkills();
    renderRecords();
}