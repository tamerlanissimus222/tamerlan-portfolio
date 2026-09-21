export interface ResearchArticleBlock {
  id: string;
  paragraphs: string[];
  /** Labels reserved for the media row that will follow this block. */
  expectedMediaLabels: string[];
}

export interface ResearchArticleData {
  id: string;
  label: string;
  blocks: ResearchArticleBlock[];
}

export const setkaArticle: ResearchArticleData = {
  id: 'setka',
  label: 'Setka development article',
  blocks: [
    {
      id: 'concept',
      paragraphs: [
        'Conventional fixed-volume prosthetic sockets have limited ability to accommodate changes in residual limb volume caused by swelling, weight fluctuations, muscle changes or growth. A socket that adapts to these changes and responds to mechanical loading could improve comfort and function across daily activities and sport.',
        'This project explores the concept of a dynamic prosthetic socket based on the mechanical principle of a Chinese finger trap (Fig. 1, 2).',
      ],
      expectedMediaLabels: ['FIG. 1', 'FIG. 2'],
    },
    {
      id: 'early-prototypes',
      paragraphs: [
        'I first analysed the finger trap’s mechanics and explored ways to reproduce its behaviour through 3D printing. Early prototypes used diamond-patterned lattices rather than an interwoven braid, but only partially reproduced the desired response (Fig. 3).',
      ],
      expectedMediaLabels: ['FIG. 3'],
    },
    {
      id: 'parametric-braid',
      paragraphs: [
        'To reproduce the mechanism more closely, I turned to a braided structure. After establishing that it could be 3D printed (Fig. 4), I developed a parametric modelling algorithm for a braided cylinder with adjustable diameter, height, braid angle, strip width and thickness (Fig. 5).',
      ],
      expectedMediaLabels: ['FIG. 4', 'FIG. 5'],
    },
    {
      id: 'initial-testing',
      paragraphs: [
        'For initial testing, I printed a cylindrical braided prototype in TPU with a Shore hardness of 60D, sized to fit my clenched fist as a simplified model of a bulbous residual limb (Fig. 6).',
      ],
      expectedMediaLabels: ['FIG. 6'],
    },
    {
      id: 'pretension',
      paragraphs: [
        'This initial fitting highlighted the need for close contact even without external loading. I therefore adapted the braid to the residual limb’s contours and modified its resting geometry to introduce pre-tension when donned. This produced a closer fit against the skin; additional axial tension reduced the socket’s diameter and increased circumferential compression (Video 1).',
      ],
      expectedMediaLabels: ['VIDEO 1'],
    },
    {
      id: 'prototype-series',
      paragraphs: [
        'I then fabricated a series of socket prototypes with different design parameters (Fig. 7) and conducted fitting trials with volunteers with congenital limb deficiencies (Video 2).',
      ],
      expectedMediaLabels: ['FIG. 7', 'VIDEO 2'],
    },
    {
      id: 'findings',
      paragraphs: [
        'The trials indicated that the finger-trap mechanism could function directly on a residual limb: increasing axial tension reduced the socket’s diameter, compressed soft tissue and appeared to improve suspension. However, this response was effective over only a limited load range.',
        'The trials also revealed soft tissue pinching between the strips, socket pistoning and incomplete recovery of the original shape after unloading.',
        'These findings support the feasibility of the mechanism while identifying areas for further development. In future iterations, I plan to explore nylon or PEBA in combination with a mechanism that amplifies axial tension, to assess whether this combination can address some of the observed limitations. The design of the proximal rim and its role in securing the socket require further investigation.',
      ],
      expectedMediaLabels: [],
    },
  ],
};
