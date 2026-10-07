/**
 * data/architecture.js
 * THE ARCHIVE — reference system schematic.
 * Used by the System Architecture holding as a live, inspectable map.
 */

export const referenceSystem = {
    id: 'REF-ARCH-01',
    title: 'Reference System — Multi-Tenant Service Architecture',
    nodes: [
        {
            id: 'client',
            label: 'CLIENT',
            responsibility: 'Presents the system to the operator. Renders tenant-scoped views and routes a session token with every request.',
            technology: 'React · Vanilla JS',
            reason: 'A typed browser client keeps rendering far from data ownership and lets the same API serve many surfaces.',
            tradeoffs: 'Browser bundles are transparent to the server; token storage and XSS surface become client security concerns.',
        },
        {
            id: 'frontend',
            label: 'FRONTEND',
            responsibility: 'Composition and interaction layer between the operator and domain services.',
            technology: 'React · CSS Grid · REST client',
            reason: 'Component isolation keeps the presentation layer inline with product change, while the CSS grid enforces an editorial layout system.',
            tradeoffs: 'State management grows with view count; minimal external state is only sustainable to a boundary.',
        },
        {
            id: 'api',
            label: 'API',
            responsibility: 'Gateway and contract owner. Validates, authenticates, and routes every request to the correct service.',
            technology: 'FastAPI — async REST engine',
            reason: 'A single documented entry point gives the frontend one contract and the backend one place to enforce boundaries.',
            tradeoffs: 'The gateway can become a bottleneck if services are not decomposed behind it.',
        },
        {
            id: 'services',
            label: 'SERVICES',
            responsibility: 'Domain logic: tasks, catalog, transaction engine, records. Each service owns a bounded body of work.',
            technology: 'Python · FastAPI · domain modules',
            reason: 'Bounded service ownership makes migrations, testing, and tenant isolation structurally verifiable.',
            tradeoffs: 'Service-to-service calls add latency unless aggregation is designed at the gateway.',
        },
        {
            id: 'auth',
            label: 'AUTH',
            responsibility: 'Identity and tenant resolution. Issues the session the client presents; confirms tenant context.',
            technology: 'Session tokens · role-based access',
            reason: 'Tenant identity resolved once at the door means no downstream component needs to re-derive it.',
            tradeoffs: 'A central identity service is a high-value target; its failure surface must be contained.',
        },
        {
            id: 'database',
            label: 'DATABASE',
            responsibility: 'Durable record. Holds normalized tenant data, transactional invariants, and audit history.',
            technology: 'PostgreSQL · schema-per-tenant',
            reason: 'Relational integrity guarantees the multi-tenant invariants; per-tenant schemas make isolation physical, not incidental.',
            tradeoffs: 'Schema-per-tenant raises migration and connection-pooling cost; must be documented as a deliberate trade.',
        },
    ],
    edges: [
        { from: 'client',   to: 'frontend' },
        { from: 'frontend', to: 'api' },
        { from: 'api',      to: 'services' },
        { from: 'api',      to: 'auth' },
        { from: 'services', to: 'database' },
        { from: 'auth',     to: 'database' },
    ],
};

/**
 * Search nodes by id.
 */
export const nodeById = (id) => referenceSystem.nodes.find((n) => n.id === id);