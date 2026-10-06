/**
 * data/experience.js
 * Structured work & internship experience data.
 *
 * ── Data model ─────────────────────────────────────────────────
 * {
 *   id:           string   — unique identifier
 *   year:         string   — display year, e.g. "2024"
 *   company:      string   — company or organization name
 *   role:         string   — job title
 *   location:     string   — city / mode
 *   type:         string   — role category
 *   description:  string   — concise summary of responsibilities
 *   highlights:   string[] — key contributions
 *   technologies: string[] — technologies used
 * }
 * ───────────────────────────────────────────────────────────────
 */

export const experience = [
    {
        id:           'exp-01',
        year:         '2024',
        company:      'E-Box',
        role:         'Full Stack Intern',
        location:     'India',
        type:         'Internship',
        description:  'Engineered responsive web modules, API integrations, and database interactions across full-stack applications.',
        highlights:   [
            'Developed modular front-end and back-end application features.',
            'Collaborated on database query optimization and API response handling.',
        ],
        technologies: ['Full Stack', 'Web Development', 'REST APIs', 'Database Systems'],
    },
    {
        id:           'exp-02',
        year:         '2023',
        company:      'Odugaa Tech',
        role:         'Data Analytics Intern',
        location:     'India',
        type:         'Internship',
        description:  'Conducted quantitative data analysis, pattern identification, and reporting to inform data-driven engineering decisions.',
        highlights:   [
            'Performed dataset preprocessing, analysis, and metric visualization.',
            'Extracted actionable insights from operational datasets.',
        ],
        technologies: ['Data Analytics', 'Python', 'Data Processing', 'Statistical Analysis'],
    },
];
