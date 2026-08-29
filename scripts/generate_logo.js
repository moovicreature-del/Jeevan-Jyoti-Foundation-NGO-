import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

// Exact specifications:
// Dimensions: 1024 x 1024
// Center: (512, 460) for the main circle so leaves fit perfectly at the bottom (total height ~ 1000px)
// Outer Circle Radius: ~ 440px
// Inner Sun Radius: ~ 320px
// Colors:
// - Outer Border & Text: #2E2E8F (Deep Indigo Blue)
// - Main Background & Sun: #FFD700 (Bright Sun Gold/Yellow)
// - Arch & Sun Rays: #FF8C00 (Vibrant Pure Orange)
// - Meditator Silhouette: #4B5563 (Dark Slate Grey / Purple Tint #48485E)
// - Green Leaves: #16A34A / #009E49 (Vibrant Emerald / Leaf Green)

const createLogoSvg = () => {
  // Center coordinates of the circle
  const cx = 512;
  const cy = 470;
  const rOuter = 440;
  const strokeWidth = 14;
  
  // Arch parameters
  const rArchOuter = 370;
  const rArchInner = 310;
  
  // Text along arc
  const textPathRadius = 395;
  
  // Sun rays emanate from (cx, cy)
  // Let's create rays at angles:
  // Top: -90 deg (270)
  // Top-Right: -55 deg
  // Right-Up: -20 deg
  // Right-Down: 15 deg
  // Left-Down: 165 deg
  // Left-Up: 200 deg
  // Top-Left: 235 deg
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Text Path along top arc: from ~195deg to ~-15deg (or left to right over top) -->
    <path id="textArc" d="M ${cx - textPathRadius * Math.cos(Math.PI * 0.08)},${cy + textPathRadius * Math.sin(Math.PI * 0.08)} 
      A ${textPathRadius} ${textPathRadius} 0 1 1 ${cx + textPathRadius * Math.cos(Math.PI * 0.08)},${cy + textPathRadius * Math.sin(Math.PI * 0.08)}" 
      fill="none" />
      
    <style>
      .logo-text {
        font-family: 'Arial Black', 'Montserrat', 'Trebuchet MS', 'Impact', sans-serif;
        font-weight: 900;
        font-size: 58px;
        fill: #2E2E8F;
        letter-spacing: 0.12em;
      }
    </style>
  </defs>

  <!-- Group for whole logo -->
  <g id="jeevan-jyoti-logo">
    <!-- 1. Base Circular Badge (Yellow #FFD700 with Blue Stroke #2E2E8F) -->
    <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#FFD700" stroke="#2E2E8F" stroke-width="${strokeWidth}" />

    <!-- 2. Orange Semi-Circle / Arch Ring -->
    <!-- From left to right around the top half -->
    <path d="M ${cx - rArchOuter},${cy + 100} 
             A ${rArchOuter} ${rArchOuter} 0 0 1 ${cx + rArchOuter},${cy + 100}
             L ${cx + rArchInner},${cy + 100}
             A ${rArchInner} ${rArchInner} 0 0 0 ${cx - rArchInner},${cy + 100}
             Z" 
          fill="#FF8C00" />

    <!-- 3. Orange Sun Rays emanating behind meditator -->
    <g id="sun-rays" fill="#FF8C00">
      <!-- Top Ray -->
      <polygon points="${cx},${cy - 280} ${cx - 16},${cy - 80} ${cx + 16},${cy - 80}" />
      
      <!-- Top-Right 1 (~35 deg) -->
      <polygon points="${cx + 200},${cy - 180} ${cx + 40},${cy - 65} ${cx + 60},${cy - 40}" />
      
      <!-- Right-Up (~70 deg) -->
      <polygon points="${cx + 260},${cy - 40} ${cx + 65},${cy - 20} ${cx + 65},${cy + 10}" />
      
      <!-- Right-Down (~100 deg) -->
      <polygon points="${cx + 220},${cy + 75} ${cx + 60},${cy + 25} ${cx + 50},${cy + 55}" />

      <!-- Top-Left 1 (~-35 deg) -->
      <polygon points="${cx - 200},${cy - 180} ${cx - 60},${cy - 40} ${cx - 40},${cy - 65}" />
      
      <!-- Left-Up (~-70 deg) -->
      <polygon points="${cx - 260},${cy - 40} ${cx - 65},${cy + 10} ${cx - 65},${cy - 20}" />
      
      <!-- Left-Down (~-100 deg) -->
      <polygon points="${cx - 220},${cy + 75} ${cx - 50},${cy + 55} ${cx - 60},${cy + 25}" />
    </g>

    <!-- 4. Curved Text: JEEVAN JYOTI FOUNDATION -->
    <text class="logo-text">
      <textPath href="#textArc" startOffset="50%" text-anchor="middle">
        JEEVAN JYOTI FOUNDATION
      </textPath>
    </text>

    <!-- 5. Centered Meditating Person (Lotus Pose Silhouette in Dark Grey/Purple #4B5563) -->
    <!-- Perfectly symmetrical vector path -->
    <g id="meditating-person" fill="#4B5563">
      <!-- Head -->
      <ellipse cx="${cx}" cy="${cy - 125}" rx="38" ry="52" />
      
      <!-- Neck, Torso, Arms & Lotus Legs -->
      <path d="
        M ${cx},${cy - 74}
        C ${cx + 14},${cy - 74} ${cx + 28},${cy - 52} ${cx + 45},${cy - 28}
        C ${cx + 60},${cy - 8} ${cx + 90},${cy + 25} ${cx + 125},${cy + 75}
        C ${cx + 160},${cy + 125} ${cx + 185},${cy + 162} ${cx + 195},${cy + 182}
        C ${cx + 205},${cy + 202} ${cx + 198},${cy + 218} ${cx + 172},${cy + 218}
        C ${cx + 145},${cy + 218} ${cx + 125},${cy + 195} ${cx + 90},${cy + 145}
        C ${cx + 72},${cy + 120} ${cx + 64},${cy + 120} ${cx + 62},${cy + 140}
        C ${cx + 60},${cy + 165} ${cx + 90},${cy + 210} ${cx + 145},${cy + 225}
        C ${cx + 190},${cy + 238} ${cx + 175},${cy + 278} ${cx + 120},${cy + 280}
        C ${cx + 70},${cy + 282} ${cx + 35},${cy + 245} ${cx},${cy + 240}
        C ${cx - 35},${cy + 245} ${cx - 70},${cy + 282} ${cx - 120},${cy + 280}
        C ${cx - 175},${cy + 278} ${cx - 190},${cy + 238} ${cx - 145},${cy + 225}
        C ${cx - 90},${cy + 210} ${cx - 60},${cy + 165} ${cx - 62},${cy + 140}
        C ${cx - 64},${cy + 120} ${cx - 72},${cy + 120} ${cx - 90},${cy + 145}
        C ${cx - 125},${cy + 195} ${cx - 145},${cy + 218} ${cx - 172},${cy + 218}
        C ${cx - 198},${cy + 218} ${cx - 205},${cy + 202} ${cx - 195},${cy + 182}
        C ${cx - 185},${cy + 162} ${cx - 160},${cy + 125} ${cx - 125},${cy + 75}
        C ${cx - 90},${cy + 25} ${cx - 60},${cy - 8} ${cx - 45},${cy - 28}
        C ${cx - 28},${cy - 52} ${cx - 14},${cy - 74} ${cx},${cy - 74}
        Z
      " />
    </g>

    <!-- 6. Bottom Green Leaves (#16A34A) -->
    <!-- Two symmetrical leaves meeting at bottom apex -->
    <g id="bottom-leaves">
      <!-- Left Leaf -->
      <path d="
        M ${cx},${cy + 490}
        C ${cx - 80},${cy + 410} ${cx - 220},${cy + 340} ${cx - 450},${cy + 230}
        C ${cx - 430},${cy + 370} ${cx - 290},${cy + 470} ${cx - 60},${cy + 470}
        C ${cx - 30},${cy + 470} ${cx - 10},${cy + 482} ${cx},${cy + 490}
        Z
      " fill="#16A34A" />

      <!-- Left Leaf Inner Accent / Cutout Shape -->
      <path d="
        M ${cx - 20},${cy + 460}
        C ${cx - 90},${cy + 420} ${cx - 200},${cy + 360} ${cx - 380},${cy + 260}
        C ${cx - 340},${cy + 350} ${cx - 220},${cy + 430} ${cx - 40},${cy + 445}
        Z
      " fill="#15803D" opacity="0.4" />

      <!-- Right Leaf -->
      <path d="
        M ${cx},${cy + 490}
        C ${cx + 80},${cy + 410} ${cx + 220},${cy + 340} ${cx + 450},${cy + 230}
        C ${cx + 430},${cy + 370} ${cx + 290},${cy + 470} ${cx + 60},${cy + 470}
        C ${cx + 30},${cy + 470} ${cx + 10},${cy + 482} ${cx},${cy + 490}
        Z
      " fill="#16A34A" />

      <!-- Right Leaf Inner Accent / Cutout Shape -->
      <path d="
        M ${cx + 20},${cy + 460}
        C ${cx + 90},${cy + 420} ${cx + 220},${cy + 360} ${cx + 380},${cy + 260}
        C ${cx + 340},${cy + 350} ${cx + 220},${cy + 430} ${cx + 40},${cy + 445}
        Z
      " fill="#15803D" opacity="0.4" />

      <!-- Central Stem Tip -->
      <path d="
        M ${cx - 15},${cy + 440}
        Q ${cx},${cy + 480} ${cx},${cy + 510}
        Q ${cx},${cy + 480} ${cx + 15},${cy + 440}
        Z
      " fill="#16A34A" />
    </g>
  </g>
</svg>`;
};

const svgContent = createLogoSvg();
fs.writeFileSync('test_logo.svg', svgContent);
console.log('test_logo.svg written');
