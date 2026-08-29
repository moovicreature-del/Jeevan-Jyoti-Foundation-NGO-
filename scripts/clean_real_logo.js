import sharp from 'sharp';
import fs from 'fs';

async function processRealLogo() {
  const inputPath = 'src/assets/images/jeevan_jyoti_official_logo_1786867551425.jpg';
  
  // Read image with alpha channel
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  // Copy data to modify
  const cleaned = Buffer.from(data);

  // Helper to get/set pixel
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

  function isYellow(r, g, b) {
    return r > 180 && g > 160 && b < 100;
  }

  function isGreen(r, g, b) {
    return g > 110 && r < 100 && b < 100;
  }

  function isDark(r, g, b) {
    return r < 110 && g < 110 && b < 140;
  }

  // 1. Clean stray dark artifacts in the yellow region (especially y between 580 and 850)
  const yellowColor = [254, 218, 0]; // Authentic vibrant yellow #FEDA00

  for (let y = 580; y < 850; y++) {
    for (let x = 100; x < width - 100; x++) {
      const [r, g, b] = getPixel(x, y);

      // If this pixel is dark (stray speckle)
      if (isDark(r, g, b)) {
        // Count surrounding yellow vs green vs dark
        let yellowCount = 0;
        let greenCount = 0;
        const radius = 8;
        
        for (let dy = -radius; dy <= radius; dy += 2) {
          for (let dx = -radius; dx <= radius; dx += 2) {
            const [nr, ng, nb] = getPixel(x + dy, y + dx);
            if (isYellow(nr, ng, nb)) yellowCount++;
            if (isGreen(nr, ng, nb)) greenCount++;
          }
        }

        // If it is an isolated speckle inside or next to yellow region
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

  // 2. Remove white outer background and make it transparent, keeping the circular border and leaves perfectly intact
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed corners and edges
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

    // If it's background white / near white
    if (r > 225 && g > 225 && b > 225) {
      cleaned[idx + 3] = 0; // Make transparent

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

  // Clean any leftover stray pixels in the outer transparent margin
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const dx = x - 512;
      const dy = y - 485;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Outside circle and above leaves (leaves are at bottom: y > 650)
      if (dist > 488 && y < 650) {
        cleaned[idx + 3] = 0;
      }
    }
  }

  // Save the high quality clean transparent PNG
  const cleanPngBuffer = await sharp(cleaned, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.png', cleanPngBuffer);
  fs.writeFileSync('src/assets/jeevan_jyoti_logo.png', cleanPngBuffer);

  // Save high quality JPG version with pure white background
  const cleanJpgBuffer = await sharp(cleaned, {
    raw: { width, height, channels: 4 }
  })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .jpeg({ quality: 98 })
  .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.jpg', cleanJpgBuffer);

  // Create an SVG wrapper that embeds the clean high-resolution real logo image directly as base64!
  const base64Png = cleanPngBuffer.toString('base64');
  const svgWrapper = `<svg width="100%" height="100%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="1024" height="1024" href="data:image/png;base64,${base64Png}" preserveAspectRatio="xMidYMid meet" />
</svg>`;

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', svgWrapper);
  fs.writeFileSync('public/favicon.svg', svgWrapper);

  console.log('Real Logo cleaned and generated successfully in all formats!');
}

processRealLogo();
