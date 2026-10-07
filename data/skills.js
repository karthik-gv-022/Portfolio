/**
 * data/skills.js
 * THE ARCHIVE — technical dependency/network map.
 *
 * Skills are grouped by domain and carry edges to other skills
 * plus the projects in which they were exercised.
 *
 * ── Data model ─────────────────────────────────────────────────
 * {
 *   category: string        — domain group
 *   nodes:   array<{
 *     id:      string       — node key (route-safe)
 *     name:    string       — display name
 *     projectIds: string[]  — linked project ids
 *   }>
 * }
 * ───────────────────────────────────────────────────────────────
 */

export const skills = [
    {
        category: 'PROGRAMMING LANGUAGES',
        nodes: [
            { id: 'python',     name: 'Python',     projectIds: ['task-tracker'] },
            { id: 'java',       name: 'Java',       projectIds: ['fitness-tracker', 'pos-billing'] },
            { id: 'javascript', name: 'JavaScript', projectIds: ['commerce', 'fitness-tracker', 'task-tracker'] },
            { id: 'sql',        name: 'SQL',        projectIds: ['task-tracker', 'commerce', 'fitness-tracker', 'pos-billing'] },
        ],
    },
    {
        category: 'BACKEND ARCHITECTURE',
        nodes: [
            { id: 'fastapi',     name: 'FastAPI',      projectIds: ['task-tracker', 'commerce'] },
            { id: 'spring-boot', name: 'Spring Boot',  projectIds: ['pos-billing'] },
            { id: 'rest-api',    name: 'REST APIs',    projectIds: ['task-tracker', 'commerce', 'fitness-tracker', 'pos-billing'] },
            { id: 'sqlalchemy',  name: 'SQLAlchemy',   projectIds: ['task-tracker', 'commerce'] },
        ],
    },
    {
        category: 'AI & DATA SYSTEMS',
        nodes: [
            { id: 'ml',         name: 'Machine Learning',       projectIds: ['task-tracker'] },
            { id: 'fed-opt',    name: 'Federated Optimization', projectIds: ['task-tracker'] },
            { id: 'scikit',     name: 'Scikit-learn',           projectIds: ['task-tracker'] },
            { id: 'pandas',     name: 'Pandas & NumPy',         projectIds: ['task-tracker'] },
            { id: 'pred-model', name: 'Predictive Modeling',    projectIds: ['task-tracker'] },
            { id: 'power-bi',   name: 'Power BI / Analytics',   projectIds: [] },
        ],
    },
    {
        category: 'FRONTEND & WEB',
        nodes: [
            { id: 'react',   name: 'ReactJS',        projectIds: ['task-tracker', 'commerce'] },
            { id: 'redux',   name: 'Redux Toolkit',  projectIds: ['task-tracker', 'commerce'] },
            { id: 'html5',   name: 'HTML5',          projectIds: ['fitness-tracker', 'commerce'] },
            { id: 'css3',    name: 'CSS3',           projectIds: ['fitness-tracker', 'commerce'] },
        ],
    },
    {
        category: 'DATABASES & PERSISTENCE',
        nodes: [
            { id: 'postgresql', name: 'PostgreSQL', projectIds: ['task-tracker', 'commerce'] },
            { id: 'mysql',      name: 'MySQL',      projectIds: ['pos-billing'] },
        ],
    },
    {
        category: 'DEVOPS & TOOLS',
        nodes: [
            { id: 'docker',     name: 'Docker',             projectIds: ['task-tracker', 'commerce'] },
            { id: 'git',        name: 'Git & GitHub',       projectIds: [] },
            { id: 'aws',        name: 'AWS Cloud',          projectIds: [] },
            { id: 'playwright', name: 'Playwright Testing', projectIds: [] },
            { id: 'postman',    name: 'Postman API Testing',projectIds: [] },
            { id: 'jupyter',    name: 'Jupyter Notebook',   projectIds: [] },
        ],
    },
];

/**
 * Flatten every node for map building.
 * @returns {Array<{id, name, category, projectIds}>}
 */
export const skillNodes = skills.flatMap((group) =>
    group.nodes.map((n) => ({ ...n, category: group.category }))
);