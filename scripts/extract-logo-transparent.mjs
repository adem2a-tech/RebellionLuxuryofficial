/**
 * Extrait le logo Rebellion Luxury : fond noir → transparent, recadrage serré.
 * Usage: node scripts/extract-logo-transparent.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'public', 'rebellion-luxury-logo.png');
const outputPath = join(root, 'public', 'rebellion-luxury-logo-transparent.png');

const BLACK_THRESHOLD = 45; // R,G,B en dessous = considéré comme fond noir

async function main() {
  const inputBuffer = readFileSync(inputPath);
  const image = sharp(inputBuffer);
  const { data: buf, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const ch = channels || 4;
  const data = new Uint8Array(buf);

  for (let i = 0; i < data.length; i += ch) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0; // transparent
    }
  }

  // Bounding box des pixels non transparents
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * ch;
      if (data[i + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  let cropWidth = maxX - minX + 1;
  let cropHeight = maxY - minY + 1;
  if (cropWidth < 1 || cropHeight < 1 || minX > maxX) {
    cropWidth = width;
    cropHeight = height;
    minX = minY = 0;
    maxX = width - 1;
    maxY = height - 1;
  }

  const cropped = new Uint8Array(cropWidth * cropHeight * ch);
  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      const srcI = ((minY + y) * width + (minX + x)) * ch;
      const dstI = (y * cropWidth + x) * ch;
      cropped[dstI] = data[srcI];
      cropped[dstI + 1] = data[srcI + 1];
      cropped[dstI + 2] = data[srcI + 2];
      cropped[dstI + 3] = data[srcI + 3];
    }
  }

  const rawOptions = { width: cropWidth, height: cropHeight, channels: 4 };
  const outBuffer = Buffer.from(cropped);
  if (outBuffer.length === 0) throw new Error('Buffer vide après recadrage');
  await sharp(outBuffer, { raw: rawOptions })
    .png()
    .toFile(outputPath);

  console.log('Logo extrait avec fond transparent:', outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
