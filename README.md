# Karthik GV — Personal Portfolio

A premium, modern, highly responsive personal portfolio website built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks. No unnecessary dependencies. Designed for professionals.

---

## Purpose

This portfolio is built for:

- Job applications
- Recruiter outreach
- LinkedIn / GitHub profile link
- NQT and recruitment portals
- Freelance opportunities
- Professional networking

---

## Technology Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Structure    | HTML5 (semantic)                  |
| Styling      | CSS3 (custom properties, Grid, Flexbox) |
| Behaviour    | Vanilla JavaScript (ES Modules)   |
| Hosting      | GitHub Pages                      |
| Dependencies | None                              |

---

## Directory Structure

```
portfolio/
│
├── index.html                  ← Main landing page
│
├── pages/
│   ├── about.html
│   ├── projects.html
│   ├── experience.html
│   ├── resume.html
│   └── contact.html
│
├── css/
│   ├── reset.css               ← Browser normalization
│   ├── variables.css           ← Design tokens (colors, type, spacing)
│   ├── typography.css          ← Type scale and semantic classes
│   ├── layout.css              ← Grid and layout primitives
│   ├── components.css          ← Reusable UI components
│   ├── animations.css          ← Motion and transition definitions
│   ├── responsive.css          ← Breakpoint-specific overrides
│   └── main.css                ← Orchestrator — imports all layers
│
├── js/
│   ├── main.js                 ← Entry point / module loader
│   ├── navigation.js           ← Nav behaviour, mobile menu, active states
│   ├── animations.js           ← IntersectionObserver, scroll triggers
│   ├── interactions.js         ← Project cards, UI interactions
│   └── accessibility.js       ← Focus management, keyboard nav, a11y
│
├── assets/
│   ├── images/
│   │   ├── profile/            ← Profile photographs
│   │   ├── projects/           ← Project screenshots / covers
│   │   ├── textures/           ← Subtle background textures
│   │   └── decorative/         ← Design accents
│   ├── icons/                  ← SVG icon set
│   ├── fonts/                  ← Local font files (if self-hosted)
│   └── resume/                 ← Downloadable resume PDF
│
├── data/
│   ├── projects.js             ← Project content data
│   ├── experience.js           ← Work experience data
│   ├── skills.js               ← Skills grouped by category
│   └── certifications.js      ← Certifications and credentials
│
├── docs/
│   ├── DESIGN_DIRECTION.md
│   ├── CONTENT_STRUCTURE.md
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── ANIMATION_SYSTEM.md
│   ├── ACCESSIBILITY.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Local Development

No build step required. Open directly in a browser or use a local server:

### Option 1 — VS Code Live Server

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.

### Option 2 — Python HTTP Server

```bash
# Python 3
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### Option 3 — Node HTTP Server

```bash
npx serve .
```

> **Note**: ES Modules require a server context. Opening `index.html` directly via `file://` may cause CORS errors for module imports.

---

## GitHub Pages Deployment

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`.
4. Select branch `main` (or `master`) and root `/`.
5. Save. The site will be live at:
   ```
   https://<username>.github.io/<repository>/
   ```

For a custom domain, add a `CNAME` file at the root containing your domain name.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for full deployment instructions.

---

## Design Philosophy

Visual identity: **Modern South Indian Editorial**

The design will feel like contemporary South Indian editorial design crossed with a technology journal and software engineering portfolio. Cultural influence comes through typography, composition, geometry, material textures, and editorial rhythm — not through decorative or stereotypical cultural motifs.

See [`docs/DESIGN_DIRECTION.md`](./docs/DESIGN_DIRECTION.md) for the full design direction.

---

## Roadmap

- [x] Foundation — project structure, CSS architecture, JS architecture
- [x] Data layer — projects, experience, skills, certifications
- [x] Accessibility foundation — semantic HTML, keyboard nav, reduced motion
- [x] Responsive foundation — mobile-first, fluid layout
- [ ] Visual design implementation
- [ ] Content population — real projects, experience, biography
- [ ] Asset production — photography, project imagery
- [ ] Animation implementation
- [ ] Performance optimization and Lighthouse audit
- [ ] SEO refinement
- [ ] Final deployment and custom domain configuration

---

## License

MIT — see [LICENSE](./LICENSE)
