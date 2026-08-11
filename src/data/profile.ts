export const profile = {
  name: 'Tamerlan Khunaev',
  initials: 'TK',
  role: 'Digital Prosthetics Engineer · R&D Engineer — Prosthetics',
  shortRole: 'Digital Prosthetics · R&D',
  heroEyebrow: 'From scan to functional prosthetic solution',
  heroAvailability: 'Available for international engineering and prosthetics collaborations',
  availability: 'Open to engineering teams in the UK, Europe & North America',
  email: 'your.email@example.com',
  linkedIn: 'https://www.linkedin.com/in/your-profile',
  cvPath: 'cv/README.txt',
  cvLabel: 'CV',
  portrait: {
    src: 'media/tamerlan-portrait.jpg',
    alt: 'Portrait of Tamerlan Khunaev.',
    isPlaceholder: false,
  },
  introduction: 'A short first-person introduction will be added here. It will place the selected case studies in context and briefly connect clinical practice, digital design, fabrication and ongoing R&D.',
  experienceMetrics: [
    { value: '60+', label: 'Sockets fabricated', accent: true },
    { value: '90%+', label: 'Successful case completion', accent: false },
    { value: '1–2', label: 'Typical design iterations', accent: false },
    { value: '~3 DAYS', label: 'Typical fabrication cycle', accent: true },
    { value: 'FULL RANGE', label: 'Upper-limb amputation levels', accent: false },
    { value: 'FLEXIBLE', label: 'Prosthetic component integration', accent: false },
  ],
  expertiseGroups: [
    {
      title: 'Prosthetics',
      items: [
        'Classical upper-limb prosthetics and manufacturing workflow',
        'Patient 3D scanning and scan processing',
        'Prosthesis assembly, diagnostics and repair',
      ],
    },
    {
      title: 'Digital engineering',
      items: [
        'Fusion 360, SolidWorks, ZBrush and Blender',
        'Reverse engineering and complex surface / solid modelling',
        'Parts, assemblies and mechanisms',
      ],
    },
    {
      title: 'Manufacturing',
      items: [
        'FDM printing, machine setup and maintenance',
        'Engineering polymers and post-processing',
        'Soldering and electronic components',
      ],
    },
    {
      title: 'R&D',
      items: [
        'Product and process development using scanning, CAD and additive manufacturing',
      ],
    },
  ],
} as const;

export const navigation = [
  { label: 'Cases', longLabel: 'Prosthetic Cases', href: '#cases' },
  { label: 'Workflow', longLabel: 'Digital Workflow', href: '#workflow' },
  { label: 'R&D', longLabel: 'R&D / Experiments', href: '#research' },
  { label: 'Other', longLabel: 'Other Work', href: '#other-work' },
] as const;
