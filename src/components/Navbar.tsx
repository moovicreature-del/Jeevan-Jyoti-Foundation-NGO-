import React, { useState } from 'react';
import { Heart, Award, ShieldCheck, Menu, X, Phone, Globe, QrCode, Lock } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './common/BrandLogo';

interface Props {
  onOpenDonate: () => void;
  onOpenReport: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenDonate, onOpenReport, onOpenAdmin }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-[#8B0000] text-white text-[11px] py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold flex items-center gap-1">
              <span>🇮🇳</span> Reg. No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid}
            </span>
            <span className="hidden md:inline text-amber-200">
              • 80G & 12A Certified NGO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a href={`tel:${FOUNDATION_INFO.phone}`} className="flex items-center gap-1 hover:text-amber-200">
              <Phone className="w-3 h-3" />
              <span>{FOUNDATION_INFO.phone}</span>
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 text-[10px] bg-red-950/80 hover:bg-red-900 text-amber-200 hover:text-white px-2 py-0.5 rounded border border-amber-500/30 transition-colors cursor-pointer font-bold"
                title="सुपर एडमिन एवं एडमिन पोर्टल लॉगिन"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>एडमिन पोर्टल</span>
              </button>
            )}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-2 py-0.5 bg-amber-800 hover:bg-amber-700 rounded text-[10px] font-bold text-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand: Organization Logo & Typography */}
        <a
          href="#"
          id="nav-brand-logo-link"
          className="flex items-center gap-3 group shrink-0 transition-transform duration-200 hover:scale-[1.01]"
        >
          <div
            id="nav-logo-animated-wrapper"
            className="relative shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
          >
            <BrandLogo size={46} className="drop-shadow-xs" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-black text-lg sm:text-xl text-[#3F2B96] tracking-tight leading-none font-['Cinzel',serif] group-hover:text-[#8B0000] transition-colors">
              JEEVAN JYOTI FOUNDATION
            </div>
            <div className="text-[11px] font-extrabold text-amber-700 leading-tight mt-0.5 tracking-wide">
              जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत
            </div>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-gray-800">
          <a href="#about" className="hover:text-[#8B0000] transition-colors">
            {t('nav.about', 'परिचय', 'About')}
          </a>
          <a href="#pillars" className="hover:text-[#8B0000] transition-colors">
            {t('nav.pillars', 'सेवा क्षेत्र', 'Pillars')}
          </a>
          <a href="#official-forms" className="hover:text-[#8B0000] transition-colors flex items-center gap-1 text-green-900 bg-green-100/90 px-2.5 py-1 rounded-xl border border-green-300">
            <span>📝</span>
            <span>5 ऑनलाइन फॉर्म (5 Forms)</span>
          </a>
          <a href="#festivals" className="hover:text-[#8B0000] transition-colors flex items-center gap-1 text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-xl border border-amber-300">
            <span>🪔</span>
            <span>त्यौहार शुभकामना</span>
          </a>
          <a href="#volunteers" className="hover:text-[#8B0000] transition-colors">
            {t('nav.volunteers', 'स्वयंसेवक', 'Volunteers')}
          </a>
          <a href="#verification" className="hover:text-[#8B0000] transition-colors flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t('nav.verify', 'सत्यापन', 'Verify')}</span>
          </a>
        </nav>

        {/* Action CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onOpenReport}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {t('nav.report', 'वार्षिक रिपोर्ट', 'Annual Report')}
          </button>
          <button
            onClick={onOpenDonate}
            className="px-4 py-2 bg-gradient-to-r from-[#8B0000] to-red-700 hover:from-red-800 hover:to-red-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-lg"
          >
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span>{t('nav.donate', 'दान करें (80G)', 'Donate (80G)')}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenDonate}
            className="p-2 bg-[#8B0000] text-white rounded-lg text-xs font-bold"
          >
            <Heart className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200 bg-white px-4 py-4 space-y-3 font-bold text-sm text-gray-800">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.about', 'परिचय (About)', 'About')}
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.pillars', 'सेवा क्षेत्र (Pillars)', 'Four Pillars')}
          </a>
          <a
            href="#official-forms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-green-900 font-black hover:text-green-950 flex items-center gap-1.5"
          >
            <span>📝</span>
            <span>5 ऑनलाइन फॉर्म (5 Professional Forms)</span>
          </a>
          <a
            href="#festivals"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-amber-900 font-black hover:text-[#8B0000] flex items-center gap-1.5"
          >
            <span>🪔</span>
            <span>त्यौहार शुभकामना व प्रमाण पत्र (Festival Wishes)</span>
          </a>
          <a
            href="#volunteers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.volunteers', 'स्वयंसेवक एवं कार्य (Volunteers)', 'Volunteers')}
          </a>
          <a
            href="#verification"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-emerald-800 hover:text-emerald-900"
          >
            सर्टिफिकेट सत्यापन (Verify Certificate)
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReport();
            }}
            className="w-full text-left py-1 text-amber-900"
          >
            वार्षिक प्रगति रिपोर्ट (Annual Report)
          </button>
          {onOpenAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left py-2 px-3 bg-red-50 text-[#8B0000] rounded-xl font-bold flex items-center gap-2 border border-red-200 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>एडमिन / सुपर एडमिन लॉगिन</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
