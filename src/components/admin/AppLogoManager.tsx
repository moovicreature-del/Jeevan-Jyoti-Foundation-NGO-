// ============================================================================
// JEEVAN JYOTI FOUNDATION - APP LOGO DIRECT MANAGER
// जीवन ज्योति फाउंडेशन - आधिकारिक ऐप एवं संस्था लोगो प्रबंधन मॉड्यूल
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RotateCw,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Award,
  FileCheck,
  Eye,
  Trash2,
  Globe,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import { updateAppLogo, resetAppLogo, uploadMediaFile } from '../../services/adminService';
import { BrandLogo } from '../common/BrandLogo';
import toast from 'react-hot-toast';

export const AppLogoManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(content?.appLogoUrl || '');
  const [directUrlInput, setDirectUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'navbar' | 'certificate' | 'seal' | 'watermark'>('navbar');

  useEffect(() => {
    if (content?.appLogoUrl) {
      setPreviewUrl(content.appLogoUrl);
    } else {
      setPreviewUrl('');
    }
  }, [content?.appLogoUrl]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, WEBP, SVG) चुनें!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 5MB से कम होना चाहिए!');
      return;
    }

    setSelectedFile(file);
    const localBlobUrl = URL.createObjectURL(file);
    setPreviewUrl(localBlobUrl);
    setDirectUrlInput('');
    toast.success('फ़ोटो चुनी गई! लागू करने के लिए "नया लोगो सेव व सभी जगह लागू करें" पर क्लिक करें।');
  };

  // Handle direct URL input
  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDirectUrlInput(url);
    if (url.trim()) {
      setSelectedFile(null);
      setPreviewUrl(url.trim());
    } else {
      setPreviewUrl(content?.appLogoUrl || '');
    }
  };

  // Upload and apply new logo across all app pages
  const handleApplyNewLogo = async () => {
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    let finalLogoUrl = previewUrl;

    if (!finalLogoUrl && !selectedFile) {
      toast.error('कृपया पहले कोई लोगो फ़ाइल चुनें या इमेज URL दर्ज करें!');
      return;
    }

    setIsApplying(true);
    startUpload('संस्था लोगो सार्वभौमिक अपडेट', 'content', 'लोगो अपलोड व रीयलटाइम डेटाबेस सिंक');

    try {
      // 1. If user selected a local file, upload it to Firebase Storage / base64
      if (selectedFile) {
        setIsUploading(true);
        updateProgress(25, 'लोगो फ़ाइल स्टोरेज पर अपलोड हो रही है...');
        finalLogoUrl = await uploadMediaFile(
          selectedFile,
          'banners',
          (progress, message, bytesDetail) => {
            updateProgress(progress, message, bytesDetail);
          }
        );
      }

      updateProgress(80, 'सभी पेजों, प्रमाणपत्रों एवं डेटाबेस में लोगो अपडेट हो रहा है...');

      // 2. Save new logo to Firestore and LocalStorage
      await updateAppLogo(finalLogoUrl, adminProfile.name, adminProfile.uid);

      setPreviewUrl(finalLogoUrl);
      setSelectedFile(null);
      setDirectUrlInput('');

      completeUpload('नया लोगो सभी पेजों पर सफलतापूर्वक लागू हो गया!');
      toast.success('🎉 नया लोगो पूरी वेबसाइट व सभी प्रमाणपत्रों पर तुरंत लागू हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('लोगो अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('लोगो अपडेट करने में त्रुटि आई।');
    } finally {
      setIsUploading(false);
      setIsApplying(false);
    }
  };

  // Reset to official vector emblem
  const handleResetToDefault = async () => {
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    if (!confirm('क्या आप लोगो को मूल डिफ़ॉल्ट वेक्टर प्रतीक (Official Vector Emblem) में रीसेट करना चाहते हैं?')) {
      return;
    }

    setIsApplying(true);
    startUpload('मूल लोगो रीसेट प्रक्रिया', 'content', 'डिफ़ॉल्ट वेक्टर प्रतीक पुनर्स्थापित हो रहा है');

    try {
      await resetAppLogo(adminProfile.name, adminProfile.uid);
      setPreviewUrl('');
      setSelectedFile(null);
      setDirectUrlInput('');
      completeUpload('मूल डिफ़ॉल्ट वेक्टर लोगो सफलतापूर्वक पुनर्स्थापित हो गया!');
      toast.success('मूल डिफ़ॉल्ट लोगो सफलतापूर्वक रीसेट हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('रीसेट करने में त्रुटि आई।');
      toast.error('लोगो रीसेट करने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  const isCustomLogoActive = Boolean(content?.appLogoUrl || previewUrl);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Module Title & Status Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md border border-amber-300">
            <Sparkles className="w-6 h-6 text-blue-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                ऐप एवं संस्था लोगो डायरेक्ट चेंजर (Universal Logo Manager)
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Global Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ नया लोगो अपलोड करें — यह नेवबार, हेडर, फुटर, 80G रसीदों, आईडी कार्ड व सभी प्रमाण पत्रों पर स्वतः फिक्स हो जाएगा।
            </p>
          </div>
        </div>

        {/* Current Active Status */}
        <div className="flex items-center gap-2">
          {content?.appLogoUrl ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              कस्टम लोगो सक्रिय
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              मूल डिफ़ॉल्ट वेक्टर प्रतीक
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Upload Controls + Right Multi-Context Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: UPLOAD CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* UPLOAD BOX 1: FILE PICKER / DRAG & DROP */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-6 transition-all text-center relative group">
            <input
              type="file"
              id="admin-app-logo-file-input"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              disabled={isApplying || isUploading}
            />
            <div className="flex flex-col items-center justify-center gap-2.5">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-blue-800 group-hover:scale-105 group-hover:bg-blue-800 group-hover:text-white transition-all">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 block">
                  नया लोगो फ़ाइल चुनें या ड्रैग करें
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  PNG (ट्रांसपेरेंट बैकग्राउंड अनुशंसित), JPG, WEBP या SVG (अधिकतम 5MB)
                </span>
              </div>
              {selectedFile && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-xl text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-blue-700" />
                  चयनित: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </div>

          {/* UPLOAD BOX 2: DIRECT IMAGE URL */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              अथवा डायरेक्ट वेब इमेज URL दर्ज करें (Optional Web Link)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={directUrlInput}
                onChange={handleDirectUrlChange}
                placeholder="https://example.com/images/my-ngo-logo.png"
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                disabled={isApplying || isUploading}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Google Drive, Imgur, Cloudinary या अपनी वेबसाइट का सीधा इमेज लिंक यहाँ पेस्ट कर सकते हैं।
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleApplyNewLogo}
              disabled={isApplying || isUploading || (!selectedFile && !previewUrl && !directUrlInput)}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying || isUploading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>अपलोड व रीयलटाइम सिंक जारी है...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>नया लोगो सेव करें व सभी जगह फिक्स करें</span>
                </>
              )}
            </button>

            {isCustomLogoActive && (
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={isApplying || isUploading}
                title="मूल डिफ़ॉल्ट वेक्टर लोगो पर वापस लौटें"
                className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-slate-200"
              >
                <RefreshCw className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
                <span>डिफ़ॉल्ट लोगो रीसेट</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MULTI-CONTEXT LIVE PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-800" />
              <span className="font-black text-xs text-slate-800">
                लाइव संदर्भ पूर्वावलोकन (Live Context Preview)
              </span>
            </div>
            <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.5 rounded">
              Real-time
            </span>
          </div>

          {/* Context Tabs Selector */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActivePreviewTab('navbar')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activePreviewTab === 'navbar' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              नेवबार
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('certificate')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activePreviewTab === 'certificate' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              प्रमाण पत्र
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('seal')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activePreviewTab === 'seal' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मुहर (Seal)
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('watermark')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activePreviewTab === 'watermark' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              वॉटरमार्क
            </button>
          </div>

          {/* PREVIEW CONTAINER BASED ON SELECTED CONTEXT */}
          <div className="min-h-[220px] flex items-center justify-center">
            {activePreviewTab === 'navbar' && (
              <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
                <BrandLogo size={46} customLogoUrl={previewUrl || undefined} className="drop-shadow-xs" />
                <div>
                  <div className="font-black text-sm text-[#3F2B96] leading-none font-['Cinzel',serif]">
                    JEEVAN JYOTI FOUNDATION
                  </div>
                  <div className="text-[10px] font-bold text-amber-700 leading-tight mt-0.5">
                    जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'certificate' && (
              <div className="w-full bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border border-amber-200 text-center space-y-2">
                <BrandLogo size={60} customLogoUrl={previewUrl || undefined} className="mx-auto drop-shadow-xs" />
                <div>
                  <div className="font-black text-xs text-[#8B0000] tracking-wider uppercase">
                    JEEVAN JYOTI FOUNDATION GHAZIPUR
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600">
                    80G एवं 12A आयकर अधिनियम अधिकृत प्रमाण पत्र
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'seal' && (
              <div className="w-full flex items-center justify-center p-3">
                <div className="relative w-36 h-36 rounded-full border-4 border-dashed border-red-700 bg-red-50/50 flex flex-col items-center justify-center p-2 shadow-inner text-center">
                  <span className="text-[8px] font-black text-red-800 uppercase tracking-widest">
                    ★ OFFICIAL SEAL ★
                  </span>
                  <div className="my-1">
                    <BrandLogo size={42} customLogoUrl={previewUrl || undefined} />
                  </div>
                  <span className="text-[7px] font-bold text-red-800">
                    GOVT. REGD. NGO
                  </span>
                </div>
              </div>
            )}

            {activePreviewTab === 'watermark' && (
              <div className="w-full relative h-40 bg-white rounded-2xl p-4 border border-slate-200 overflow-hidden flex items-center justify-center">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <BrandLogo size={140} watermark opacity={0.12} customLogoUrl={previewUrl || undefined} />
                </div>
                <div className="relative z-10 text-center space-y-1">
                  <span className="text-xs font-black text-slate-800 block">
                    प्रमाण पत्र वॉटरमार्क पृष्ठभूमि
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    दस्तावेज़ की बैकग्राउंड में हल्का वॉटरमार्क
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-[11px] text-blue-900 leading-relaxed">
            <span className="font-black block">💡 तत्काल सार्वभौमिक अद्यतन (Instant Global Fix):</span>
            जैसे ही आप लोगो सेव करेंगे, वेबसाइट का हर पेज और सभी प्रमाण पत्र बिना पेज रिफ्रेश किए स्वतः नए लोगो से अपडेट हो जाएंगे।
          </div>
        </div>
      </div>
    </div>
  );
};
