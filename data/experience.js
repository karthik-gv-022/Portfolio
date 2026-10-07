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
        year:         '2024 — 2025',
        company:      'Amphisoft Technologies · E-BOX',
        role:         'Full-Stack Developer Intern',
        location:     'Salem / Coimbatore, India',
        type:         'Internship',
        period:       'May 2024 – Jul 2024 & Jul 2025 – Aug 2025',
        description:  'Engineered enterprise Java & Spring Boot backend services, architected RESTful endpoints, and optimized relational database queries.',
        highlights:   [
            'Developed and tested robust REST APIs using Java and Spring Boot for high-throughput operational workloads.',
            'Executed complex SQL queries, database migrations, and schema optimizations in relational engines.',
            'Successfully completed 6-week intensive Java Application Development internship (07.07.2025 to 09.08.2025) certified by Managing Director.',
        ],
        technologies: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'PostgreSQL', 'Full Stack Development'],
    },
    {
        id:           'exp-02',
        year:         '2023',
        company:      'Odugaa Tech',
        role:         'Data Analytics Intern',
        location:     'Tamil Nadu, India',
        type:         'Internship',
        period:       'Jun 2023 – Aug 2023',
        description:  'Analyzed business and operational datasets using Python and Power BI, creating analytical dashboards and statistical models.',
        highlights:   [
            'Cleaned and preprocessed large tabular datasets using Python, Pandas, and NumPy.',
            'Constructed interactive Power BI dashboards and visualizations to communicate actionable business intelligence.',
            'Formulated statistical summaries that improved reporting turnaround time.',
        ],
        technologies: ['Python', 'Power BI', 'Data Analytics', 'Pandas', 'NumPy', 'Data Visualization'],
    },
    {
        id:           'edu-01',
        year:         '2022 — 2026',
        company:      'R P Sarathy Institute of Technology (Autonomous)',
        role:         'B.Tech in Artificial Intelligence and Data Science',
        location:     'Salem, Tamil Nadu',
        type:         'Undergraduate Degree',
        period:       '2022 – 2026',
        description:  'Rigorous engineering degree specializing in machine learning algorithms, distributed systems, deep neural networks, and federated optimization. Current CGPA: 7.9 / 10.0.',
        highlights:   [
            'Graduating with core specialization in Artificial Intelligence, Machine Learning, and Full-Stack Engineering.',
            'Conducted research into decentralized predictive intelligence with federated learning architectures.',
            'Coursework: Machine Learning, Deep Learning, DBMS, Operating Systems, Computer Networks, Linear Algebra.',
        ],
        technologies: ['Machine Learning', 'Federated Learning', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    },
    {
        id:           'edu-02',
        year:         '2021 — 2022',
        company:      'Morning Star Higher Secondary School',
        role:         'Higher Secondary Education (HSC)',
        location:     'Gudalur, Tamil Nadu',
        type:         'Secondary Schooling',
        period:       '2021 – 2022',
        description:  'Higher secondary schooling in Science and Mathematics, graduating with an aggregate score of 82.0%.',
        highlights:   [
            'Strong foundation in Mathematics, Physics, Chemistry, and Computer Science.',
        ],
        technologies: ['Mathematics', 'Physics', 'Computer Science'],
    },
];

