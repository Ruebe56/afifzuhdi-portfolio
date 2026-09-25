// Single source of truth for both the 1-page resume and the 2-page CV.
// Everything here mirrors the live portfolio (index.html) — keep them in step.
// Written modestly on purpose: nothing here claims more than he did.

export const person = {
  name: 'Afif Zuhdi bin Suhardi',
  short: 'Afif Zuhdi',
  title: 'Back-End & Full-Stack Developer',
  subtitle: 'Computer Science (Hons) Networking student, UiTM',
  location: 'Alor Setar, Kedah, Malaysia',
  nationality: 'Malaysian',
  phone: '+60 11-5153 7598',
  phoneHref: 'tel:+601151537598',
  email: 'afif.zuhdi56@gmail.com',
  web: 'afifzuhdi.com',
  github: 'github.com/Ruebe56',
  linkedin: 'linkedin.com/in/afif-zuhdi-bin-suhardi-0a23bb278',
  photo: '../public/img/afif-cutout.webp',
  availability: 'Available for internship from March 2027',
};

export const profile = {
  resume:
    'Back-end and full-stack developer with 3 years of freelance experience building web applications and business systems for clients in Kedah and across Malaysia. Final-year Computer Science (Hons) Networking student at UiTM, with a diploma in computer systems and networking and an internship in a state government network team. Looking for an internship in software development or network engineering from March 2027.',
  cv:
    'Back-end and full-stack developer from Alor Setar, Kedah, with 3 years of freelance experience building websites, web apps and business systems — booking, finance, registration and membership — with online payments built in. Co-founder of Iqbal Media Enterprise, a startup media company. Currently in the final year of a Computer Science (Hons) degree in Networking at UiTM, after a diploma in computer systems and networking and a four-month internship with the network team at Wisma Darul Aman. I enjoy the parts people don\'t see: databases, business logic, payments and servers. Looking for an internship in software development or network engineering from March 2027.',
};

export const education = [
  {
    when: 'Expected 2027',
    what: 'Bachelor of Computer Science (Hons) — Networking',
    where: 'Universiti Teknologi MARA (UiTM)',
    coursework: [
      'Network Design & Management',
      'Enterprise Networking, Security & Automation (Cisco ENSA)',
      'Digital Forensics',
    ],
  },
  {
    when: '2023',
    what: 'Diploma in Computer Systems & Networking',
    where: 'Kolej Poly-Tech MARA (KPTM) Alor Setar',
  },
];

export const experience = [
  {
    when: 'Early 2026 — Present',
    role: 'Co-founder',
    org: 'Iqbal Media Enterprise',
    where: 'Alor Setar, Kedah',
    bullets: {
      resume: [
        'Co-founded a startup media company offering websites, business systems, media and photography.',
        'Lead the web and systems work, including the company website and the client systems it hosts.',
      ],
      cv: [
        'Co-founded a startup media company offering websites, business systems, media and photography.',
        'Lead the web and systems work: the company website, service packages, and the client systems hosted under the company.',
      ],
    },
  },
  {
    when: '2023 — Present',
    role: 'Freelance Back-End Developer',
    org: 'Self-employed',
    where: 'Remote / Kedah',
    bullets: {
      resume: [
        'Design databases and back-end logic for booking, finance, membership and registration systems, from requirements to deployment.',
        'Integrate Malaysian payment gateways (ToyyibPay, Billplz) and automate invoices and WhatsApp notifications.',
        'Deploy, maintain and support live systems, with automated tests on business-critical logic.',
      ],
      cv: [
        'Build websites and custom systems — first for students\' projects, and since 2024 for clients from different companies.',
        'Design databases and back-end logic for booking, finance, membership and registration systems, from requirements to deployment.',
        'Integrate Malaysian payment gateways (ToyyibPay, Billplz) and automate invoices, reports and WhatsApp notifications.',
        'Deploy, maintain and support live systems on shared hosting and Docker, with automated tests on business-critical logic such as wallets and payouts.',
      ],
    },
  },
  {
    when: 'Jul — Oct 2023',
    role: 'Intern, Network & Technical Department',
    org: 'Wisma Darul Aman',
    where: 'Alor Setar, Kedah',
    bullets: {
      resume: [
        'Handled network maintenance and troubleshooting across Wisma Darul Aman and other state government sites in Kedah.',
        'Set up VoIP phones across a full floor of the JKR office.',
        'Set up and kept the internet stable at Dataran Merdeka Kedah for the National Day event on 31 August 2023.',
      ],
      cv: [
        'Handled network maintenance and troubleshooting across all blocks of Wisma Darul Aman, including senior state government offices, and at other government sites around Kedah.',
        'Set up VoIP phones across a full floor of the JKR office.',
        'Joined senior staff on site visits with tenderers for an internet infrastructure upgrade project in Kedah, reviewing server rooms and cable routes around Alor Setar.',
        'Set up and kept the internet stable at Dataran Merdeka Kedah for the National Day event on 31 August 2023.',
      ],
    },
  },
  {
    cvOnly: true,
    when: '2021 — 2023',
    role: 'Laptop Repair & Upgrades',
    org: 'Self-employed',
    where: 'Kedah',
    bullets: {
      cv: ['Repaired, upgraded and resold laptops and hardware — learning the machine from the inside out.'],
    },
  },
];

export const projects = [
  {
    name: 'Gold Shop Membership System',
    stack: 'PHP · MySQL · Tailwind · ToyyibPay',
    resume: 'Membership platform for a gold retailer: member e-wallets with transaction-safe debits, automated bonus and reward calculation, online payments and admin audit logs; covered by 500+ automated tests.',
    cv: [
      'Membership platform for a gold retailer, live in production: members, e-wallets, bonuses, reward points and an online shop.',
      'Wallet debits and credits run inside database transactions with row locking, so concurrent requests cannot double-spend.',
      'Online payments via ToyyibPay with server-side verification; admin action logging; 500+ automated tests on the bonus and wallet logic.',
    ],
  },
  {
    name: 'Restaurant POS & QR Ordering',
    stack: 'Laravel 12 · Next.js · MySQL · Docker · Billplz',
    resume: 'Customers scan a table QR to order; kitchen and counter see it instantly. Menu, inventory, coupons, loyalty points, sales reports and online payment.',
    cv: [
      'Laravel REST API with three access levels (public QR menu, customer accounts, owner and staff) and a Next.js front end.',
      'QR table ordering, kitchen view, menu and inventory management, coupons, loyalty points and sales reports.',
      'Billplz payments with webhook signature verification; an AI chat assistant that answers from the live menu and opening hours.',
    ],
  },
  {
    name: 'Mosque Finance System',
    stack: 'Laravel 12 · Vue 3 PWA · MySQL',
    resume: 'Tracks income and expenses by fund, with PDF and Excel reports and a clean monthly public report; in use by a mosque committee in Kedah.',
    cv: [
      'Installable web app for a mosque committee in Kedah to record income and expenses by fund, in Malay.',
      'PDF and Excel reports, plus a monthly public report designed for the notice board.',
    ],
  },
  {
    name: 'School Registration & Billing',
    stack: 'PHP · MySQL · PhpSpreadsheet',
    resume: 'Student registration with automatic PDF invoices, WhatsApp delivery, Excel import and separate staff roles; in use by a residential school in Kedah.',
    cv: [
      'Registration and billing system for a residential school in Kedah: per-student items and totals, automatic PDF invoices and a public invoice lookup.',
      'Bills delivered by WhatsApp link; Excel bulk import with column mapping; separate admin and teacher roles, with CSRF protection on every form.',
    ],
  },
  {
    name: 'Document Management System',
    stack: 'Django · PostgreSQL · Docker · REST API',
    resume: 'Secure company file storage with folder permissions by department, version history, activity log and a token-authenticated REST API.',
    cv: [
      'Company file storage with nested folders, per-user and per-department permissions, and full version history.',
      'Activity log, Telegram notifications, and a JWT-authenticated REST API that reuses the same access rules as the web app.',
    ],
  },
  {
    cvOnly: true,
    name: 'myDay — Habit & Finance Tracker',
    stack: 'Vue 3 PWA · PHP · MySQL · Kimi AI',
    cv: [
      'Personal app I use every day: habits, tasks, workouts, accounts, budgets and savings goals, with multi-user token login.',
      'Budgets carry forward month to month; workouts log sets and weights with a muscle map; meals can be analysed from a photo with AI.',
    ],
  },
];

export const skills = [
  { group: 'Back-end', items: ['PHP', 'Laravel', 'Python', 'Django', 'REST APIs', 'Payment gateways'] },
  { group: 'Data & infrastructure', items: ['MySQL / MariaDB', 'PostgreSQL', 'Docker', 'Git', 'Linux hosting'] },
  { group: 'Front-end', items: ['Vue', 'React', 'Next.js', 'Tailwind CSS'] },
  { group: 'Networking', items: ['Routing & switching', 'VoIP', 'Network troubleshooting', 'Network security'] },
];

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Malay', level: 'Fluent' },
  { name: 'Indonesian', level: 'Intermediate' },
  { name: 'Japanese', level: 'Beginner' },
  { name: 'Mandarin', level: 'Beginner' },
];
