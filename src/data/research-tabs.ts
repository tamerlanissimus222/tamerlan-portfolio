import { centerOfMassImages, type ResearchGalleryImage } from './research-galleries';
import { setkaArticle, type ResearchArticleData } from './research-articles';

interface ResearchTab {
  id: string;
  label: string;
  /** Research content filename without its extension. Omit for an empty draft tab. */
  projectId?: string;
  images?: ResearchGalleryImage[];
  article?: ResearchArticleData;
}

// Array order is the visible tab order. Add projectId when a draft has its own content.
export const researchTabs: ResearchTab[] = [
  { id: 'distal', label: 'distal', projectId: '01-socket-platform' },
  { id: 'setka', label: 'setka', article: setkaArticle },
  { id: 'center-of-mass', label: 'Center of mass', images: centerOfMassImages },
  { id: 'sport-holder', label: 'sport Holder' },
  { id: 'cybathletic', label: 'cybathletic' },
];
