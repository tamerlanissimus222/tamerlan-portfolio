export interface ResearchGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

// Original file numbers define the sequence in both the preview row and the viewer.
export const centerOfMassImages: ResearchGalleryImage[] = [
  {
    src: 'media/research/center-of-mass/1.png',
    alt: 'CAD comparison showing distal and proximal battery placement inside the prosthetic forearm.',
    caption: 'Battery placement',
  },
  {
    src: 'media/research/center-of-mass/2.png',
    alt: 'Four CAD views comparing center of mass positions with and without a prosthetic hand.',
    caption: 'CAD analysis',
  },
  {
    src: 'media/research/center-of-mass/3.jpg',
    alt: 'Eight photographs of prosthesis suspension tests against a measurement grid.',
    caption: 'Experimental setup',
  },
  {
    src: 'media/research/center-of-mass/4.jpg',
    alt: 'Four experimental photographs with intersecting reference lines used to locate the center of mass.',
    caption: 'Center of mass determination',
  },
  {
    src: 'media/research/center-of-mass/5.png',
    alt: 'Document excerpt with CAD figures, prosthesis specifications, calculated torque and point-mass inertia estimates.',
    caption: 'Results and conclusions',
  },
];
