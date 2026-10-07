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
        id:         'cert-ebox-internship',
        title:      'Java Application Development Internship',
        issuer:     'E-BOX · Amphisoft Technologies',
        issuerLogo: 'E-BOX',
        year:       '2025',
        date:       '11 Aug 2025',
        type:       'Internship Credential',
        credential: 'RPSIT611722243022',
        signatory:  'Punitha T, Managing Director',
        pdfPath:    'assets/documents/Certificate_Internship_Ebox.pdf',
        imagePath:  null,
        skills:     ['Java', 'Spring Boot', 'REST APIs', 'SQL Database Systems'],
        description:'Awarded for successful completion of intensive 6-week Java Application Development internship covering backend API architecture, database workflows, and enterprise application lifecycle.',
    },
    {
        id:         'cert-ibm-cybersec',
        title:      'Cybersecurity Fundamentals',
        issuer:     'IBM SkillsBuild',
        issuerLogo: 'IBM',
        year:       '2025',
        date:       '18 Oct 2025',
        type:       'Professional Certificate',
        credential: 'PLAN-4FB8400F05FC',
        signatory:  'Your Learning Builder - Plans system of record',
        pdfPath:    'assets/documents/Certificate_IBM_Cybersecurity.pdf',
        imagePath:  null,
        skills:     ['Cybersecurity', 'Threat Analysis', 'Network Defense', 'Security Hardening'],
        description:'Comprehensive IBM credential validating core cybersecurity principles, cryptography foundations, threat mitigation vectors, and enterprise vulnerability management.',
    },
    {
        id:         'cert-ibm-cohesity',
        title:      'Cohesity Cyber Resilience Foundations',
        issuer:     'IBM SkillsBuild',
        issuerLogo: 'IBM / Cohesity',
        year:       '2025',
        date:       '05 Nov 2025',
        type:       'Professional Certificate',
        credential: 'ISG-DL08027G',
        signatory:  'IBM SkillsBuild Learner Verification (4 hrs)',
        pdfPath:    'assets/documents/Certificate_IBM_Cohesity.pdf',
        imagePath:  null,
        skills:     ['Cyber Resilience', 'Ransomware Defense', 'Zero-Trust Architecture', 'Disaster Recovery'],
        description:'Specialized credential covering next-generation cyber resilience frameworks, zero-trust backup integrity, automated incident containment, and enterprise data survivability.',
    },
    {
        id:         'cert-oracle-cloud',
        title:      'Google Cloud Computing',
        issuer:     'Oracle Academy',
        issuerLogo: 'Oracle Academy',
        year:       '2024',
        date:       '2024',
        type:       'Cloud Credential',
        credential: 'OA-GCC-VERIFIED',
        signatory:  'Oracle Academy',
        pdfPath:    null,
        imagePath:  null,
        skills:     ['Cloud Infrastructure', 'Distributed Computing', 'Virtualization', 'Container Deployments'],
        description:'Cloud computing curriculum covering enterprise cloud infrastructure, scalable virtual networking, security identity access, and distributed storage management.',
    },
    {
        id:         'cert-ibm-python-ds',
        title:      'Python 101 for Data Science',
        issuer:     'IBM / Cognitive Class',
        issuerLogo: 'Cognitive Class',
        year:       '2023',
        date:       '2023',
        type:       'Data Science Credential',
        credential: 'PY0101EN',
        signatory:  'IBM Cognitive Class',
        pdfPath:    null,
        imagePath:  null,
        skills:     ['Python', 'Data Science', 'Pandas', 'NumPy', 'Data Analysis'],
        description:'Rigorous foundational credential in scientific Python programming, matrix data structures, exploratory data analysis, and mathematical computing.',
    },
];

