import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const mediaItem = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const externalModel = z.object({
  label: z.string(),
  url: z.url(),
  description: z.string().optional(),
  thumbnail: mediaItem.optional(),
});

const workflowMediaDisplay = {
  order: z.number().int().optional(),
  role: z.enum(['standard', 'featured', 'compact', 'primary']).optional(),
  aspect: z.enum(['portrait', 'square', 'landscape', 'wide']).optional(),
  fit: z.enum(['contain', 'cover']).optional(),
  objectFit: z.enum(['contain', 'cover']).optional(),
  objectPosition: z.string().regex(/^(?:(?:left|center|right|top|bottom)|(?:\d{1,3}(?:\.\d+)?%))(?:\s+(?:(?:left|center|right|top|bottom)|(?:\d{1,3}(?:\.\d+)?%)))?$/).optional(),
  scale: z.number().min(0.75).max(1.3).optional(),
  tileSpan: z.union([z.literal(1), z.literal(2)]).optional(),
  aspectRatio: z.string().regex(/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/).optional(),
};

const workflowMedia = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('image'),
    src: z.string(),
    alt: z.string(),
    caption: z.string(),
    ...workflowMediaDisplay,
  }),
  z.object({
    type: z.literal('carousel'),
    slides: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string(),
    })).min(2),
    caption: z.string(),
    autoplayMs: z.number().int().min(1000).max(10000).optional(),
    ...workflowMediaDisplay,
  }),
  z.object({
    type: z.literal('youtube'),
    youtubeId: z.string(),
    poster: z.string(),
    alt: z.string(),
    caption: z.string(),
    ...workflowMediaDisplay,
  }),
  z.object({
    type: z.literal('model3d'),
    embedUrl: z.url(),
    poster: z.string(),
    alt: z.string(),
    caption: z.string(),
    ...workflowMediaDisplay,
  }),
  z.object({
    type: z.literal('localVideo'),
    src: z.string(),
    poster: z.string(),
    alt: z.string(),
    caption: z.string(),
    ...workflowMediaDisplay,
  }),
]);

const workflowStage = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.enum(['scan', 'cad', 'printer', 'fit', 'measure', 'assembly', 'test']),
  notes: z.array(z.string()).default([]),
  validation: z.boolean().default(false),
  media: z.array(workflowMedia).default([]),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    eyebrow: z.string(),
    level: z.string(),
    context: z.string(),
    challenge: z.string(),
    approach: z.string(),
    technicalNotes: z.array(z.string()).default([]),
    validation: z.object({
      status: z.string(),
      summary: z.string(),
    }),
    tags: z.array(z.string()),
    stages: z.array(workflowStage).min(1),
    placeholder: z.boolean().default(false),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    status: z.enum(['Experimental', 'Prototype', 'Validated', 'Production']),
    problem: z.string(),
    hypothesis: z.string(),
    development: z.string(),
    result: z.string(),
    tags: z.array(z.string()),
    images: z.array(mediaItem).default([]),
    models: z.array(externalModel).default([]),
    placeholder: z.boolean().default(false),
  }),
});

const otherWork = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/other-work' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    category: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    image: mediaItem.optional(),
    model: externalModel.optional(),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { cases, research, 'other-work': otherWork };
