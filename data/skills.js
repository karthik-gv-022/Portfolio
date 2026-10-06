/**
 * data/skills.js
 * Editorial technical taxonomy grouped by domain.
 *
 * ── Design decisions ───────────────────────────────────────────
 * - Editorial taxonomy presentation (no percentage bars, no arbitrary meters)
 * - Clear domain groupings reflecting engineering breadth
 * ───────────────────────────────────────────────────────────────
 */

export const skills = [
    {
        category: 'LANGUAGES',
        items:    ['Python', 'Java', 'JavaScript', 'SQL'],
    },
    {
        category: 'FRONTEND',
        items:    ['React', 'HTML', 'CSS', 'Vite'],
    },
    {
        category: 'BACKEND',
        items:    ['FastAPI', 'Spring Boot', 'REST APIs'],
    },
    {
        category: 'DATABASE',
        items:    ['PostgreSQL', 'MySQL', 'SQLite'],
    },
    {
        category: 'ENGINEERING',
        items:    ['Docker', 'Git', 'Linux', 'Postman'],
    },
    {
        category: 'AI / DATA',
        items:    ['Machine Learning', 'Data Analysis', 'AI Integration'],
    },
];
