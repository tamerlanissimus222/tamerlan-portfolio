export type WorkflowIconName = 'scan' | 'cad' | 'printer' | 'fit' | 'measure' | 'assembly' | 'test';
export type WorkflowMediaRole = 'standard' | 'featured' | 'compact' | 'primary';
export type WorkflowMediaAspect = 'portrait' | 'square' | 'landscape' | 'wide';
export type WorkflowMediaFit = 'contain' | 'cover';

export type WorkflowCarouselSlide = {
  src: string;
  alt: string;
  caption: string;
};

type WorkflowMediaDisplay = {
  order?: number;
  role?: WorkflowMediaRole;
  aspect?: WorkflowMediaAspect;
  fit?: WorkflowMediaFit;
  objectFit?: WorkflowMediaFit;
  objectPosition?: string;
  scale?: number;
  tileSpan?: 1 | 2;
  aspectRatio?: string;
};

export type WorkflowMedia = WorkflowMediaDisplay & (
  | {
      type: 'image';
      src: string;
      alt: string;
      caption: string;
    }
  | {
      type: 'carousel';
      slides: WorkflowCarouselSlide[];
      caption: string;
      autoplayMs?: number;
    }
  | {
      type: 'youtube';
      youtubeId: string;
      poster: string;
      alt: string;
      caption: string;
    }
  | {
      type: 'model3d';
      embedUrl: string;
      poster: string;
      alt: string;
      caption: string;
    }
  | {
      type: 'localVideo';
      src: string;
      poster: string;
      alt: string;
      caption: string;
    }
);

export interface WorkflowStageData {
  id: string;
  title: string;
  icon: WorkflowIconName;
  notes: string[];
  validation: boolean;
  media: WorkflowMedia[];
}
