import React, { useState } from 'react';
import { Heart, CheckCircle, Sparkles, Download, Award, FileText, ArrowRight, Star } from 'lucide-react';
import { DONORS_DATA } from '../data/donorsData';
import { useLanguage } from '../context/LanguageContext';
import { getDonorTier, DONOR_TIERS, DonorTierType } from '../utils/donorTiers';
import { DonationRecord } from '../types';

interface DonationWallProps {
  onOpenDonate: () => void;
  onOpenDonationCert?: () => void;
  onSelectDonationForCert?: (donation: DonationRecord) => void;
}

type FilterTab = 'all' | DonorTierType;

export const DonationWallOfFame: React.FC<DonationWallProps> = ({
  onOpenDonate,
  onOpenDonationCert,
  onSelectDonationForCert
}) => {
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Count donors by tier
  const tierCounts = {
    all: DONORS_DATA.length,
    diamond: DONORS_DATA.filter((d) => d.amount >= 200000).length,
    platinum: DONORS_DATA.filter((d) => d.amount >= 100000 && d.amount < 200000).length,
    gold: DONORS_DATA.filter((d) => d.amount >= 50000 && d.amount < 100000).length,
    silver: DONORS_DATA.filter((d) => d.amount >= 25000 && d.amount < 50000).length,
    general: DONORS_DATA.filter((d) => d.amount < 25000).length,
  };

  // Filter donors based on active tab
  const filteredDonors = DONORS_DATA.filter((donor) => {
    if (activeTab === 'all') return true;
    const tier = getDonorTier(donor.amount);
    return tier.key === activeTab;
  });

  const tabOptions: Array<{
    key: FilterTab;
    labelHindi: string;
    labelEnglish: string;
    symbol: string;
    threshold: string;
    colorClass: string;
    activeBg: string;
  }> = [
    {
      key: 'all',
      labelHindi: 'सभी सहयोगी',
      labelEnglish: 'All Patrons',
      symbol: '🏛️',
      threshold: 'All',
      colorClass: 'text-amber-800 border-amber-300',
      activeBg: 'bg-amber-900 text-white shadow-md',
    },
    {
      key: 'diamond',
      labelHindi: 'हीरक भामाशाह (Diamond)',
      labelEnglish: 'Diamond Patrons',
      symbol: '💎',
      threshold: '₹2,00,000+',
      colorClass: 'text-cyan-800 border-cyan-300',
      activeBg: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-200',
    },
    {
      key: 'platinum',
      labelHindi: 'प्लैटिनम संरक्षक (Platinum)',
      labelEnglish: 'Platinum Patrons',
      symbol: '💠',
      threshold: '₹1,00,000+',
      colorClass: 'text-indigo-800 border-indigo-300',
      activeBg: 'bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-900 text-white shadow-md shadow-indigo-200',
    },
    {
      key: 'gold',
      labelHindi: 'स्वर्ण सहयोगी (Gold)',
      labelEnglish: 'Gold Patrons',
      symbol: '🥇',
      threshold: '₹50,000+',
      colorClass: 'text-amber-800 border-amber-400',
      activeBg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-md shadow-amber-200',
    },
    {
      key: 'silver',
      labelHindi: 'रजत सहयोगी (Silver)',
      labelEnglish: 'Silver Patrons',
      symbol: '🥈',
      threshold: '₹25,000+',
      colorClass: 'text-slate-800 border-slate-400',
      activeBg: 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-md shadow-slate-200',
    }
  ];

  return (
    <section id="wall-of-fame" className="py-16 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t('donors.badge', 'सहयोगियों की गौरव पट्टिका (Donors Wall of Fame)', 'Donors Wall of Fame & Esteemed Patrons')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t('donors.title', 'हमारे परम सहयोगी एवं भामाशाह', 'Our Esteemed Donors & Pillars of Support')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('donors.sub',
              '80G व 12A आयकर छूट प्रमाणित दानदाता जिन्होंने समाज के अंतिम व्यक्ति तक शिक्षा व स्वास्थ्य पहुंचाया।',
              'Donors backed by 80G and 12A tax exemption certification powering grassroots transformation.'
            )}
          </p>
        </div>

        {/* Tier Explanation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50/50 border border-cyan-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">💎</span>
            <div className="font-black text-xs text-cyan-950 mt-1">Diamond Donor</div>
            <div className="text-[11px] font-extrabold text-cyan-700 font-mono">₹ 2,00,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">💠</span>
            <div className="font-black text-xs text-indigo-950 mt-1">Platinum Donor</div>
            <div className="text-[11px] font-extrabold text-indigo-700 font-mono">₹ 1,00,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">🥇</span>
            <div className="font-black text-xs text-amber-950 mt-1">Gold Donor</div>
            <div className="text-[11px] font-extrabold text-amber-700 font-mono">₹ 50,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 border border-slate-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">🥈</span>
            <div className="font-black text-xs text-slate-900 mt-1">Silver Donor</div>
            <div className="text-[11px] font-extrabold text-slate-600 font-mono">₹ 25,000 +</div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {tabOptions.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tierCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? `${tab.activeBg} scale-105 ring-2 ring-amber-400/40`
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-2xs'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.symbol}</span>
                <span>{isHindi ? tab.labelHindi : tab.labelEnglish}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDonors.map((donor) => {
            const tier = getDonorTier(donor.amount);
            return (
              <div
                key={donor.id}
                className={`rounded-3xl p-6 border-2 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${tier.cardBg} ${tier.cardBorder}`}
              >
                <div>
                  {/* Top Bar with Tier Badge & 80G */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-black tracking-wide px-3 py-1 rounded-full shadow-2xs border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}
                    >
                      <span className="text-sm">{tier.symbol}</span>
                      <span>{isHindi ? tier.nameHindi.split(' ')[0] : tier.name}</span>
                      <span className="opacity-90 font-mono text-[10px]">({tier.thresholdLabel})</span>
                    </span>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>80G Tax-Exempt</span>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                    {donor.donorName}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{donor.city || 'Ghazipur'}</p>

                  {/* Amount Highlight Box */}
                  <div className="my-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">{t('donors.amount_label', 'सहयोग राशि', 'Contribution Amount')}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{donor.id}</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#8B0000] font-mono mt-1">
                      ₹ {donor.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-700 font-medium mt-2 leading-snug">
                      <strong className="text-amber-900 font-bold">उद्देश्य: </strong>
                      {isHindi ? donor.purposeHindi : donor.purpose}
                    </p>
                  </div>
                </div>

                {/* Footer and Certificate Button */}
                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{donor.date}</span>
                    <span className="font-mono text-[11px] text-slate-600 font-bold">
                      {donor.panNumber ? `PAN: ${donor.panNumber.slice(0, 2)}***${donor.panNumber.slice(-2)}` : 'PAN Verified'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectDonationForCert) {
                        onSelectDonationForCert(donor);
                      } else if (onOpenDonationCert) {
                        onOpenDonationCert();
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:border-amber-500"
                  >
                    <span className="text-base">{tier.symbol}</span>
                    <span>80G सम्मान पत्र व रसीद देखें</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-yellow-200 text-xs font-black uppercase mb-1">
              <span>💎 💠 🥇 🥈 Patron Categories</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {isHindi ? 'आप भी संस्था के विशिष्ट संरक्षक (Patron) बनें' : 'Join as an Esteemed Patron Today'}
            </h3>
            <p className="text-orange-100 text-xs sm:text-sm max-w-xl">
              {isHindi
                ? 'Diamond (2L+), Platinum (1L+), Gold (50K+) या Silver (25K+) श्रेणी में सहयोग कर विशेष सम्मान प्रमाण पत्र व 80G आयकर छूट प्राप्त करें।'
                : 'Contribute under Diamond (2L+), Platinum (1L+), Gold (50K+), or Silver (25K+) tiers with dedicated certification.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenDonate}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span>{t('donors.btn_donate', 'संरक्षक बनें (Donate Now)', 'Become a Patron')}</span>
            </button>
            {onOpenDonationCert && (
              <button
                onClick={onOpenDonationCert}
                className="px-5 py-3.5 rounded-xl bg-black/25 hover:bg-black/35 border border-white/40 text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t('donors.btn_receipt', 'रसीद खोजें व डाउनलोड करें', 'Search 80G Receipt')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationWallOfFame;
