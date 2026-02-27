/**
 * Script to generate Windows ICO icon and PNG files from SVG
 * Run: node scripts/generate-icons.js
 * 
 * Prerequisites: npm install sharp png-to-ico --save-dev
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SVG_PATH = path.join(__dirname, '..', 'build', 'icon.svg');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SIZES = [16, 24, 32, 48, 64, 128, 256, 512];

async function generateIcons() {
  console.log('🎨 Generating application icons...\n');

  const svgBuffer = fs.readFileSync(SVG_PATH);

  // Ensure directories exist
  [BUILD_DIR, PUBLIC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Generate PNGs for each size
  for (const size of SIZES) {
    const outputPath = path.join(BUILD_DIR, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✅ Generated ${size}x${size} PNG`);
  }

  // Main icon.png (256x256)
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(path.join(BUILD_DIR, 'icon.png'));
  console.log('  ✅ Generated icon.png (256x256)');

  // Copy to public for web use
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon.png'));
  console.log('  ✅ Copied icon.png to public/');

  // Generate splash image (wider format)
  await sharp(svgBuffer)
    .resize(128, 128)
    .png()
    .toFile(path.join(BUILD_DIR, 'splash-icon.png'));
  console.log('  ✅ Generated splash icon');

  // Generate ICO file using png-to-ico
  try {
    const { default: pngToIco } = await import('png-to-ico');
    const pngSizes = [16, 24, 32, 48, 64, 128, 256].map(s =>
      path.join(BUILD_DIR, `icon-${s}.png`)
    );
    const icoBuffer = await pngToIco(pngSizes);
    fs.writeFileSync(path.join(BUILD_DIR, 'icon.ico'), icoBuffer);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.ico'), icoBuffer);
    console.log('  ✅ Generated icon.ico');
  } catch {
    console.warn('  ⚠️  png-to-ico not available, using electron-builder icon conversion');
    console.warn('     Install with: npm install png-to-ico --save-dev');
  }

  console.log('\n✨ Icon generation complete!');
}

generateIcons().catch(console.error);
