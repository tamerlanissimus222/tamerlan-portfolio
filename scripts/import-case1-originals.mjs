import { Buffer } from 'node:buffer';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(
  process.env.USERPROFILE ?? '',
  'OneDrive',
  'Рабочий стол',
  'Portfolio',
  'Case 1 Pomyatihin',
);
const destinationRoot = path.join(projectRoot, 'public', 'media', 'case1-originals');

const assets = [
  ['Scanning/IMG_20260226_143733.jpg', 'scanning-reference-01.jpg', true],
  ['Scanning/IMG_20260226_143828.jpg', 'scanning-reference-02.jpg', true],
  ['Scanning/IMG_20260226_143848.jpg', 'scanning-reference-03.jpg', true],
  ['Scanning/Scan.png', 'scan-preview.png'],
  ['Scanning/Screenshot_1.png', 'modelling-process-preview.png'],
  ['Digital modelling/Screenshot_2.png', 'inner-socket-preview.png'],
  ['Digital modelling/Muscles OS.png', 'outer-socket-preview.png'],
  ['Digital modelling/ButerScreen.png', 'interface-study-preview.png'],
  ['Additive manufacturing/IMAGE 2026-05-20 16_05_43.jpg', 'manufacturing-assembly.jpg'],
  ['Additive manufacturing/IMAGE 2026-05-20 16_05_42.jpg', 'manufacturing-side.jpg'],
  ['Additive manufacturing/IMAGE 2026-05-20 16_05_37.jpg', 'manufacturing-rear.jpg'],
  ['Fitting  validation/preview.png', 'fitting-preview.png'],
];

const stripJpegPrivateMetadata = (buffer) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('Invalid JPEG source.');

  const parts = [buffer.subarray(0, 2)];
  let offset = 2;

  while (offset < buffer.length) {
    const markerStart = offset;
    if (buffer[offset] !== 0xff) {
      parts.push(buffer.subarray(offset));
      break;
    }

    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xda || marker === 0xd9) {
      parts.push(buffer.subarray(markerStart));
      break;
    }

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(buffer.subarray(markerStart, offset));
      continue;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    const segmentEnd = offset + segmentLength;
    const isPrivateMetadata = marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (!isPrivateMetadata) parts.push(buffer.subarray(markerStart, segmentEnd));
    offset = segmentEnd;
  }

  return Buffer.concat(parts);
};

await mkdir(destinationRoot, { recursive: true });

for (const [sourceRelative, destinationName, removePrivateMetadata = false] of assets) {
  const source = path.join(sourceRoot, ...sourceRelative.split('/'));
  const destination = path.join(destinationRoot, destinationName);

  if (removePrivateMetadata) {
    const sourceBuffer = await readFile(source);
    await writeFile(destination, stripJpegPrivateMetadata(sourceBuffer));
  } else {
    await copyFile(source, destination);
  }

  console.log(`${sourceRelative} -> public/media/case1-originals/${destinationName}`);
}
