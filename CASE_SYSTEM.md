# Reusable prosthetic case system

The portfolio renders every prosthetic case from the Astro `cases` content collection. There is no page component tied to Case 01, Case 02, or Case 03.

## Where things live

- `src/content/cases/*.md` — one editable content file per case.
- `src/content/cases/_case-data-example.yml` — documented field and media examples; Astro does not publish it.
- `src/components/CaseStudy.astro` — shared case shell.
- `src/components/CaseContext.astro` — shared context, technical notes, validation, and tags.
- `src/components/WorkflowBoard.astro` and `WorkflowStage.astro` — shared variable-length workflow.
- `src/components/MediaPreview.astro` and `MediaLightbox.astro` — shared image, video, YouTube, and 3D media viewer.
- `src/components/CaseNavigation.astro` and `src/scripts/cases.ts` — generated selector plus automatic previous/next/persistent navigation.
- `src/content.config.ts` — the editable data schema.

## Add Case 04

1. Add the new media files under `public/media/...`.
2. Create `src/content/cases/04-short-case-name.md`.
3. Copy the fields from `_case-data-example.yml` between Markdown frontmatter markers:

   ```md
   ---
   order: 4
   title: "Case title"
   # ...the remaining fields and stages...
   ---
   ```

4. Save the file. The `04` selector and automatic navigation appear without editing a component.

## Reorder cases

Change `order` in the case files. The collection is sorted by that field in `src/pages/index.astro`; selectors, current/total status, PREVIOUS CASE, NEXT CASE, and the final ALL CASES action all follow that sorted result.

Keep each `order` unique. Renaming the file itself does not control display order.

## Reorder or change media

Inside a stage, either move the YAML media blocks into the required reading order or set optional numeric `order` values. The first four items are shown in the overview, and any remaining items are available through VIEW MORE. Add or remove media blocks freely; no empty symmetry tiles are generated.

All tiles use the same systematic `standard` size by default. Use optional `role: featured` or `role: compact` only when a real editorial difference is intended. The legacy `primary` value remains accepted, but new cases should use `featured`.

Presentation is controlled entirely in the media data:

- `order`: numeric media order inside its stage; source order is the fallback.
- `type`: `image`, `carousel`, `youtube`, `model3d`, or `localVideo`.
- `role`: `standard` (default), `featured`, or `compact`.
- `objectFit`: `contain` (default) or `cover`.
- `objectPosition`: CSS-style focal position such as `50% 35%` or `center top`.
- `scale`: zoom inside the unchanged tile, from `0.75` to `1.3`.
- `tileSpan`: `1` or `2` columns.
- `aspectRatio`: optional explicit ratio such as `4 / 3`; omit it for the systematic default height.

For `type: carousel`, add at least two entries under `slides`. Each slide has its own `src`, `alt`, and `caption`. `autoplayMs` controls the interval (Case 01 uses `2000`); manual previous/next controls are generated automatically, and autoplay is disabled when the visitor prefers reduced motion.

This means changing crop, focal point, zoom, width, type, and order never requires editing a component. The older `fit` and `aspect` fields remain readable for existing content, but `objectFit` and `aspectRatio` are the preferred controls for new cases.

Supported media `type` values are:

- `image`
- `carousel`
- `youtube`
- `model3d`
- `localVideo`

## Add, remove, or reorder workflow stages

Move, add, or remove whole entries under `stages`. Stage numbers, the external process rail, and the mobile sequence are calculated from the resulting array length. Each desktop stage grows to fit its own media composition, so stages with different media quantities do not need matching heights or empty tiles.

Each stage needs a unique `id`, a `title`, and an `icon`. Available icons are `scan`, `cad`, `printer`, `fit`, `measure`, `assembly`, and `test`. `notes`, `validation`, and `media` are optional. Set `validation: true` only on the stage that should reuse the case-level validation status.

## Navigation derivation

`src/pages/index.astro` loads and sorts the full collection once. `CaseNavigation.astro` and `CaseStudy.astro` are generated from the same ordered array. The shared client script advances through those generated controls, so it always knows the actual previous case, next case, final case, and total count. Selecting another case resets the viewer to the top of the new case instead of retaining the previous case's scroll position.
