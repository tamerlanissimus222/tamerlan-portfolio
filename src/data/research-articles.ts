export interface ResearchArticleMedia {
  kind: 'image' | 'video';
  src: string;
  label: string;
  alt: string;
  poster?: string;
}

export interface ResearchArticleBlock {
  id: string;
  paragraphs: string[];
  media: ResearchArticleMedia[];
}

export interface ResearchArticleData {
  id: string;
  label: string;
  blocks: ResearchArticleBlock[];
}

const image = (file: string, label: string, alt: string): ResearchArticleMedia => ({
  kind: 'image',
  src: `media/research/setka/images/${file}`,
  label,
  alt,
});

const video = (number: number, alt: string): ResearchArticleMedia => {
  const file = String(number).padStart(2, '0');
  return {
    kind: 'video',
    src: `media/research/setka/videos/video-${file}.mp4`,
    poster: `media/research/setka/videos/video-${file}.jpg`,
    label: `Video ${number}`,
    alt,
  };
};

export const setkaArticle: ResearchArticleData = {
  id: 'setka',
  label: 'Setka development article',
  blocks: [
    {
      id: 'concept',
      paragraphs: [
        'Conventional fixed-volume prosthetic sockets have limited ability to accommodate changes in residual limb volume caused by swelling, weight fluctuations, muscle changes or growth. A socket that adapts to these changes and responds to mechanical loading could improve comfort and function across daily activities and sport.',
        'This project explores the concept of a dynamic prosthetic socket based on the mechanical principle of a Chinese finger trap (Figs. 1 and 2).',
      ],
      media: [
        image('fig1.png', 'Fig. 1', 'Chinese finger trap held between two hands'),
        image('fig2.png', 'Fig. 2', 'Finger-trap braid and diagram of its changing geometry under axial loading'),
      ],
    },
    {
      id: 'early-prototypes',
      paragraphs: [
        'I first analysed the finger trap’s mechanics and explored how an FDM-printed structure could reproduce its mechanical response. Early prototypes used diamond-patterned lattices rather than an interwoven braid, but only partially reproduced the desired response (Figs. 3a and 3b; Video 1).',
      ],
      media: [
        image('fig3a.png', 'Fig. 3a', 'CAD studies of several diamond-patterned lattice structures'),
        image('fig3b.jpg', 'Fig. 3b', 'Four early lattice socket prototypes'),
        video(1, 'Mechanical response of an early FDM-printed lattice prototype'),
      ],
    },
    {
      id: 'parametric-braid',
      paragraphs: [
        'To reproduce the mechanism more closely, I turned to a braided structure. After establishing that the braid could be FDM-printed (Figs. 4a and 4b), I developed a parametric modelling algorithm for a braided cylinder with adjustable diameter, height, braid angle, strip width and thickness (Figs. 5a–5c).',
      ],
      media: [
        image('fig4a.jpg', 'Fig. 4a', 'First braided strip being printed'),
        image('fig4b.jpg', 'Fig. 4b', 'Braided strip during FDM printing'),
        image('fig5a.jpg', 'Fig. 5a', 'Braided cylindrical prototype on the printer bed'),
        image('fig5b.png', 'Fig. 5b', 'Braided cylinder during 3D printing'),
        image('fig5c.png', 'Fig. 5c', 'Printed braided cylinders with different dimensions'),
      ],
    },
    {
      id: 'initial-testing',
      paragraphs: [
        'For initial testing, I printed a cylindrical braided prototype in TPU with a Shore hardness of 60D, sized to fit my clenched fist as a simplified model of a bulbous residual limb (Fig. 6; Video 2). I then adapted the form to the contours of a residual limb (Figs. 7a and 7b; Videos 3 and 4).',
      ],
      media: [
        image('fig6.png', 'Fig. 6', 'Cylindrical braided prototype for initial fitting'),
        video(2, 'Initial test of the cylindrical braided prototype'),
        image('fig7a.jpg', 'Fig. 7a', 'Residual-limb form alongside the developing braided CAD model'),
        image('fig7b.png', 'Fig. 7b', 'CAD stages of the limb-adapted braided socket'),
        video(3, 'Limb-adapted braided socket test, first view'),
        video(4, 'Limb-adapted braided socket test, second view'),
      ],
    },
    {
      id: 'pretension',
      paragraphs: [
        'This initial fitting highlighted the need for close contact even without external loading. For the limb-adapted braid, I modified its resting geometry to introduce pre-tension when donned. In its resting state, the redesigned socket approximated the earlier prototype under tension (Figs. 8a and 8b; Videos 5–7). This produced a closer fit against the skin; additional axial tension reduced the socket’s diameter and increased circumferential compression.',
      ],
      media: [
        image('fig8a.png', 'Fig. 8a', 'CAD sequence used to modify the socket’s resting geometry'),
        image('fig8b.jpg', 'Fig. 8b', 'Comparison of braided socket prototypes'),
        video(5, 'Pre-tensioned braided socket test, first view'),
        video(6, 'Pre-tensioned braided socket test, second view'),
        video(7, 'Pre-tensioned braided socket test, third view'),
      ],
    },
    {
      id: 'prototype-series',
      paragraphs: [
        'I then fabricated a series of socket prototypes with different design parameters (Fig. 9) and conducted fitting trials with volunteers with congenital limb deficiencies (Videos 8–10). The strongest response is shown in Video 7, potentially because its material properties and braided-strip dimensions were better matched.',
      ],
      media: [
        image('fig9.png', 'Fig. 9', 'Two braided socket prototypes with different strip dimensions'),
        video(8, 'Fitting trial of a braided socket, first view'),
        video(9, 'Fitting trial of a braided socket, second view'),
        video(10, 'Fitting trial of a braided socket, third view'),
      ],
    },
    {
      id: 'findings',
      paragraphs: [
        'The trials indicated that the finger-trap mechanism could function directly on a residual limb: increasing axial tension reduced the socket’s diameter, compressed soft tissue and appeared to improve suspension. However, this response was effective over only a limited load range.',
        'The trials also revealed soft tissue pinching between the strips, socket pistoning and incomplete recovery of the original shape after unloading.',
        'These findings support the feasibility of the mechanism while identifying areas for further development. In future iterations, I plan to explore nylon or PEBA in combination with a mechanism that amplifies axial tension, to assess whether this combination can address some of the observed limitations. The design of the proximal rim and its role in securing the socket require further investigation.',
      ],
      media: [],
    },
  ],
};
