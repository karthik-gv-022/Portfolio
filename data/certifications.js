/**
 * data/certifications.js
 * Certifications and credentials data.
 *
 * ── Data model ─────────────────────────────────────────────────
 * {
 *   id:         string       — unique identifier
 *   title:      string       — certification name
 *   issuer:     string       — issuing organisation
 *   year:       string       — year issued
 *   credential: string|null  — credential ID (null if not applicable)
 *   url:        string|null  — verification URL (null if unavailable)
 * }
 * ───────────────────────────────────────────────────────────────
 *
 * NOTE: Do not invent certification details. Replace with real credentials.
 */

export const certifications = [
    {
        id:         'cert-01',
        title:      'Certification Title',
        issuer:     'Issuing Organisation',
        year:       '2024',
        credential: null,
        url:        null,
    },
    {
        id:         'cert-02',
        title:      'Certification Title',
        issuer:     'Issuing Organisation',
        year:       '2023',
        credential: null,
        url:        null,
    },
];
