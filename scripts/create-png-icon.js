/**
 * Generates a 256x256 PNG icon for LC Pro using ONLY Node.js builtins.
 * No external dependencies (sharp, canvas, etc.) required.
 * 
 * Run: node scripts/create-png-icon.js
 * 
 * Creates: build/icon.png, public/icon.png
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZE = 256;
const BUILD_DIR = path.join(__dirname, '..', 'build');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// ─── CRC32 ──────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ─── PNG Chunk Builder ──────────────────────────────────────────────
function createChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcValue = Buffer.alloc(4);
  crcValue.writeUInt32BE(crc32(crcInput));
  
  return Buffer.concat([length, typeBytes, data, crcValue]);
}

// ─── Color Helpers ──────────────────────────────────────────────────
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function colorGradient(x, y) {
  const t = (x + y) / (SIZE * 2);
  // Gradient: #1e40af → #2563eb → #3b82f6
  const r = lerp(30, 59, t);
  const g = lerp(64, 130, t);
  const b = lerp(175, 246, t);
  return [r, g, b];
}

// ─── Rounded Rectangle SDF ─────────────────────────────────────────
function roundedRectSDF(px, py, cx, cy, hw, hh, radius) {
  const dx = Math.max(Math.abs(px - cx) - hw + radius, 0);
  const dy = Math.max(Math.abs(py - cy) - hh + radius, 0);
  return Math.sqrt(dx * dx + dy * dy) - radius;
}

// ─── Simple Bitmap Font (5x7 pixel font for "LC") ──────────────────
const FONT = {
  'L': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'C': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
};

function drawChar(pixels, ch, startX, startY, scale, r, g, b) {
  const glyph = FONT[ch];
  if (!glyph) return;
  for (let gy = 0; gy < 7; gy++) {
    for (let gx = 0; gx < 5; gx++) {
      if (glyph[gy][gx]) {
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = startX + gx * scale + sx;
            const py = startY + gy * scale + sy;
            if (px >= 0 && px < SIZE && py >= 0 && py < SIZE) {
              const idx = (py * SIZE + px) * 4;
              pixels[idx] = r;
              pixels[idx + 1] = g;
              pixels[idx + 2] = b;
              pixels[idx + 3] = 255;
            }
          }
        }
      }
    }
  }
}

// ─── Document Shape Helper ──────────────────────────────────────────
function isInsideDocument(px, py, x, y, w, h, foldSize, radius) {
  // Check main body (with fold cut)
  if (px >= x && px <= x + w && py >= y && py <= y + h) {
    // Check corner fold area
    if (px > x + w - foldSize && py < y + foldSize) {
      // Diagonal line from (x+w-foldSize, y) to (x+w, y+foldSize)
      const dx = px - (x + w - foldSize);
      const dy = py - y;
      if (dx > foldSize - dy) return false;
    }
    // Rounded bottom corners
    const corners = [[x + radius, y + h - radius], [x + w - radius, y + h - radius]];
    for (const [cx, cy] of corners) {
      const ddx = px - cx;
      const ddy = py - cy;
      if (ddy > 0 && ((px < cx && ddx < 0) || (px > cx && ddx > 0))) {
        if (ddx * ddx + ddy * ddy > radius * radius) return false;
      }
    }
    return true;
  }
  return false;
}

// ─── Generate Pixels ────────────────────────────────────────────────
function generateIconPixels() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4, 0); // RGBA

  const center = SIZE / 2;
  const bgHalfSize = SIZE / 2 - 16; // padding 16px
  const bgRadius = 48;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4;
      
      // Distance to rounded square background
      const dist = roundedRectSDF(x, y, center, center, bgHalfSize, bgHalfSize, bgRadius);
      
      if (dist < 0) {
        // Inside the rounded square — draw gradient background
        const [r, g, b] = colorGradient(x, y);
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = 255;
        
        // Shine overlay (top half lighter)
        if (y < center) {
          const shineAmount = (1 - y / center) * 0.15;
          pixels[idx] = Math.min(255, r + Math.round(255 * shineAmount));
          pixels[idx + 1] = Math.min(255, g + Math.round(255 * shineAmount));
          pixels[idx + 2] = Math.min(255, b + Math.round(255 * shineAmount));
        }
      } else if (dist < 1.5) {
        // Anti-aliased edge
        const alpha = Math.max(0, Math.round(255 * (1 - dist / 1.5)));
        const [r, g, b] = colorGradient(x, y);
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = alpha;
      }
    }
  }

  // ─── Draw Main Document ─────────────────────────────────────────
  const docX = 66, docY = 52, docW = 100, docH = 128;
  const foldSize = 22;
  
  for (let y = docY; y <= docY + docH; y++) {
    for (let x = docX; x <= docX + docW; x++) {
      if (isInsideDocument(x, y, docX, docY, docW, docH, foldSize, 6)) {
        const idx = (y * SIZE + x) * 4;
        pixels[idx] = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
        pixels[idx + 3] = 240; // slightly transparent
      }
    }
  }

  // Document fold triangle (lighter blue)
  for (let y = docY; y < docY + foldSize; y++) {
    for (let x = docX + docW - foldSize; x <= docX + docW; x++) {
      const dx = x - (docX + docW - foldSize);
      const dy = y - docY;
      if (dx >= foldSize - dy && dx <= foldSize && dy <= foldSize) {
        const idx = (y * SIZE + x) * 4;
        pixels[idx] = 191;  // #bfdbfe
        pixels[idx + 1] = 219;
        pixels[idx + 2] = 254;
        pixels[idx + 3] = 200;
      }
    }
  }

  // Document lines
  const lines = [
    { y: docY + 30, w: 72 },
    { y: docY + 42, w: 55 },
    { y: docY + 54, w: 64 },
    { y: docY + 66, w: 44 },
  ];
  for (const line of lines) {
    for (let ly = line.y; ly < line.y + 5; ly++) {
      for (let lx = docX + 14; lx < docX + 14 + line.w; lx++) {
        if (ly >= 0 && ly < SIZE && lx >= 0 && lx < SIZE) {
          const idx = (ly * SIZE + lx) * 4;
          pixels[idx] = 147;  // #93c5fd
          pixels[idx + 1] = 197;
          pixels[idx + 2] = 253;
          pixels[idx + 3] = 140;
        }
      }
    }
  }

  // Amount box on document
  const boxX = docX + 14, boxY = docY + 84, boxW = 72, boxH = 28;
  for (let y = boxY; y < boxY + boxH; y++) {
    for (let x = boxX; x < boxX + boxW; x++) {
      const idx = (y * SIZE + x) * 4;
      const isEdge = y === boxY || y === boxY + boxH - 1 || x === boxX || x === boxX + boxW - 1;
      if (isEdge) {
        pixels[idx] = 147; pixels[idx + 1] = 197; pixels[idx + 2] = 253; pixels[idx + 3] = 180;
      } else {
        pixels[idx] = 219; pixels[idx + 1] = 234; pixels[idx + 2] = 254; pixels[idx + 3] = 160;
      }
    }
  }

  // ─── Second Document Behind (offset) ────────────────────────────
  const doc2X = docX + 18, doc2Y = docY + 16;
  for (let y = doc2Y; y <= doc2Y + docH; y++) {
    for (let x = doc2X; x <= doc2X + docW; x++) {
      // Only draw where main document doesn't cover
      if (!isInsideDocument(x, y, docX, docY, docW, docH, foldSize, 6)) {
        if (x >= doc2X && x <= doc2X + docW && y >= doc2Y && y <= doc2Y + docH) {
          const idx = (y * SIZE + x) * 4;
          // Only draw if we're inside the background
          if (pixels[idx + 3] > 0) {
            pixels[idx] = Math.min(255, pixels[idx] + 60);
            pixels[idx + 1] = Math.min(255, pixels[idx + 1] + 60);
            pixels[idx + 2] = Math.min(255, pixels[idx + 2] + 60);
          }
        }
      }
    }
  }

  // ─── Green Checkmark Circle ─────────────────────────────────────
  const checkCX = 178, checkCY = 164, checkR = 24;
  for (let y = checkCY - checkR - 2; y <= checkCY + checkR + 2; y++) {
    for (let x = checkCX - checkR - 2; x <= checkCX + checkR + 2; x++) {
      if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) continue;
      const dx = x - checkCX, dy = y - checkCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * SIZE + x) * 4;
      if (dist <= checkR) {
        pixels[idx] = 34;   // #22c55e
        pixels[idx + 1] = 197;
        pixels[idx + 2] = 94;
        pixels[idx + 3] = 255;
      } else if (dist < checkR + 1.5) {
        const alpha = Math.round(255 * (1 - (dist - checkR) / 1.5));
        pixels[idx] = 34;
        pixels[idx + 1] = 197;
        pixels[idx + 2] = 94;
        pixels[idx + 3] = Math.max(pixels[idx + 3], alpha);
      }
    }
  }

  // Checkmark path (white)
  const checkPoints = [
    [checkCX - 10, checkCY],
    [checkCX - 3, checkCY + 8],
    [checkCX + 12, checkCY - 8],
  ];
  // Draw thick lines between the checkmark points
  function drawThickLine(x0, y0, x1, y1, thickness) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x0 + (x1 - x0) * t;
      const cy = y0 + (y1 - y0) * t;
      for (let dy = -thickness; dy <= thickness; dy++) {
        for (let dx = -thickness; dx <= thickness; dx++) {
          if (dx * dx + dy * dy <= thickness * thickness) {
            const px = Math.round(cx + dx);
            const py = Math.round(cy + dy);
            if (px >= 0 && px < SIZE && py >= 0 && py < SIZE) {
              const idx = (py * SIZE + px) * 4;
              pixels[idx] = 255;
              pixels[idx + 1] = 255;
              pixels[idx + 2] = 255;
              pixels[idx + 3] = 255;
            }
          }
        }
      }
    }
  }
  drawThickLine(checkPoints[0][0], checkPoints[0][1], checkPoints[1][0], checkPoints[1][1], 2.5);
  drawThickLine(checkPoints[1][0], checkPoints[1][1], checkPoints[2][0], checkPoints[2][1], 2.5);

  // ─── "LC" Text Badge ────────────────────────────────────────────
  // White rounded rectangle badge
  const badgeX = 56, badgeY = 194, badgeW = 48, badgeH = 26, badgeR = 6;
  for (let y = badgeY; y < badgeY + badgeH; y++) {
    for (let x = badgeX; x < badgeX + badgeW; x++) {
      const d = roundedRectSDF(x, y, badgeX + badgeW / 2, badgeY + badgeH / 2, badgeW / 2, badgeH / 2, badgeR);
      if (d < 0) {
        const idx = (y * SIZE + x) * 4;
        pixels[idx] = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
        pixels[idx + 3] = 240;
      }
    }
  }

  // Draw "LC" text in the badge
  const charScale = 2;
  const textStartX = badgeX + 6;
  const textStartY = badgeY + 6;
  drawChar(pixels, 'L', textStartX, textStartY, charScale, 30, 64, 175);
  drawChar(pixels, 'C', textStartX + 14, textStartY, charScale, 30, 64, 175);

  return pixels;
}

// ─── Build PNG File ─────────────────────────────────────────────────
function buildPNG(width, height, rgbaPixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type (RGBA)
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT — image data
  // Add filter byte (0 = None) at start of each row
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // filter type: None
    rgbaPixels.copy(rawData, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }
  
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// ─── Main ───────────────────────────────────────────────────────────
console.log('🎨 LC Pro — Generating PNG icon (no external dependencies)...\n');

// Ensure directories exist
[BUILD_DIR, PUBLIC_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const pixels = generateIconPixels();
const pngBuffer = buildPNG(SIZE, SIZE, pixels);

const buildIconPath = path.join(BUILD_DIR, 'icon.png');
const publicIconPath = path.join(PUBLIC_DIR, 'icon.png');

fs.writeFileSync(buildIconPath, pngBuffer);
fs.writeFileSync(publicIconPath, pngBuffer);

console.log(`  ✅ build/icon.png  (${pngBuffer.length} bytes, ${SIZE}x${SIZE})`);
console.log(`  ✅ public/icon.png (${pngBuffer.length} bytes, ${SIZE}x${SIZE})`);
console.log('\n✨ Icon generation complete!');
console.log('\n💡 Pour de meilleures icônes (ICO pour Windows):');
console.log('   npm install sharp png-to-ico --save-dev');
console.log('   node scripts/generate-icons.js');
