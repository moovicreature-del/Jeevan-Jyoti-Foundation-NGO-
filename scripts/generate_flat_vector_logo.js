import sharp from 'sharp';
import fs from 'fs';

// 400x400 SVG matching the exact attached logo
const exactLogoSvg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Text path for top arched text -->
    <path id="topTextArc" d="M 45,200 A 155,155 0 1,1 355,200" fill="none" />
  </defs>

  <!-- 1. Main Background Yellow Circle with Royal Blue Outer Border -->
  <circle cx="200" cy="200" r="195" fill="#FFE500" stroke="#0024B8" stroke-width="4.5" />

  <!-- 2. Arched Text: JEEVAN JYOTI FOUNDATION in Royal Blue -->
  <text fill="#0024B8" font-family="'Arial Black', 'Impact', 'Montserrat', sans-serif" font-weight="900" font-size="28.5" letter-spacing="3.2">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- 3. Thick Orange Half-Ring / Arch -->
  <path d="M 68,260 A 136,136 0 0,1 332,260" fill="none" stroke="#FF6B00" stroke-width="26" stroke-linecap="round" />

  <!-- 4. 5 Sharp Triangular Sun Rays radiating from behind the Yogi -->
  <g fill="#FF6B00">
    <!-- Top vertical ray -->
    <polygon points="200,80 205,155 195,155" />
    <!-- Top-Right diagonal ray -->
    <polygon points="275,108 214,165 206,158" />
    <!-- Mid-Right horizontal ray -->
    <polygon points="305,170 216,178 214,170" />
    <!-- Top-Left diagonal ray -->
    <polygon points="125,108 194,158 186,165" />
    <!-- Mid-Left horizontal ray -->
    <polygon points="95,170 186,170 184,178" />
  </g>

  <!-- 5. Central Silhouette: Meditating Yogi in Dark Slate Blue/Purple -->
  <g fill="#363963">
    <!-- Head -->
    <ellipse cx="200" cy="132" rx="14" ry="20" />
    
    <!-- Torso, Arms on knees in Dhyana Mudra, and Crossed Legs (Padmasana) -->
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M 194,150 C 192,154 186,162 178,168 C 168,176 150,198 140,224 C 134,238 128,245 120,248 C 114,250 114,256 122,258 C 132,260 142,254 150,246 C 158,252 170,258 185,260 C 172,268 152,268 136,260 C 128,256 122,260 126,268 C 134,282 165,288 200,288 C 235,288 266,282 274,268 C 278,260 272,256 264,260 C 248,268 228,268 215,260 C 230,258 242,252 250,246 C 258,254 268,260 278,258 C 286,256 286,250 280,248 C 272,245 266,238 260,224 C 250,198 232,176 222,168 C 214,162 208,154 206,150 Z M 195,175 C 185,188 174,206 166,228 C 160,244 170,250 180,248 C 190,246 193,235 194,220 C 195,204 195,188 195,175 Z M 205,175 C 205,188 205,204 206,220 C 207,235 210,246 220,248 C 230,250 240,244 234,228 C 226,206 215,188 205,175 Z"
    />
  </g>

  <!-- 6. Bottom Leaves: Bright Vibrant Green with White Highlights & Pointed Base -->
  <!-- Left Leaf -->
  <path
    d="M 200,398 C 160,345 70,325 22,290 C 60,268 135,274 180,312 C 194,324 200,350 200,398 Z"
    fill="#00E600"
  />
  <!-- Left Leaf White Highlight Arc -->
  <path
    d="M 194,375 C 162,328 105,296 45,285"
    stroke="#FFFFFF"
    stroke-width="6.5"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Right Leaf -->
  <path
    d="M 200,398 C 240,345 330,325 378,290 C 340,268 265,274 220,312 C 206,324 200,350 200,398 Z"
    fill="#00E600"
  />
  <!-- Right Leaf White Highlight Arc -->
  <path
    d="M 206,375 C 238,328 295,296 355,285"
    stroke="#FFFFFF"
    stroke-width="6.5"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Center Downward Tip Joint -->
  <polygon points="200,400 193,375 207,375" fill="#00C800" />
</svg>`;

async function generateAll() {
  console.log('Generating exact logo assets from specification...');

  // Save SVG
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', exactLogoSvg);
  fs.writeFileSync('public/favicon.svg', exactLogoSvg);

  // Generate PNGs at high res (1024x1024)
  const svgBuffer = Buffer.from(exactLogoSvg);

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile('public/assets/jeevan_jyoti_logo.png');

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile('src/assets/jeevan_jyoti_logo.png');

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 95 })
    .toFile('public/assets/jeevan_jyoti_logo.jpg');

  console.log('Successfully generated all logo files!');
}

generateAll().catch(console.error);
