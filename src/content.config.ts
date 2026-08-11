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

const videoItem = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: mediaItem.optional(),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    eyebrow: z.string(),
    context: z.string(),
    challenge: z.string(),
    reasoning: z.string(),
    iterations: z.array(z.object({ label: z.string(), summary: z.string() })),
    result: z.string(),
    tags: z.array(z.string()),
    featuredImage: mediaItem,
    gallery: z.array(mediaItem).default([]),
    models: z.array(externalModel).default([]),
    videos: z.array(videoItem).default([]),
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
