import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(
  process.env.USERPROFILE ?? '',
  'OneDrive',
  'Рабочий стол',
  'Portfolio',
  'Case 2 Kornev',
  'Scanning',
);
const destinationRoot = path.join(projectRoot, 'public', 'media', 'case2-originals');

const assets = [
  ['IMG_20260317_180353.jpg', 'scanning-reference-01.jpg'],
  ['IMG_20260317_180359.jpg', 'scanning-reference-02.jpg'],
  ['IMG_20260317_180409.jpg', 'scanning-reference-03.jpg'],
];

await mkdir(destinationRoot, { recursive: true });

for (const [sourceName, destinationName] of assets) {
  const source = path.join(sourceRoot, sourceName);
  const destination = path.join(destinationRoot, destinationName);

  await sharp(source)
    .rotate()
    .resize({ width: 4000, height: 4000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4', progressive: true })
    .toFile(destination);

  console.log(`${sourceName} -> public/media/case2-originals/${destinationName}`);
}
