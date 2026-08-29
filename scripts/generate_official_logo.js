import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

/**
 * Recreates the Jeevan Jyoti Foundation Ghazipur Master Logo in exact original form:
 * - Shape: Perfect circle badge with bottom leaf crest
 * - Outer Ring: Bright Sun Yellow #FFD700 with Blue Border #2E2E8F
 * - Text: "JEEVAN JYOTI FOUNDATION" in bold uppercase blue #2E2E8F around top half
 * - Inner: Orange arch/ring #FF8C00 around a bright yellow sun #FFD700 with 8 orange sun rays
 * - Center: Dark grey/purple silhouette #4B5563 of a person in lotus meditation pose (centered)
 * - Bottom: Two green leaves #16A34A meeting at center below the circle
 * - Style: Clean, flat vector, no shadows, no gradients, no 3D
 * - Background: Transparent PNG
 * - Resolution: 1024x1024 high resolution, perfect symmetry & crisp edges
 */
export function buildMasterLogoSvg() {
  const cx = 512;
  const cy = 450;
  const rBadge = 430;
  const strokeWidth = 14;

  // Text Arc Radius
  const rText = 384;

  // Concentric Orange Arch Radii
  const rArchOuter = 345;
  const rArchInner = 285;

  // 8 Symmetrical Orange Sun Rays (45 deg increments)
  const rayAngles = [-90, -45, 0, 45, 90, 135, 180, 225];

  const raysSvg = rayAngles
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const tipLen = 295;
      const baseLen = 85;
      const spread = 0.085; // angular spread at ray base

      const tipX = cx + tipLen * Math.cos(rad);
      const tipY = cy + tipLen * Math.sin(rad);

      const b1X = cx + baseLen * Math.cos(rad - spread);
      const b1Y = cy + baseLen * Math.sin(rad - spread);

      const b2X = cx + baseLen * Math.cos(rad + spread);
      const b2Y = cy + baseLen * Math.sin(rad + spread);

      return `<polygon points="${tipX.toFixed(1)},${tipY.toFixed(1)} ${b1X.toFixed(1)},${b1Y.toFixed(1)} ${b2X.toFixed(1)},${b2Y.toFixed(1)}" />`;
    })
    .join('\n      ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Clockwise arc path for circular text across upper hemisphere -->
    <path id="textArcPath" d="M ${cx - rText * Math.cos(Math.PI * 0.05)},${cy + rText * Math.sin(Math.PI * 0.05)} 
      A ${rText} ${rText} 0 1 1 ${cx + rText * Math.cos(Math.PI * 0.05)},${cy + rText * Math.sin(Math.PI * 0.05)}" 
      fill="none" />
  </defs>

  <!-- Clean Transparent Canvas -->

  <g id="jeevan-jyoti-official-logo">
    <!-- 1. Outer Circle Badge (#FFD700 Base, #2E2E8F Border) -->
    <circle cx="${cx}" cy="${cy}" r="${rBadge}" fill="#FFD700" stroke="#2E2E8F" stroke-width="${strokeWidth}" />

    <!-- 2. Concentric Orange Arch (#FF8C00) in Upper Region -->
    <path d="
      M ${cx - rArchOuter * 0.98},${cy + rArchOuter * 0.2}
      A ${rArchOuter} ${rArchOuter} 0 1 1 ${cx + rArchOuter * 0.98},${cy + rArchOuter * 0.2}
      L ${cx + rArchInner * 0.98},${cy + rArchInner * 0.2}
      A ${rArchInner} ${rArchInner} 0 1 0 ${cx - rArchInner * 0.98},${cy + rArchInner * 0.2}
      Z
    " fill="#FF8C00" />

    <!-- 3. 8 Radiating Orange Sun Rays (#FF8C00) -->
    <g id="sun-rays" fill="#FF8C00">
      ${raysSvg}
    </g>

    <!-- 4. Text around Top Curve: JEEVAN JYOTI FOUNDATION (#2E2E8F) -->
    <text font-family="'Arial Black', 'Arial', 'Montserrat', 'Trebuchet MS', sans-serif" 
          font-weight="900" 
          font-size="62px" 
          fill="#2E2E8F" 
          letter-spacing="5px">
      <textPath href="#textArcPath" startOffset="50%" text-anchor="middle">
        JEEVAN JYOTI FOUNDATION
      </textPath>
    </text>

    <!-- 5. Person in Lotus Meditation Pose (#4B5563) -->
    <g id="meditator" fill="#4B5563">
      <!-- Head / Halo Silhouette -->
      <ellipse cx="${cx}" cy="${cy - 120}" rx="38" ry="50" />

      <!-- Neck, Torso, Arms in Dhyana Mudra and Crossed Lotus Legs -->
      <path d="
        M ${cx},${cy - 72}
        C ${cx + 15},${cy - 72} ${cx + 28},${cy - 52} ${cx + 42},${cy - 30}
        C ${cx + 58},${cy - 10} ${cx + 85},${cy + 25} ${cx + 120},${cy + 75}
        C ${cx + 150},${cy + 120} ${cx + 180},${cy + 155} ${cx + 192},${cy + 175}
        C ${cx + 204},${cy + 195} ${cx + 195},${cy + 215} ${cx + 172},${cy + 215}
        C ${cx + 148},${cy + 215} ${cx + 126},${cy + 190} ${cx + 94},${cy + 145}
        C ${cx + 74},${cy + 115} ${cx + 64},${cy + 120} ${cx + 62},${cy + 145}
        C ${cx + 60},${cy + 170} ${cx + 90},${cy + 210} ${cx + 145},${cy + 225}
        C ${cx + 188},${cy + 238} ${cx + 174},${cy + 276} ${cx + 120},${cy + 278}
        C ${cx + 70},${cy + 280} ${cx + 35},${cy + 242} ${cx},${cy + 238}
        C ${cx - 35},${cy + 238} ${cx - 70},${cy + 280} ${cx - 120},${cy + 278}
        C ${cx - 174},${cy + 276} ${cx - 188},${cy + 238} ${cx - 145},${cy + 225}
        C ${cx - 90},${cy + 210} ${cx - 60},${cy + 170} ${cx - 62},${cy + 145}
        C ${cx - 64},${cy + 120} ${cx - 74},${cy + 115} ${cx - 94},${cy + 145}
        C ${cx - 126},${cy + 190} ${cx - 148},${cy + 215} ${cx - 172},${cy + 215}
        C ${cx - 195},${cy + 215} ${cx - 204},${cy + 195} ${cx - 192},${cy + 175}
        C ${cx - 180},${cy + 155} ${cx - 150},${cy + 120} ${cx - 120},${cy + 75}
        C ${cx - 85},${cy + 25} ${cx - 58},${cy - 10} ${cx - 42},${cy - 30}
        C ${cx - 28},${cy - 52} ${cx - 15},${cy - 72} ${cx},${cy - 72}
        Z
      " />
    </g>

    <!-- 6. Bottom Green Leaves (#16A34A) -->
    <g id="bottom-leaves" fill="#16A34A">
      <!-- Left Leaf Outer Body -->
      <path d="
        M ${cx},${cy + 528}
        C ${cx - 50},${cy + 430} ${cx - 160},${cy + 340} ${cx - 430},${cy + 245}
        C ${cx - 410},${cy + 390} ${cx - 280},${cy + 480} ${cx - 50},${cy + 490}
        C ${cx - 25},${cy + 490} ${cx - 10},${cy + 510} ${cx},${cy + 528}
        Z
      " />

      <!-- Left Leaf Inner Accent -->
      <path d="
        M ${cx - 20},${cy + 482}
        C ${cx - 80},${cy + 430} ${cx - 180},${cy + 360} ${cx - 360},${cy + 280}
        C ${cx - 320},${cy + 370} ${cx - 200},${cy + 440} ${cx - 35},${cy + 465}
        Z
      " fill="#15803D" opacity="0.35" />

      <!-- Right Leaf Outer Body -->
      <path d="
        M ${cx},${cy + 528}
        C ${cx + 50},${cy + 430} ${cx + 160},${cy + 340} ${cx + 430},${cy + 245}
        C ${cx + 410},${cy + 390} ${cx + 280},${cy + 480} ${cx + 50},${cy + 490}
        C ${cx + 25},${cy + 490} ${cx + 10},${cy + 510} ${cx},${cy + 528}
        Z
      " />

      <!-- Right Leaf Inner Accent -->
      <path d="
        M ${cx + 20},${cy + 482}
        C ${cx + 80},${cy + 430} ${cx + 180},${cy + 360} ${cx + 360},${cy + 280}
        C ${cx + 320},${cy + 370} ${cx + 200},${cy + 440} ${cx + 35},${cy + 465}
        Z
      " fill="#15803D" opacity="0.35" />

      <!-- Central Stem Tip -->
      <polygon points="${cx},${cy + 545} ${cx - 16},${cy + 475} ${cx + 16},${cy + 475}" />
    </g>
  </g>
</svg>`;
}

async function generate() {
  const svg = buildMasterLogoSvg();
  
  // Write master SVGs
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', svg);
  fs.writeFileSync('public/jeevan_jyoti_logo.svg', svg);

  // Render to 1024x1024 PNG with Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1024,
    },
    background: 'rgba(0,0,0,0)', // Clean Transparent background
  });
  
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Write high quality PNG to all target locations
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.png', pngBuffer);
  fs.writeFileSync('public/jeevan_jyoti_logo.png', pngBuffer);
  fs.writeFileSync('src/assets/jeevan_jyoti_logo.png', pngBuffer);

  console.log('✅ Generated 1024x1024 high-resolution transparent master logo PNG and SVG files.');
}

generate().catch(console.error);
