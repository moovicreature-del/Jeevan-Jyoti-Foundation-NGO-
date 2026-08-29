import sharp from 'sharp';
import fs from 'fs';

// Precise vector path for Yogi in Padmasana with hands resting palms-up on knees (Dhyana / Gyan Mudra)
const yogiPath = `
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M 250,136 C 264,136 274,148 274,164 C 274,178 266,189 256,192 L 256,204 C 274,206 294,214 308,226 C 324,240 338,260 348,282 C 353,293 349,301 338,304 C 328,306 317,302 312,295 C 316,303 328,311 346,316 C 358,320 357,330 344,338 C 324,350 288,358 250,358 C 212,358 176,350 156,338 C 143,330 142,320 154,316 C 172,311 184,303 188,295 C 183,302 172,306 162,304 C 151,301 147,293 152,282 C 162,260 176,240 192,226 C 206,214 226,206 244,204 L 244,192 C 234,189 226,178 226,164 C 226,148 236,136 250,136 Z M 241,215 C 222,224 204,238 194,258 C 186,274 196,285 212,285 C 224,285 233,277 236,260 C 238,245 239,228 241,215 Z M 259,215 C 261,228 262,245 264,260 C 267,277 276,285 288,285 C 304,285 314,274 306,258 C 296,238 278,224 259,215 Z"
  />
`;

const officialSvgContent = `<svg width="800" height="800" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Top curved text path for JEEVAN JYOTI FOUNDATION -->
    <path id="jjfTextArc" d="M 68,250 A 182,182 0 1,1 432,250" fill="none" />
  </defs>

  <!-- 1. Yellow Background Circle with Outer Royal Blue Border -->
  <circle cx="250" cy="250" r="238" fill="#FFEE00" stroke="#0028A8" stroke-width="7.5"/>

  <!-- 2. Arched Typography: JEEVAN JYOTI FOUNDATION in Royal Blue -->
  <text fill="#0028A8" font-family="system-ui, -apple-system, 'Arial Black', Impact, sans-serif" font-weight="900" font-size="34.5" letter-spacing="3.8">
    <textPath href="#jjfTextArc" startOffset="50%" text-anchor="middle">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- 3. Concentric Orange Halo Arch -->
  <circle cx="250" cy="250" r="165" fill="none" stroke="#FF5D00" stroke-width="28"/>

  <!-- 4. 5 Radiating Sun Rays (Orange #FF5D00) -->
  <g fill="#FF5D00">
    <!-- Top vertical ray -->
    <polygon points="250,105 256,170 244,170" />
    <!-- Top right ray -->
    <polygon points="340,140 306,188 294,178" />
    <!-- Bottom right ray -->
    <polygon points="378,212 340,232 336,218" />
    <!-- Top left ray -->
    <polygon points="160,140 206,178 194,188" />
    <!-- Bottom left ray -->
    <polygon points="122,212 164,218 160,232" />
  </g>

  <!-- 5. Meditating Yogi Figure in Padmasana with Hands on Knees (Indigo Navy #35366A) -->
  <g fill="#35366A">
    ${yogiPath}
  </g>

  <!-- 6. Twin Botanical Bright Green Leaves (#00E600) with White Curved Accents -->
  <!-- Left Leaf -->
  <path
    d="M 250,490 
       C 180,420 65,396 22,348 
       C 72,328 166,342 220,388 
       C 238,406 248,442 250,490 Z"
    fill="#00E600"
  />

  <!-- Left Leaf White Curved Accent Highlight -->
  <path
    d="M 244,468 C 204,406 130,366 45,348"
    stroke="#FFFFFF"
    stroke-width="7"
    stroke-linecap="round"
    fill="none"
    opacity="0.98"
  />

  <!-- Right Leaf -->
  <path
    d="M 250,490 
       C 320,420 435,396 478,348 
       C 428,328 334,342 280,388 
       C 262,406 252,442 250,490 Z"
    fill="#00E600"
  />

  <!-- Right Leaf White Curved Accent Highlight -->
  <path
    d="M 256,468 C 296,406 370,366 455,348"
    stroke="#FFFFFF"
    stroke-width="7"
    stroke-linecap="round"
    fill="none"
    opacity="0.98"
  />

  <!-- Center Botanical Leaf Stem & Tip Junction -->
  <path
    d="M 246,492 C 246,432 250,380 250,370 C 250,380 254,432 254,492 Z"
    fill="#00B800"
  />
</svg>`;

async function syncAllAssets() {
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', officialSvgContent);
  fs.writeFileSync('public/favicon.svg', officialSvgContent);

  const pngBuffer = await sharp(Buffer.from(officialSvgContent))
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.png', pngBuffer);
  fs.writeFileSync('src/assets/jeevan_jyoti_logo.png', pngBuffer);

  const jpgBuffer = await sharp(pngBuffer)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 98 })
    .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.jpg', jpgBuffer);

  console.log('Successfully updated logo with exact authentic hands-on-knees meditation mudra!');
}

syncAllAssets();
