import React, { useState } from 'react';
import { Award, UserPlus, MapPin, Calendar, CreditCard, X } from 'lucide-react';
import { TaskRecord, Volunteer } from '../types';
import { INITIAL_TASKS, INITIAL_VOLUNTEERS } from '../data/taskData';
import { useLanguage } from '../context/LanguageContext';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { formatCertificateNumber } from '../utils/certificateUtils';

interface Props {
  onSelectVolunteerCertificate: (volunteer: Volunteer) => void;
  onSelectTaskCertificate: (task: TaskRecord) => void;
  onSelectIdCard: (volunteer: Volunteer) => void;
}

export const VolunteerTaskPortal: React.FC<Props> = ({
  onSelectVolunteerCertificate,
  onSelectTaskCertificate,
  onSelectIdCard
}) => {
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { t, isHindi } = useLanguage();
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [tasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [showRegModal, setShowRegModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newRelationType, setNewRelationType] = useState<'Father' | 'Husband' | 'Guardian'>('Father');
  const [newFather, setNewFather] = useState('');
  const [newJoinDate, setNewJoinDate] = useState(() => getTodayDateString());
  const [newArea, setNewArea] = useState('Education & Child Literacy');
  const [regAddress, setRegAddress] = useState<StructuredAddress>(DEFAULT_STRUCTURED_ADDRESS);
  const [regError, setRegError] = useState<string | null>(null);

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setRegError(isHindi ? 'कृपया स्वयंसेवक का पूरा नाम भरें।' : 'Please enter Volunteer Full Name.');
      return;
    }
    if (!newFather.trim()) {
      setRegError(
        newRelationType === 'Husband'
          ? (isHindi ? 'कृपया पति / जीवनसाथी का नाम भरें।' : 'Please enter Husband / Spouse Name.')
          : newRelationType === 'Guardian'
          ? (isHindi ? 'कृपया अभिभावक का नाम भरें।' : 'Please enter Guardian Name.')
          : (isHindi ? 'कृपया पिता का नाम भरें।' : 'Please enter Father Name.')
      );
      return;
    }
    if (!regAddress.country || !regAddress.state || !regAddress.district || !regAddress.block || !regAddress.wardOrVillage?.trim()) {
      setRegError(isHindi ? 'देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।' : 'Country, State, District, Block and Ward/Village are mandatory.');
      return;
    }

    const newVol: Volunteer = {
      id: formatCertificateNumber('VOL', newJoinDate || new Date(), volunteers.length + 1),
      name: newName.trim(),
      fatherName: newFather.trim(),
      relationType: newRelationType,
      role: 'सक्रिय स्वयंसेवक (Active Volunteer)',
      area: newArea,
      areaHindi: newArea === 'Education & Child Literacy' ? 'निःशुल्क बाल शिक्षा' : 'स्वास्थ्य एवं अन्नपूर्णा सेवा',
      hoursContributed: 24,
      tasksCompleted: 4,
      joinDate: newJoinDate || getTodayDateString(),
      photoUrl: newPhoto || undefined,
      status: 'active',
      country: regAddress.country,
      state: regAddress.state,
      district: regAddress.district,
      block: regAddress.block,
      wardOrVillage: regAddress.wardOrVillage
    };

    setVolunteers([newVol, ...volunteers]);
    setShowRegModal(false);
    setNewName('');
    setNewFather('');
    setNewPhoto('');
    setNewJoinDate(getTodayDateString());
    setRegError(null);
    onSelectVolunteerCertificate(newVol);
  };

  return (
    <section id="volunteers" className="py-16 bg-amber-50/30 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDE7] border border-yellow-300 text-black text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
              <Award className="w-3.5 h-3.5 text-black" />
              <span>{t('vol.badge', 'स्वयंसेवक मंच एवं प्रमाण पत्र जनरेटर', 'Volunteer Platform & Certificate Generator')}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-['Cinzel',serif]">
              {t('vol.title', 'सेवा ही संकल्प (Volunteer Portal)', 'Service is Our Resolve (Volunteer Portal)')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {t('vol.sub',
                'संस्था के साथ जुड़ें, सेवा कार्यों में भाग लें और तत्काल डिजिटल हस्ताक्षरित प्रमाण पत्र प्राप्त करें।',
                'Join our movement, participate in field seva activities, and receive instantly authenticated, digitally signed certificates.'
              )}
            </p>
          </div>

          <button
            onClick={() => setShowRegModal(true)}
            className="px-5 py-3 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('vol.join_btn', 'नया स्वयंसेवक पंजीकरण (Join as Volunteer)', 'Register as New Volunteer')}</span>
          </button>
        </div>

        {/* Volunteers Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-base text-gray-900">{vol.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{t('vol.son_of', 'सुपुत्र / सुपुत्री', 'S/D of')}: Shri {vol.fatherName}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {vol.id}
                </span>
              </div>

              <div className="my-3 space-y-1 text-xs text-gray-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <div><strong>{t('vol.field', 'सेवा क्षेत्र', 'Field')}:</strong> {isHindi ? vol.areaHindi : vol.area}</div>
                <div><strong>{t('vol.contribution', 'योगदान', 'Contribution')}:</strong> {vol.hoursContributed} {t('vol.hours', 'घंटे', 'hrs')} ({vol.tasksCompleted} {t('vol.tasks', 'कार्य', 'tasks')})</div>
                <div><strong>{t('vol.date', 'दिनांक', 'Date')}:</strong> {vol.joinDate}</div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onSelectVolunteerCertificate(vol)}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
                >
                  {t('vol.view_cert', 'प्रमाण पत्र देखें (Certificate)', 'View Certificate')}
                </button>
                <button
                  onClick={() => onSelectIdCard(vol)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="ID Card"
                >
                  <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Tasks List */}
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-4 font-['Cinzel']">
            {t('vol.active_missions', 'सक्रिय सेवा कार्य (Active Volunteer Missions)', 'Active Volunteer Missions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {task.location}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                      +{task.points} pts
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-gray-900 mb-1">
                    {isHindi ? task.titleHindi : task.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    {task.date}
                  </span>
                  <button
                    onClick={() => onSelectTaskCertificate(task)}
                    className="px-3 py-1.5 bg-[#8B0000] hover:bg-[#6b0000] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {t('vol.generate_task_cert', 'प्रशंसा पत्र जनरेट करें', 'Generate Certificate')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Modal */}
        {showRegModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center py-6 sm:py-10 overscroll-contain touch-pan-y">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 sticky -top-4 bg-white z-10 pt-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Cinzel']">
                    {t('vol.join_btn', 'नया स्वयंसेवक पंजीकरण', 'New Volunteer Registration')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">जीवन ज्योति फाउंडेशन स्वयंसेवक सदस्यता</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Alert */}
              {regError && (
                <div className="bg-red-50 border border-red-300 text-red-800 p-2.5 rounded-xl text-xs font-bold mb-3">
                  ⚠️ {regError}
                </div>
              )}

              <form onSubmit={handleRegisterVolunteer} className="space-y-4 text-xs">
                {/* Candidate Photo Upload at Top of Form */}
                <CandidatePhotoUploader
                  photoUrl={newPhoto}
                  onPhotoChange={setNewPhoto}
                  onPhotoRemove={() => setNewPhoto('')}
                  required={false}
                  label="स्वयंसेवक फोटो (Volunteer Photo - कैमरा या गैलरी)"
                  subLabel="पहचान पत्र व प्रमाण पत्र हेतु लाइव कैमरा से फोटो खींचें या गैलरी से चुनें"
                />

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isHindi ? 'पूरा नाम (Full Name) *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="उदा. श्री राहुल कुमार / श्रीमती प्रतिमा राय"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                {/* Relation Type & Father/Spouse/Guardian Name */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {isHindi ? 'संबंध प्रकार (Relation) *' : 'Relation Type *'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Father')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Father'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        👨‍🦳 पिता (Father)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Husband')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Husband'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        💍 पति/जीवनसाथी
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Guardian')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Guardian'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        🛡️ अभिभावक
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {newRelationType === 'Husband'
                        ? (isHindi ? 'पति / जीवनसाथी का नाम (Husband / Spouse Name) *' : "Husband's / Spouse's Name *")
                        : newRelationType === 'Guardian'
                        ? (isHindi ? 'अभिभावक का नाम (Guardian Name) *' : "Guardian's Name *")
                        : (isHindi ? 'पिता का नाम (Father\'s Name) *' : "Father's Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={newFather}
                      onChange={(e) => setNewFather(e.target.value)}
                      placeholder={
                        newRelationType === 'Husband'
                          ? (isHindi ? 'उदा. श्री अमित कुमार (पति / जीवनसाथी का नाम)' : 'e.g. Shri Amit Kumar (Husband/Spouse)')
                          : newRelationType === 'Guardian'
                          ? (isHindi ? 'उदा. श्री सुरेश कुमार (अभिभावक का नाम)' : 'e.g. Shri Suresh Kumar (Guardian)')
                          : (isHindi ? 'उदा. श्री रामेश्वर राय (पिता का नाम)' : 'e.g. Shri Rameshwar Rai (Father)')
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Structured Address 5-Tier Selector */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <StructuredAddressSelector
                    value={regAddress}
                    onChange={setRegAddress}
                    required={true}
                    compact={true}
                    labelPrefix="स्थायी पता"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isHindi ? 'सेवा क्षेत्र (Service Area)' : 'Service Sector'}</label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Education & Child Literacy">Education & Child Literacy (शिक्षा सेवा)</option>
                    <option value="Food Security & Relief">Food Distribution & Relief (अन्नपूर्णा सेवा)</option>
                    <option value="Healthcare & Hygiene">Healthcare Camps (स्वास्थ्य रक्षा)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-700">
                      {isHindi ? 'पंजीकरण तिथि (Registration Date) *' : 'Registration Date *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewJoinDate(getTodayDateString())}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔄 आज की तिथि सेट करें</span>
                    </button>
                  </div>
                  <input
                    type="date"
                    required
                    value={newJoinDate}
                    onChange={(e) => setNewJoinDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                  <div className="text-[11px] text-emerald-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(newJoinDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold rounded-xl transition cursor-pointer shadow-md"
                  >
                    {isHindi ? 'पंजीकरण पूर्ण करें' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VolunteerTaskPortal;
