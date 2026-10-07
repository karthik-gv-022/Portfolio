/* ════════════════════════════════════════════════════════════════
   THE ARCHIVE — dust.js
   Ambient dust motes for the fixed #dust-canvas layer.
   Draws a static frame under prefers-reduced-motion; pauses with
   the tab. The .atmos DOM layer remains as the no-JS fallback.
   ════════════════════════════════════════════════════════════════ */

const COUNT = 64;
const COLOR = '232, 226, 208';
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

let canvas = null;
let ctx = null;
let motes = [];
let raf = 0;
let running = false;
let lastTs = 0;

function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seed() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    motes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.2,
        a: 0.2 + Math.random() * 0.55,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 4,
        phase: Math.random() * Math.PI * 2,
        spin: 0.4 + Math.random() * 1.2,
    }));
}

function step(dt) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.x < -4) m.x += w + 8;
        else if (m.x > w + 4) m.x -= w + 8;
        if (m.y < -4) m.y += h + 8;
        else if (m.y > h + 4) m.y -= h + 8;
    }
}

function draw(clock) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const m of motes) {
        const twinkle = reducedQuery.matches ? 1 : 0.65 + 0.35 * Math.sin(m.phase + clock * m.spin);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${COLOR}, ${m.a * twinkle})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function frame(ts) {
    if (!running) return;
    const dt = Math.min((ts - lastTs) / 1000, 0.25) || 0;
    lastTs = ts;
    step(dt);
    draw(ts / 1000);
    raf = requestAnimationFrame(frame);
}

function start() {
    if (running || reducedQuery.matches) return;
    running = true;
    lastTs = performance.now();
    raf = requestAnimationFrame(frame);
}

function stop() {
    running = false;
    cancelAnimationFrame(raf);
}

function onVisibility() {
    if (document.hidden) stop();
    else if (!reducedQuery.matches) start();
}

function onReducedChange() {
    if (reducedQuery.matches) {
        stop();
        draw(0);
    } else {
        start();
    }
}

export function initDust() {
    canvas = document.getElementById('dust-canvas');
    if (!canvas || !canvas.getContext) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    resize();
    seed();
    draw(0);

    window.addEventListener('resize', () => {
        resize();
        draw(performance.now() / 1000);
    });
    document.addEventListener('visibilitychange', onVisibility);
    reducedQuery.addEventListener('change', onReducedChange);
    start();
}
