// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 1: BANNER / MEDIA MANAGER
// जीवन ज्योति फाउंडेशन - बैनर, फ़ोटो एवं वीडियो सामग्री प्रबंधक
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Image,
  Video,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Sparkles,
  RotateCw,
  Film,
  ExternalLink,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import { saveHomeContent, uploadMediaFile } from '../../services/adminService';
import { AppLogoManager } from './AppLogoManager';
import toast from 'react-hot-toast';

export const TabBannerMediaManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  const [bannerImageUrl, setBannerImageUrl] = useState<string>(content.bannerImageUrl || '');
  const [bannerVideoUrl, setBannerVideoUrl] = useState<string>(content.bannerVideoUrl || '');
  const [bannerTitle, setBannerTitle] = useState<string>(content.bannerTitle || '');
  const [bannerSubtitle, setBannerSubtitle] = useState<string>(content.bannerSubtitle || '');

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync state when content updates from Firestore
  useEffect(() => {
    if (content) {
      setBannerImageUrl(content.bannerImageUrl || '');
      setBannerVideoUrl(content.bannerVideoUrl || '');
      setBannerTitle(content.bannerTitle || 'सशक्त ग़ाज़ीपुर, समृद्ध समाज');
      setBannerSubtitle(content.bannerSubtitle || 'हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें');
    }
  }, [content]);

  // फ़ोटो अपलोड हैंडलर (Upload Image with Visual Progress Bar)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल JPG/PNG फ़ोटो फ़ाइल चुनें!');
      return;
    }

    setIsUploadingImage(true);
    startUpload('बैनर फ़ोटो अपलोड', 'media', `फ़ाइल: ${file.name}`);

    try {
      const downloadUrl = await uploadMediaFile(
        file,
        'banners',
        (progress, message, bytesDetail) => {
          updateProgress(progress, message, bytesDetail);
        }
      );
      setBannerImageUrl(downloadUrl);
      completeUpload('बैनर फ़ोटो सफलतापूर्वक अपलोड हो गई!');
      toast.success('फ़ोटो सफलतापूर्वक अपलोड हो गई!');
    } catch (err) {
      console.error(err);
      failUpload('फ़ोटो अपलोड में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('फ़ोटो अपलोड में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // वीडियो अपलोड हैंडलर (Upload Video with Visual Progress Bar)
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('कृपया केवल MP4 वीडियो फ़ाइल चुनें!');
      return;
    }

    setIsUploadingVideo(true);
    startUpload('होम पेज वीडियो अपलोड', 'media', `फ़ाइल: ${file.name}`);

    try {
      const downloadUrl = await uploadMediaFile(
        file,
        'videos',
        (progress, message, bytesDetail) => {
          updateProgress(progress, message, bytesDetail);
        }
      );
      setBannerVideoUrl(downloadUrl);
      completeUpload('वीडियो सफलतापूर्वक अपलोड हो गया!');
      toast.success('वीडियो सफलतापूर्वक अपलोड हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('वीडियो अपलोड में त्रुटि आई।');
      toast.error('वीडियो अपलोड में त्रुटि आई।');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // फ़ायरस्टोर में सेव करें (Save to Firestore: /appContent/home)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    setIsSaving(true);
    startUpload('प्रशासनिक डेटा सुरक्षित हो रहा है', 'content', 'होम पेज मीडिया सेटिंग्स');
    updateProgress(30, 'क्लाउड डेटाबेस से संपर्क स्थापित किया जा रहा है...');

    try {
      updateProgress(65, 'फ़ायरस्टोर में प्रशासनिक रिकॉर्ड सुरक्षित हो रहा है...');
      await saveHomeContent(
        {
          ...content,
          bannerImageUrl,
          bannerVideoUrl,
          bannerTitle,
          bannerSubtitle
        },
        adminProfile.name,
        adminProfile.uid
      );
      completeUpload('होम पेज मीडिया सेटिंग्स सफलतापूर्वक सहेजी गईं!');
      toast.success('होम पेज मीडिया सफलतापूर्वक अपडेट हो गया!');
    } catch (error) {
      console.error('Save error:', error);
      failUpload('डेटा सहेजने में त्रुटि आई।');
      toast.error('सेव करने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    setBannerImageUrl('');
    setBannerVideoUrl('https://www.youtube.com/watch?v=0kF5s7J_C3A');
    setBannerTitle('सशक्त ग़ाज़ीपुर, समृद्ध समाज');
    setBannerSubtitle('हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें');
    toast.success('डिफ़ॉल्ट मान लोड किए गए। सेव करने के लिए "सेव करें" बटन दबाएं।');
  };

  return (
    <div className="space-y-6">
      {/* 1. APP & BRAND LOGO DIRECT MANAGER (UNIVERSAL SYNC) */}
      <AppLogoManager />

      {/* 2. Banner & Media Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>TAB 1: BANNER & MEDIA MANAGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              होम पेज बैनर फ़ोटो एवं वीडियो प्रबंधक
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              यहाँ से आप होम पेज के मुख्य बैनर डिस्प्ले फ़ोटो और वीडियो को सीधे बदल सकते हैं। यह बदलाव मोबाइल ऐप व वेबसाइट पर तुरंत दिखाई देगा।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>डिफ़ॉल्ट मान रीसेट</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION A: DISPLAY PHOTO / BANNER IMAGE */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    मुख्य डिस्प्ले फ़ोटो (Display Photo)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    JPG, PNG या SVG सपोर्टेड
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                Firebase Storage
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center group shadow-inner">
              {bannerImageUrl ? (
                <img
                  src={bannerImageUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">कोई फ़ोटो सेट नहीं है</p>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>लाइव पूर्वावलोकन (Live Preview)</span>
              </div>
            </div>

            {/* Upload Button & URL Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  डिवाइस से फ़ोटो अपलोड करें (Upload Image File)
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer transition text-xs font-bold text-slate-700">
                  {isUploadingImage ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-blue-700" />
                      <span>फ़ोटो अपलोड हो रही है...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-blue-700" />
                      <span>गैलरी / कंप्यूटर से फ़ोटो चुनें (JPG/PNG)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  या सीधा इमेज लिंक दर्ज करें (Image URL)
                </label>
                <input
                  type="url"
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: HOME PAGE VIDEO MANAGER */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    होम पेज वीडियो (Home Video Showcase)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    MP4 फ़ाइल या YouTube / CDN लिंक
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                MP4 & YouTube
              </span>
            </div>

            {/* Video Live Preview Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center shadow-inner">
              {bannerVideoUrl && bannerVideoUrl.includes('youtube.com') ? (
                <iframe
                  src={bannerVideoUrl.replace('watch?v=', 'embed/')}
                  title="YouTube Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : bannerVideoUrl ? (
                <video
                  src={bannerVideoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Video className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">कोई वीडियो सेट नहीं है</p>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>वीडियो पूर्वावलोकन (Video Preview)</span>
              </div>
            </div>

            {/* Video Upload & URL Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  डिवाइस से MP4 वीडियो अपलोड करें (Upload Video)
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer transition text-xs font-bold text-slate-700">
                  {isUploadingVideo ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-blue-700" />
                      <span>वीडियो अपलोड हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-blue-700" />
                      <span>कंप्यूटर / फ़ोन से MP4 वीडियो फ़ाइल चुनें</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                    disabled={isUploadingVideo}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  या YouTube / MP4 वीडियो URL लिंक दर्ज करें
                </label>
                <input
                  type="url"
                  value={bannerVideoUrl}
                  onChange={(e) => setBannerVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=0kF5s7J_C3A"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: BANNER TEXT LABELS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>बैनर शीर्षक एवं उप-शीर्षक (Banner Heading & Tagline)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                बैनर मुख्य शीर्षक (Banner Title)
              </label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="सशक्त ग़ाज़ीपुर, समृद्ध समाज"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                बैनर उप-शीर्षक (Banner Subtitle)
              </label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE STRIP */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-amber-400">अंतिम अपडेट: </span>
            {content.updatedBy || 'सिस्टम एडमिन'} द्वारा{' '}
            {content.updatedAt
              ? new Date(content.updatedAt).toLocaleString('hi-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              : 'हाल ही में'}
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploadingImage || isUploadingVideo}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>फ़ायरबेस में सहेजा जा रहा है...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>मीडिया सेटिंग्स सेव करें (Save Changes)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
