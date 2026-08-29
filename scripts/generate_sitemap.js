import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the official Foundation portal (configurable via environment variable)
const BASE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://jeevanjyotifoundation.org').replace(/\/$/, '');

// Static & Core Interactive Public Routes
const CORE_ROUTES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    title: 'Jeevan Jyoti Foundation Ghazipur | Official Home',
    titleHi: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर | आधिकारिक मुख्य पृष्ठ'
  },
  {
    path: '/#about',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'About Foundation | Reg. No: GAZ/03373 | NITI Aayog: UP/2018/0207700',
    titleHi: 'संस्था परिचय एवं पंजीकरण विवरण'
  },
  {
    path: '/#pillars',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Core Mission Pillars: Education, Healthcare, Food Relief & Social Welfare',
    titleHi: 'सेवा के चार स्तंभ: शिक्षा, स्वास्थ्य, भोजन एवं स्वावलम्बन'
  },
  {
    path: '/#official-forms',
    priority: '0.95',
    changefreq: 'daily',
    title: '5 Official Public Application & Registration Portals',
    titleHi: '5 आधिकारिक ऑनलाइन आवेदन एवं पंजीकरण फॉर्म'
  },
  {
    path: '/#forms-volunteer',
    priority: '0.9',
    changefreq: 'daily',
    title: 'Volunteer & Swayam Sewak Registration Portal',
    titleHi: 'स्वयंसेवक एवं समाज सेवी पंजीकरण'
  },
  {
    path: '/#forms-blood',
    priority: '0.9',
    changefreq: 'daily',
    title: 'Emergency Blood Donation & Donor Registry',
    titleHi: 'आपातकालीन रक्तदान एवं रक्तदाता पंजीकरण'
  },
  {
    path: '/#forms-medical',
    priority: '0.9',
    changefreq: 'daily',
    title: 'Medical Assistance & Emergency Health Aid Request',
    titleHi: 'चिकित्सा सहायता एवं आपातकालीन स्वास्थ्य सेवा'
  },
  {
    path: '/#forms-education',
    priority: '0.9',
    changefreq: 'daily',
    title: 'Child Education Sponsorship & Educational Kit Support',
    titleHi: 'बाल शिक्षा सहायता एवं स्कूल किट छात्रवृत्ति'
  },
  {
    path: '/#forms-ration',
    priority: '0.9',
    changefreq: 'daily',
    title: 'Food Distribution & Family Ration Aid Request',
    titleHi: 'राशन सहायता एवं भोजन वितरण अनुरोध'
  },
  {
    path: '/#verification',
    priority: '0.95',
    changefreq: 'hourly',
    title: 'Live QR & Database Certificate Verification Portal',
    titleHi: 'डिजिटल प्रमाण पत्र एवं पहचान पत्र सत्यापन पोर्टल'
  },
  {
    path: '/#festivals',
    priority: '0.85',
    changefreq: 'weekly',
    title: 'Festival Greetings & Spiritual Blessings Certificate Generator',
    titleHi: 'त्यौहार शुभकामना एवं आध्यात्मिक आशीर्वाद प्रमाण पत्र'
  },
  {
    path: '/#impact',
    priority: '0.85',
    changefreq: 'daily',
    title: 'Live Social Impact Metrics & District Ghazipur Analytics',
    titleHi: 'लाइव सामाजिक प्रभाव एवं कार्य प्रगति'
  },
  {
    path: '/#volunteers',
    priority: '0.8',
    changefreq: 'daily',
    title: 'Dedicated Volunteer Honor Roll & Leaderboard',
    titleHi: 'सक्रिय स्वयंसेवक सम्मान एवं लीडरबोर्ड'
  },
  {
    path: '/#donations',
    priority: '0.8',
    changefreq: 'daily',
    title: 'Donors Wall of Fame & 80G Contribution Recognition',
    titleHi: 'दानदाता सम्मान पट्टिका (Wall of Fame)'
  },
  {
    path: '/#location',
    priority: '0.75',
    changefreq: 'monthly',
    title: 'Headquarters Location, Mohammadabad Ghazipur Map & Coverage',
    titleHi: 'कार्यालय पता, मोहम्मदाबाद ग़ाज़ीपुर'
  },
  {
    path: '/#contact',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Official Helpline (+91-8052361666) & Contact Directory',
    titleHi: 'हेल्पलाइन एवं संपर्क सूत्र'
  },
  {
    path: '/?action=donate',
    priority: '0.95',
    changefreq: 'daily',
    title: '80G Tax Exemption Online Donation Portal',
    titleHi: '80G आयकर छूट ऑनलाइन दान पोर्टल'
  },
  {
    path: '/?action=my-donations',
    priority: '0.85',
    changefreq: 'daily',
    title: 'Donor Dashboard & 80G Tax Exemption Receipts Retrieval',
    titleHi: 'दानदाता डैशबोर्ड एवं 80G रसीद डाउनलोड'
  },
  {
    path: '/?action=download-certificates',
    priority: '0.95',
    changefreq: 'hourly',
    title: 'Citizen Certificate & ID Card Download Center with OTP Verification',
    titleHi: 'प्रमाण पत्र एवं पहचान पत्र डाउनलोड केंद्र'
  },
  {
    path: '/?action=annual-report',
    priority: '0.75',
    changefreq: 'monthly',
    title: 'Official Transparency & Annual Governance Report',
    titleHi: 'वार्षिक लेखा-जोखा एवं पारदर्शिता रिपोर्ट'
  }
];

// Active Verified Certificates & Direct Public Verification URLs
const SAMPLE_CERTIFICATE_IDS = [
  'JJF-VOL-2026-01',
  'JJF-ID-2026-01',
  'JJF-80G-2026-01',
  'JJF-TASK-2026-01',
  'JJF-FEST-2026-01',
  'JJF/VOL/2026/08/01',
  'JJF/80G/2026/08/01',
  'JJF/ID/2026/08/01',
  'JJF-VOL-2026-101',
  'JJF-VOL-2026-102',
  'JJF-VOL-2026-103'
];

/**
 * Generate XML string for sitemap
 */
export function generateSitemapXml(customBaseUrl = BASE_URL, extraCertIds = []) {
  const baseUrl = customBaseUrl.replace(/\/$/, '');
  const todayIso = new Date().toISOString().split('T')[0];

  const allCertIds = Array.from(new Set([...SAMPLE_CERTIFICATE_IDS, ...extraCertIds]));

  const dynamicCertRoutes = allCertIds.map((certId) => ({
    path: `/?verify=${encodeURIComponent(certId)}`,
    priority: '0.7',
    changefreq: 'monthly',
    title: `Official Certificate Verification: ${certId}`,
    titleHi: `आधिकारिक प्रमाण पत्र सत्यापन: ${certId}`
  }));

  const allUrls = [...CORE_ROUTES, ...dynamicCertRoutes];

  const xmlEntries = allUrls.map((item) => {
    const fullUrl = `${baseUrl}${item.path}`;
    return `  <url>
    <loc>${fullUrl.replace(/&/g, '&amp;')}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <xhtml:link rel="alternate" hreflang="hi" href="${fullUrl.replace(/&/g, '&amp;')}" />
    <xhtml:link rel="alternate" hreflang="en" href="${fullUrl.replace(/&/g, '&amp;')}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${fullUrl.replace(/&/g, '&amp;')}" />
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Jeevan Jyoti Foundation Ghazipur (Reg: GAZ/03373 | NITI Aayog: UP/2018/0207700) -->
  <!-- Generated dynamically on ${new Date().toISOString()} -->
${xmlEntries.join('\n')}
</urlset>
`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(customBaseUrl = BASE_URL) {
  const baseUrl = customBaseUrl.replace(/\/$/, '');
  return `# Robots.txt for Jeevan Jyoti Foundation Ghazipur
# Reg. No: GAZ/03373 | NITI Aayog: UP/2018/0207700
# Official Website: ${baseUrl}

User-agent: *
Allow: /
Allow: /#*
Allow: /?*
Allow: /api/certificates/*
Allow: /api/verify/*

# Disallow internal admin actions
Disallow: /api/admin/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * Main execution function to write sitemap.xml and robots.txt to public/ and dist/
 */
export async function writeSitemapFiles() {
  const publicDir = path.resolve(__dirname, '../public');
  const distDir = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = generateSitemapXml();
  const robotsTxt = generateRobotsTxt();

  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  const publicRobotsPath = path.join(publicDir, 'robots.txt');

  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf8');
  fs.writeFileSync(publicRobotsPath, robotsTxt, 'utf8');

  console.log(`[Sitemap Generator] Successfully generated:`);
  console.log(` - ${publicSitemapPath} (${CORE_ROUTES.length + SAMPLE_CERTIFICATE_IDS.length} URLs)`);
  console.log(` - ${publicRobotsPath}`);

  // If dist directory exists, write there as well
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
    console.log(` - Synced to ${distDir}/sitemap.xml and robots.txt`);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeSitemapFiles()
    .then(() => {
      console.log('[Sitemap Generator] Complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Sitemap Generator Error]:', err);
      process.exit(1);
    });
}
