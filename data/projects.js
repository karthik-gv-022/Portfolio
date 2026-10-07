/**
 * data/projects.js
 * THE ARCHIVE — project records.
 * Content is kept here, separate from rendering logic.
 *
 * ── Data model ─────────────────────────────────────────────────
 * {
 *   id:           string        — slug route segment
 *   record:       string        — archive record id, e.g. "ARCH-P004"
 *   index:        string        — gallery number "01"
 *   category:     string        — domain taxonomy
 *   title:        string
 *   status:       string        — "VERIFIED" / "IN REVIEW" / "STABLE"
 *   technologies: string[]
 *   synopsis:     string        — one-line description (gallery)
 *   problem:      string        — investigation section
 *   architecture: array<{layer, note}>  — system layers to diagram
 *   implementation: string
 *   challenges:   string[]
 *   result:       string
 *   lessons:      string[]
 *   featured:     boolean
 * }
 * ───────────────────────────────────────────────────────────────
 */

export const projects = [
    {
        id:           'task-tracker',
        record:       'ARCH-P001',
        index:        '01',
        title:        'Decentralized Predictive Intelligence for Multi-Tenant Task Management',
        category:     'AI & Data Systems',
        status:       'VERIFIED',
        technologies: ['Python', 'FastAPI', 'Scikit-learn', 'React', 'PostgreSQL', 'Docker'],
        synopsis:     'Federated optimization task platform providing tenant data isolation, JWT security, and 76.92% accurate ML task-delay prediction without centralizing raw tenant data.',
        problem:      'Modern enterprise organizations require collaborative predictive task intelligence without violating multi-tenant boundaries or leaking confidential workload telemetry between independent tenants. Traditional centralized models force tenant data aggregation.',
        architecture: [
            { layer: 'CLIENT LAYER',  note: 'React dashboard — tenant-isolated workspace with real-time risk classification gauges.' },
            { layer: 'SECURITY & JWT',note: 'FastAPI auth middleware enforcing strict tenant isolation and role-based access control.' },
            { layer: 'FEDERATED ML',  note: 'Local tenant model training (Logistic Regression, Decision Trees, Naive Bayes) with secure model-update aggregation.' },
            { layer: 'DATASTORE',     note: 'PostgreSQL multi-tenant schema isolation with Docker-orchestrated containers.' },
        ],
        implementation: 'Engineered a full-stack platform using React, FastAPI, and PostgreSQL. Implemented tenant-level data isolation, JWT authentication, and RBAC. Built a predictive intelligence pipeline evaluating Logistic Regression, Decision Trees, and Naive Bayes, achieving 76.92% accuracy with Logistic Regression. Deployed federated learning workflows where local tenant models train independently and aggregate gradient weights collaboratively without exposing raw datasets.',
        challenges: [
            'Preserving data isolation during federated model aggregation without cross-tenant memory leakage.',
            'Balancing model convergence across heterogeneous tenant workload sizes.',
            'Maintaining sub-100ms real-time inference latency across tenant dashboard views.',
        ],
        result: 'Achieved 76.92% task delay prediction accuracy while maintaining cryptographic multi-tenant separation across all database operations and REST endpoints.',
        lessons: [
            'Federated learning bridges data privacy and predictive intelligence in enterprise multi-tenant software.',
            'Tenant routing must be enforced at the gateway layer before any ML inference occurs.',
            'Transparent metrics and confusion matrix tracking establish trust with enterprise users.',
        ],
        featured: true,
    },
    {
        id:           'commerce',
        record:       'ARCH-P002',
        index:        '02',
        title:        'Fashion E-Commerce Platform',
        category:     'Full-Stack Web',
        status:       'VERIFIED',
        technologies: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'Razorpay', 'Firebase'],
        synopsis:     'Full-stack retail commerce architecture featuring SKU/variant matrix management, Razorpay payment processing, and Firebase authenticated checkout.',
        problem:      'Fashion e-commerce demands complex multi-attribute inventory management (size, color, SKU, dynamic pricing) and seamless transactions with zero risk of phantom stock allocation or drop-offs.',
        architecture: [
            { layer: 'STOREFRONT & CMS', note: 'Responsive React frontend for storefront browsing and administrative product publishing.' },
            { layer: 'BACKEND API',      note: 'FastAPI REST engine managing product variant matrices, inventory, and order status.' },
            { layer: 'PAYMENT PIPELINE', note: 'Razorpay webhook & signature verification with Firebase Auth tokens.' },
            { layer: 'DATA PERSISTENCE', note: 'PostgreSQL relational database with normalized product-variant and order ledger tables.' },
        ],
        implementation: 'Developed a full-stack commerce engine supporting product variant hierarchies (size, colour, SKU, custom pricing, stock replenishment). Integrated Razorpay payment gateway with secure webhook callbacks, Firebase authentication, and containerized Docker deployment.',
        challenges: [
            'Handling atomic inventory decrements during concurrent checkout spikes.',
            'Securely synchronizing Razorpay webhook payment signatures with database order state.',
            'Delivering instant frontend search and filter response across complex variant combinations.',
        ],
        result: 'A production-ready e-commerce platform with automated stock tracking, end-to-end checkout, payment verification, and modular administrative management.',
        lessons: [
            'Decoupling inventory reconciliation into idempotent transactional units prevents inventory mismatch.',
            'Strict variant schema design simplifies frontend state management.',
            'Webhook verification is crucial for payment finality.',
        ],
        featured: true,
    },
    {
        id:           'fitness-tracker',
        record:       'ARCH-P003',
        index:        '03',
        title:        'Fitness Tracker & Health Analytics',
        category:     'Full-Stack Web',
        status:       'VERIFIED',
        technologies: ['Java', 'HTML5', 'CSS3', 'JavaScript', 'SQL', 'PostgreSQL'],
        synopsis:     'Full-stack fitness logging and progress visualization application featuring relational workout persistence and dynamic trend graphing.',
        problem:      'Athletes and individuals need clean, reliable systems to track daily workout regimens, calorie expenditure, and long-term physical conditioning with instant visual feedback.',
        architecture: [
            { layer: 'UI VISUALIZATION', note: 'JavaScript charts and interactive calendar logs for workout and calorie metrics.' },
            { layer: 'JAVA CONTROLLER',  note: 'Java application layer managing data verification, metric calculations, and business rules.' },
            { layer: 'SQL DATA ENGINE',  note: 'Relational database schema storing structured exercise sets, reps, caloric burns, and user profiles.' },
        ],
        implementation: 'Built a web application for logging workouts, tracking calories, and monitoring fitness progress. Implemented Java and SQL-based persistence for storing and retrieving workout records. Added dynamic JavaScript visual trendlines to deliver actionable fitness insights.',
        challenges: [
            'Designing a normalized schema capable of storing diverse exercise types with varying attributes.',
            'Rendering fluid interactive client-side charts without heavyweight external dependencies.',
            'Ensuring data integrity during multi-attribute routine updates.',
        ],
        result: 'A responsive and intuitive tracking application providing instant calorie calculations, progress trends, and structured workout archival.',
        lessons: [
            'Consistent data modeling across backend Java classes and SQL tables prevents translation errors.',
            'Visual progress feedback significantly boosts daily user engagement.',
            'Direct SQL optimization keeps analytical queries responsive.',
        ],
        featured: true,
    },
    {
        id:           'pos-billing',
        record:       'ARCH-P004',
        index:        '04',
        title:        'Retail POS & Enterprise Billing Engine',
        category:     'System Architecture',
        status:       'VERIFIED',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'PDF Engine'],
        synopsis:     'High-reliability point-of-sale transaction logging and automated PDF receipt generation built on Spring Boot and relational ledgers.',
        problem:      'Retail checkout counters require sub-second transaction capture, live inventory synchronization, and zero duplicate receipts under network reconnects.',
        architecture: [
            { layer: 'POS CLIENT',      note: 'Modular terminal emitting normalized sale and scan events.' },
            { layer: 'TRANSACTION CORE',note: 'Spring Boot REST service owning transaction lifecycle and idempotency keys.' },
            { layer: 'INVENTORY SYNC',  note: 'Atomic stock decrement coupled with invoice persistence.' },
            { layer: 'DATABASE LEDGER', note: 'MySQL relational store with receipt and inventory audit trails.' },
        ],
        implementation: 'Atomic transaction processing where stock decrements and invoice entries succeed or fail together. Automated receipt generation directly from committed database records using an internal PDF rendering engine.',
        challenges: [
            'Guaranteeing zero duplicate receipts via idempotent transaction tokens.',
            'High-throughput database connection pooling under counter rush hours.',
        ],
        result: 'Dependable billing system ensuring zero inventory drift and reliable audit trails.',
        lessons: [
            'Receipts must only ever be printed from persistent database state, never from client memory.',
            'Idempotency is non-negotiable in financial and retail transactions.',
        ],
        featured: false,
    },
];

/**
 * Projects referenced from the skills network.
 * @returns {Array} all projects with their id + title
 */
export const allProjects = projects.map((p) => ({
    id: p.id,
    title: p.title,
    technologies: p.technologies,
}));

/**
 * Resolve a project by route id.
 * @param {string} id
 * @returns {object|undefined}
 */
export const projectById = (id) => projects.find((p) => p.id === id);