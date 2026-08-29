import React from 'react';
import { Heart, Award, ShieldCheck, BookOpen, Utensils, Activity, Sparkles } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';
import { BrandLogo } from './common/BrandLogo';

interface Props {
  onOpenDonate: () => void;
  onOpenVolunteerPortal: () => void;
}

export const HeroSection: React.FC<Props> = ({ onOpenDonate, onOpenVolunteerPortal }) => {
  const { t, isHindi } = useLanguage();
  const { content } = useHomeContent();

  const displayTitle = content.heroTitle || (isHindi ? FOUNDATION_INFO.nameHindi : FOUNDATION_INFO.nameEnglish);
  const displaySubtitle = content.heroSubtitle || t(
    'hero.desc',
    'ग़ाज़ीपुर के ग्रामीण व मलिन बस्तियों के निर्धन बच्चों को निःशुल्क गुणवत्तापूर्ण शिक्षा, निराश्रितों को अन्नपूर्णा भोजन सेवा, स्वास्थ्य शिविर एवं सामाजिक स्वावलंबन हेतु समर्पित संस्था।',
    'A dedicated NGO empowering rural communities through free evening schools, daily meals, medical camps & women skill hubs in Ghazipur.'
  );

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-red-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Slogan & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Government Registered Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDE7] border border-yellow-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-xs font-black text-black uppercase tracking-wider">
                {t('hero.badge', 'Govt. Registered NGO (UP/2018/0207700) • 80G Certified', 'Govt. Registered NGO (UP/2018/0207700) • 80G Certified')}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight font-['Cinzel',serif]">
              {displayTitle}
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#8B0000] mt-1 font-sans">
                {isHindi ? FOUNDATION_INFO.nameEnglish : 'Ghazipur, Uttar Pradesh, India'}
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-bold text-amber-900 font-serif">
              &quot;{t('hero.tagline', FOUNDATION_INFO.taglineHindi, FOUNDATION_INFO.taglineEnglish)}&quot;
            </p>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl font-medium">
              {displaySubtitle}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenDonate}
                className="px-7 py-3.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{t('hero.btn_donate', 'सहयोग / दान करें (Get 80G Receipt)', 'Donate Now (Get 80G Tax Receipt)')}</span>
              </button>

              <button
                onClick={onOpenVolunteerPortal}
                className="px-6 py-3.5 bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-400 font-bold rounded-2xl text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-600" />
                <span>{t('hero.btn_volunteer', 'स्वयंसेवक बनें / प्रमाण पत्र प्राप्त करें', 'Join as Volunteer / Get Certificate')}</span>
              </button>
            </div>


            {/* Micro Pillars Strip */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-amber-200">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                <BookOpen className="w-5 h-5 text-amber-700 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-black text-gray-900">{t('hero.strip_edu', 'शिक्षा सेवा', 'Education Support')}</div>
                  <div className="text-[10px] text-gray-600">{t('hero.strip_edu_sub', 'निःशुल्क पाठशाला', 'Free Evening Schools')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                <Utensils className="w-5 h-5 text-red-700 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-black text-gray-900">{t('hero.strip_food', 'अन्नपूर्णा सेवा', 'Annapurna Seva')}</div>
                  <div className="text-[10px] text-gray-600">{t('hero.strip_food_sub', 'भोजन व राशन किट', 'Meals & Ration Kits')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                <Activity className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-black text-gray-900">{t('hero.strip_health', 'स्वास्थ्य रक्षा', 'Healthcare Camps')}</div>
                  <div className="text-[10px] text-gray-600">{t('hero.strip_health_sub', 'निःशुल्क चिकित्सा', 'Free Medical Camps')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#8B0000] text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                GHAZIPUR (UP)
              </div>

              <div className="text-center space-y-4 pt-2">
                <div className="flex flex-col items-center justify-center">
                  <BrandLogo size={140} className="mx-auto drop-shadow-md transform hover:scale-105 transition-transform duration-300" id="hero-brand-logo" />
                  
                  {/* Official Motto */}
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100/90 border border-amber-300 shadow-2xs">
                    <span className="text-xs sm:text-sm font-black tracking-widest text-[#008000] uppercase">
                      • SEWA • SHIKSHA • SWASTHYA •
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#3F2B96] font-['Cinzel'] tracking-tight">
                    {isHindi ? FOUNDATION_INFO.nameHindi : FOUNDATION_INFO.nameEnglish}
                  </h3>
                  <a
                    href="https://maps.app.goo.gl/72kFrETKbmiKA3gv7"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-orange-600 transition-colors mt-0.5"
                    title="View on Google Maps"
                  >
                    <span>📍 {t('hero.card_location', 'ग्राम मीरानपुर, मोहम्मदाबाद, गाजीपुर, उत्तर प्रदेश, भारत - 233303 (DIGIPIN 2J6T226CL2)', 'Village Miranpur, Mohammadabad, Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)')}</span>
                  </a>
                </div>

                {/* Registration Data Grid */}
                <div className="bg-[#FFFDE7] p-3.5 rounded-2xl border border-yellow-300 text-left text-xs text-black font-extrabold space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8B0000]">Registration No:</span>
                    <span>{FOUNDATION_INFO.regNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B0000]">NITI Aayog UID:</span>
                    <span>{FOUNDATION_INFO.nitiAayogUid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B0000]">Income Tax 80G:</span>
                    <span>{FOUNDATION_INFO.urn80G}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B0000]">{isHindi ? 'प्रबंधक / सचिव:' : 'Manager / Secretary:'}</span>
                    <span>{FOUNDATION_INFO.presidentName}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-600 font-bold border-t border-gray-100">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    {t('hero.card_verified', '100% पारदर्शी व सत्यापित', '100% Transparent & Verified')}
                  </span>
                  <span>Helpline: {FOUNDATION_INFO.phone}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
