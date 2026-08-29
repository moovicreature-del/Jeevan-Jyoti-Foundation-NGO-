// ============================================================================
// JEEVAN JYOTI FOUNDATION - DYNAMIC NOTICE BOARD TOP BANNER
// होम पेज शीर्ष सक्रिय सूचना पट्ट (Dynamic Notices from Firestore)
// ============================================================================

import React, { useState } from 'react';
import { Megaphone, ChevronRight, Bell, Sparkles, X, AlertTriangle } from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';

interface HomeNoticeBannerProps {
  onOpenAdmin?: () => void;
}

export const HomeNoticeBanner: React.FC<HomeNoticeBannerProps> = ({ onOpenAdmin }) => {
  const { activeNotices } = useHomeContent();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [selectedNoticeIndex, setSelectedNoticeIndex] = useState<number>(0);

  if (dismissed || activeNotices.length === 0) return null;

  const currentNotice = activeNotices[selectedNoticeIndex] || activeNotices[0];

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white border-b-2 border-amber-400 py-2 px-4 shadow-md relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Notice Content */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black shrink-0 uppercase tracking-wider animate-pulse">
            <Megaphone className="w-3 h-3" />
            <span>नवीन सूचना ({selectedNoticeIndex + 1}/{activeNotices.length})</span>
          </div>

          <div className="flex items-center gap-2 truncate text-xs">
            <span className="font-black text-amber-300 truncate">
              {currentNotice.title}:
            </span>
            <span className="text-blue-100 truncate hidden md:inline font-medium">
              {currentNotice.message}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {activeNotices.length > 1 && (
            <button
              onClick={() => setSelectedNoticeIndex((prev) => (prev + 1) % activeNotices.length)}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-amber-200 px-2 py-0.5 rounded-md transition cursor-pointer"
            >
              अगली सूचना ▶
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[10px] text-amber-300 hover:text-white font-bold underline transition cursor-pointer hidden sm:inline"
            >
              एडमिन पोर्टल
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition cursor-pointer"
            title="सूचना बंद करें"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
