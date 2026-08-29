import sharp from 'sharp';
import fs from 'fs';

async function generateGoldEmbossedLogo() {
  const inputPng = 'src/assets/images/jeevan_jyoti_official_logo_1786867551425.jpg';
  
  // 1. Process base image: remove black stray artifacts and make outer background transparent
  const { data, info } = await sharp(inputPng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  const cleaned = Buffer.from(data);

  function getPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return [255, 255, 255, 0];
    const idx = (y * width + x) * channels;
    return [cleaned[idx], cleaned[idx + 1], cleaned[idx + 2], cleaned[idx + 3]];
  }

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * channels;
    cleaned[idx] = r;
    cleaned[idx + 1] = g;
    cleaned[idx + 2] = b;
    cleaned[idx + 3] = a;
  }

  // Clean stray dark speckles in yellow
  const yellowColor = [254, 218, 0];
  for (let y = 580; y < 850; y++) {
    for (let x = 100; x < width - 100; x++) {
      const [r, g, b] = getPixel(x, y);
      if (r < 110 && g < 110 && b < 140) {
        let yellowCount = 0;
        let greenCount = 0;
        const radius = 8;
        for (let dy = -radius; dy <= radius; dy += 2) {
          for (let dx = -radius; dx <= radius; dx += 2) {
            const [nr, ng, nb] = getPixel(x + dy, y + dx);
            if (nr > 180 && ng > 160 && nb < 100) yellowCount++;
            if (ng > 110 && nr < 100 && nb < 100) greenCount++;
          }
        }
        if (yellowCount > 15 && greenCount < 10) {
          const isLeftStray = x > 150 && x < 400 && y > 640 && y < 780;
          const isRightStray = x > 620 && x < 870 && y > 640 && y < 780;
          const isBottomStray = y > 680 && y < 820 && (x < 460 || x > 560);
          if (isLeftStray || isRightStray || isBottomStray) {
            setPixel(x, y, yellowColor[0], yellowColor[1], yellowColor[2], 255);
          }
        }
      }
    }
  }

  // Remove outer background (flood fill transparency)
  const visited = new Uint8Array(width * height);
  const queue = [];
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[y * width] = 1;
    visited[y * width + width - 1] = 1;
  }

  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const idx = (cy * width + cx) * channels;
    const r = cleaned[idx];
    const g = cleaned[idx + 1];
    const b = cleaned[idx + 2];

    if (r > 225 && g > 225 && b > 225) {
      cleaned[idx + 3] = 0;
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            const [nr, ng, nb] = getPixel(nx, ny);
            if (nr > 210 && ng > 210 && nb > 210) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
  }

  // Clean margin transparency outside circle
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const dx = x - 512;
      const dy = y - 485;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 492 && y < 650) {
        cleaned[idx + 3] = 0;
      }
    }
  }

  const baseCleanPng = await sharp(cleaned, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  // Create an SVG overlay with an authentic embossed 3D Gold Circular Ring (गोल्ड उभार सर्कल)
  const cx = 512;
  const cy = 485;
  const rOuter = 485;
  const ringWidth = 14;

  const goldRingSvg = Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Rich Metallic 24K Gold Gradient with Multi-stop Lustre -->
      <linearGradient id="goldRimGrad" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FFF9C4" />
        <stop offset="20%" stop-color="#FFD54F" />
        <stop offset="45%" stop-color="#FFA000" />
        <stop offset="70%" stop-color="#FFC107" />
        <stop offset="85%" stop-color="#FFE082" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>

      <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="40%" stop-color="#FFD54F" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#78350F" stop-opacity="0.8" />
      </linearGradient>
    </defs>

    <!-- 1. Outer Deep Gold Shadow Edge -->
    <circle cx="${cx}" cy="${cy}" r="${rOuter + 3}" fill="none" stroke="#78350F" stroke-width="4" opacity="0.5" />
    
    <!-- 2. Primary 3D Embossed Gold Band -->
    <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="url(#goldRimGrad)" stroke-width="${ringWidth}" />

    <!-- 3. Top-Left Bevel Highlight (3D Raised Emboss / उभार Effect) -->
    <path d="M ${cx - rOuter},${cy} A ${rOuter},${rOuter} 0 0,1 ${cx + rOuter},${cy}" fill="none" stroke="#FFFDE7" stroke-width="3" stroke-linecap="round" opacity="0.9" />
    
    <!-- 4. Bottom-Right Bevel Shadow Groove -->
    <path d="M ${cx - rOuter},${cy} A ${rOuter},${rOuter} 0 0,0 ${cx + rOuter},${cy}" fill="none" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" opacity="0.8" />

    <!-- 5. Inner Concentric Delicate Gold Rim Highlight -->
    <circle cx="${cx}" cy="${cy}" r="${rOuter - ringWidth / 2 - 2}" fill="none" stroke="#FFE082" stroke-width="2" opacity="0.95" />
    <circle cx="${cx}" cy="${cy}" r="${rOuter + ringWidth / 2 + 1}" fill="none" stroke="#B45309" stroke-width="1.5" opacity="0.6" />
  </svg>`);

  // Composite the base clean logo with the gold embossed circle
  const logoWithGold = await sharp(baseCleanPng)
    .composite([
      {
        input: goldRingSvg,
        top: 0,
        left: 0
      }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.png', logoWithGold);
  fs.writeFileSync('src/assets/jeevan_jyoti_logo.png', logoWithGold);

  // High quality JPG version
  const jpgWithGold = await sharp(logoWithGold)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 98 })
    .toBuffer();
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.jpg', jpgWithGold);

  // High quality SVG wrapper
  const base64 = logoWithGold.toString('base64');
  const svgContent = `<svg width="100%" height="100%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="1024" height="1024" href="data:image/png;base64,${base64}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', svgContent);
  fs.writeFileSync('public/favicon.svg', svgContent);

  console.log('Successfully generated authentic logo with 3D embossed gold circle and transparent background!');
}

generateGoldEmbossedLogo();
