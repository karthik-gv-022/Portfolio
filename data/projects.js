/**
 * data/projects.js
 * Structured project data — Modern South Indian Editorial portfolio.
 *
 * ── Data model ─────────────────────────────────────────────────
 * {
 *   id:           string   — unique slug identifier
 *   number:       string   — display number, e.g. "01"
 *   label:        string   — editorial taxonomy label, e.g. "FINAL YEAR PROJECT"
 *   title:        string   — project name
 *   category:     string   — domain category
 *   description:  string   — concise description
 *   technologies: string[] — ordered list of tech used
 *   diagram:      string[] — architecture nodes for system visualization
 *   image:        string|null — relative path to project cover image
 *   github:       string|null — GitHub repository URL (null if private/unreleased)
 *   demo:         string|null — Live demo URL (null if unavailable)
 *   featured:     boolean  — include in homepage editorial spreads
 * }
 * ───────────────────────────────────────────────────────────────
 */

export const projects = [
    {
        id:           'project-01',
        number:       '01',
        label:        'FINAL YEAR PROJECT / SYSTEM ARCHITECTURE',
        title:        'Multi-Tenant Task Management',
        category:     'AI & Systems',
        description:  'AI-driven organizational task management platform engineered for multi-tenant isolation, dynamic workload distribution, and team workspace workflows.',
        technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
        diagram:      ['User / Client', 'Tenant Router', 'FastAPI Engine', 'PostgreSQL Multi-DB'],
        image:        null,
        github:       null,
        demo:         null,
        featured:     true,
    },
    {
        id:           'project-02',
        number:       '02',
        label:        'COMMERCE PLATFORM / WEB APPLICATION',
        title:        'Fashion Commerce Platform',
        category:     'Full-Stack Web',
        description:  'Contemporary fashion commerce experience featuring structured catalog management, responsive customer journeys, and modular checkout pipeline.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'CSS Grid'],
        diagram:      ['Storefront Client', 'API Gateway', 'Catalog Service', 'Relational DB'],
        image:        null,
        github:       null,
        demo:         null,
        featured:     true,
    },
    {
        id:           'project-03',
        number:       '03',
        label:        'ENTERPRISE POS / TRANSACTION ENGINE',
        title:        'Retail POS & Billing System',
        category:     'Systems & Data',
        description:  'High-reliability point-of-sale and automated billing system designed for rapid transaction logging, inventory synchronization, and daily reconciliation.',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'PDF Engine'],
        diagram:      ['POS Terminal', 'Transaction Engine', 'Inventory Sync', 'Central MySQL'],
        image:        null,
        github:       null,
        demo:         null,
        featured:     true,
    },
    {
        id:           'project-04',
        number:       '04',
        label:        'HEALTHCARE WORKFLOW / MANAGEMENT',
        title:        'Hospital Management System',
        category:     'Healthcare Software',
        description:  'Comprehensive clinical operations platform covering role-based physician-patient scheduling, medical record custody, and departmental workflows.',
        technologies: ['Python', 'FastAPI', 'SQLite', 'HTML5', 'Vanilla JS'],
        diagram:      ['Staff Portal', 'Access Gateway', 'Records Engine', 'Audited DB'],
        image:        null,
        github:       null,
        demo:         null,
        featured:     true,
    },
];

/**
 * Get only featured projects (for homepage).
 * @returns {Array}
 */
export const featuredProjects = projects.filter((p) => p.featured);
