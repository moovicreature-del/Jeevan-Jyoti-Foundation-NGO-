import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { BrandLogo } from './common/BrandLogo';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) {
      return;
    }

    // 2. Check iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Check if user dismissed recently in this session
    const isDismissed = sessionStorage.getItem('jjf_pwa_banner_dismissed');
    if (isDismissed) {
      return;
    }

    // 4. Capture native install prompt (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not dismissed, show prompt after brief delay
    if (isIosDevice && !isStandaloneMode && !isDismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback message for browsers without beforeinstallprompt
      setShowIosGuide(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('jjf_pwa_banner_dismissed', 'true');
  };

  if (!showBanner || isStandalone) return null;

  return (
    <>
      {/* Top Floating PWA Banner */}
      <div className="relative z-40 bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] text-white px-4 py-2 sm:py-2.5 shadow-lg border-b border-amber-400/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Organization icon & text */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-amber-300/40 p-1 flex items-center justify-center shrink-0">
              <BrandLogo size={24} className="drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>जीवन ज्योति फाउंडेशन आधिकारिक ऐप (PWA)</span>
              </div>
              <p className="text-[11px] text-white/90 hidden sm:block">
                होम स्क्रीन पर जोड़ें — तेज़ गति, बिना इंटरनेट प्रमाण पत्र सत्यापन व त्वरित रसीद सुविधा।
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-[#8B0000] rounded-lg text-xs font-black shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ऐप इंस्टॉल करें (Install App)</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Close install banner"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS / Manual Installation Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-400 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center mb-3">
                <BrandLogo size={42} />
              </div>
              <h3 className="text-lg font-black text-[#8B0000] font-['Cinzel',serif]">
                JEEVAN JYOTI FOUNDATION APP
              </h3>
              <p className="text-xs text-gray-600 font-semibold mt-1">
                स्मार्टफोन में ऐप की तरह इंस्टॉल करने के सरल चरण:
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-700 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              {isIos ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <p>सफारी (Safari) ब्राउज़र के नीचे स्थित <strong className="text-gray-900 inline-flex items-center gap-1 font-bold"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> Share</strong> बटन पर टैप करें।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <p>मेन्यू को नीचे स्क्रॉल करके <strong className="text-gray-900 font-bold">'Add to Home Screen (होम स्क्रीन में जोड़ें)'</strong> चुनें।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <p>ऊपर दाईं ओर <strong className="text-gray-900 font-bold">'Add'</strong> पर क्लिक करें। ऐप आपके फोन में सेव हो जाएगा!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <p>ब्राउज़र के ऊपर दाईं ओर <strong>3 डॉट्स (⋮) मेन्यू</strong> पर टैप करें।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <p><strong>'Install app'</strong> या <strong>'Add to Home screen'</strong> पर क्लिक करें।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <p>कन्फर्मेशन आने पर <strong>'Install'</strong> दबाएं।</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-2.5 bg-[#8B0000] hover:bg-[#A52A2A] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                समझ गया (Got It)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
