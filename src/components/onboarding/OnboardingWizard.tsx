import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Users,
  Coins,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileCheck,
  Building,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AssetCategory } from '../../types';

interface OnboardingWizardProps {
  onClose?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose }) => {
  const {
    currentUser,
    updateUserProfile,
    addFamilyMember,
    addAsset,
    uploadDocument,
    completeOnboarding,
    analyzeFootprintAI,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Personal Profile State
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [dob, setDob] = useState(currentUser.dateOfBirth || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [occupation, setOccupation] = useState(currentUser.occupation || '');

  // Step 2: Family Information State
  const [familyList, setFamilyList] = useState<
    Array<{
      name: string;
      relationship: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other';
      email: string;
      phone: string;
      isNominee: boolean;
      accessPermissions: AssetCategory[];
    }>
  >([]);
  const [tempFamName, setTempFamName] = useState('');
  const [tempFamRel, setTempFamRel] = useState<'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other'>('Spouse');
  const [tempFamEmail, setTempFamEmail] = useState('');
  const [tempFamPhone, setTempFamPhone] = useState('');
  const [tempFamIsNominee, setTempFamIsNominee] = useState(true);

  // Step 3: Financial Information State
  const [assetList, setAssetList] = useState<
    Array<{
      name: string;
      category: AssetCategory;
      institution: string;
      estimatedValue: number;
    }>
  >([]);
  const [tempAssetName, setTempAssetName] = useState('');
  const [tempAssetCat, setTempAssetCat] = useState<AssetCategory>('Banking');
  const [tempAssetInst, setTempAssetInst] = useState('');
  const [tempAssetVal, setTempAssetVal] = useState('50000');

  // Step 4: Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ name: string; size: string; category: any }>>([]);

  // Step 5: AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Step 1: Save Profile
  const handleSaveStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: fullName,
      dateOfBirth: dob,
      phone,
      address,
      occupation,
    });
    setStep(2);
  };

  // Step 2: Add Family Member
  const handleAddFamilyMember = () => {
    if (!tempFamName || !tempFamEmail) return;
    const newMember = {
      name: tempFamName,
      relationship: tempFamRel,
      email: tempFamEmail,
      phone: tempFamPhone,
      isNominee: tempFamIsNominee,
      accessPermissions: ['Banking', 'EPF', 'Insurance'] as AssetCategory[],
    };
    setFamilyList((prev) => [...prev, newMember]);
    addFamilyMember({
      ...newMember,
      verificationStatus: 'Not Requested',
    });
    setTempFamName('');
    setTempFamEmail('');
    setTempFamPhone('');
  };

  // Step 3: Add Asset
  const handleAddAsset = () => {
    if (!tempAssetName || !tempAssetInst) return;
    const val = Number(tempAssetVal) || 25000;
    const newAst = {
      name: tempAssetName,
      category: tempAssetCat,
      institution: tempAssetInst,
      estimatedValue: val,
    };
    setAssetList((prev) => [...prev, newAst]);
    addAsset({
      name: tempAssetName,
      category: tempAssetCat,
      institution: tempAssetInst,
      estimatedValue: val,
      maskedAccountRef: 'XXXXXX' + Math.floor(1000 + Math.random() * 9000),
      evidenceSource: 'Self-reported onboarding',
      confidenceScore: 92,
      verificationStatus: 'Unverified',
      linkedDocumentIds: [],
    });
    setTempAssetName('');
    setTempAssetInst('');
    setTempAssetVal('50000');
  };

  // Step 4: Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const docItem = {
        name: file.name,
        size: (file.size / 1024).toFixed(0) + ' KB',
        category: 'Bank Statements',
      };
      setUploadedDocs((prev) => [...prev, docItem]);
      uploadDocument(docItem);
    }
  };

  // Step 5: Run AI Analysis & Complete Onboarding
  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
      completeOnboarding();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#22D3EE', '#F59E0B'],
      });
      setTimeout(() => {
        if (onClose) onClose();
      }, 1800);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1E32] border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Header with Step Tracker */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E3A5F]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                First-Time User Setup
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Welcome to FINANCE LEGACY
            </h2>
            <p className="text-xs text-slate-400">
              Create your financial legacy profile in 5 simple steps.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10283D] border border-emerald-500/40 text-emerald-300">
            Step {step} of 5
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-[#061525] rounded-full h-1.5 my-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: PERSONAL PROFILE */}
        {step === 1 && (
          <form onSubmit={handleSaveStep1} className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Step 1 — Personal Profile</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditi Rao"
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Occupation</label>
                <input
                  type="text"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Architect, Consultant, Salaried"
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Residential Address / City</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-2"
              >
                <span>Continue to Family Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: FAMILY & NOMINEE INFORMATION */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Step 2 — Family & Nominees</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Add spouse, parents, children, or trusted family members to be designated as financial nominees.
            </p>

            {/* Added members list */}
            {familyList.length > 0 && (
              <div className="space-y-2 mb-3">
                <span className="font-semibold text-slate-300 block">Added Members:</span>
                {familyList.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{m.name}</span>
                      <span className="text-cyan-300 ml-2">({m.relationship})</span>
                      <span className="text-slate-400 text-[10px] block">{m.email}</span>
                    </div>
                    {m.isNominee && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        Designated Nominee
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a member */}
            <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={tempFamName}
                    onChange={(e) => setTempFamName(e.target.value)}
                    placeholder="e.g. Vikram Rao"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Relationship</label>
                  <select
                    value={tempFamRel}
                    onChange={(e) => setTempFamRel(e.target.value as any)}
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={tempFamEmail}
                    onChange={(e) => setTempFamEmail(e.target.value)}
                    placeholder="vikram@email.com"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={tempFamPhone}
                    onChange={(e) => setTempFamPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={tempFamIsNominee}
                  onChange={(e) => setTempFamIsNominee(e.target.checked)}
                  className="rounded text-emerald-500"
                />
                <span>Grant Nominee Succession Rights for this member</span>
              </label>

              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="w-full py-1.5 rounded-lg bg-[#10283D] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Family Member</span>
              </button>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-2"
              >
                <span>Continue to Financial Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIAL INFORMATION */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Step 3 — Known Financial Accounts & Assets</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Add your known bank accounts, fixed deposits, EPF/PF accounts, life insurance, or mutual funds.
            </p>

            {/* Added assets list */}
            {assetList.length > 0 && (
              <div className="space-y-2 mb-3">
                <span className="font-semibold text-slate-300 block">Registered Assets:</span>
                {assetList.map((a, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{a.name}</span>
                      <span className="text-slate-400 text-[10px] block">{a.institution} • {a.category}</span>
                    </div>
                    <span className="font-extrabold text-emerald-400">
                      ₹{a.estimatedValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add asset */}
            <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account / Asset Name</label>
                  <input
                    type="text"
                    value={tempAssetName}
                    onChange={(e) => setTempAssetName(e.target.value)}
                    placeholder="e.g. HDFC Salary Savings"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={tempAssetCat}
                    onChange={(e) => setTempAssetCat(e.target.value as any)}
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  >
                    <option value="Banking">Banking</option>
                    <option value="EPF">EPF / PF</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Investments">Investments</option>
                    <option value="Pension">Pension</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    value={tempAssetInst}
                    onChange={(e) => setTempAssetInst(e.target.value)}
                    placeholder="e.g. HDFC Bank, LIC, EPFO"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={tempAssetVal}
                    onChange={(e) => setTempAssetVal(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddAsset}
                className="w-full py-1.5 rounded-lg bg-[#10283D] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Financial Record</span>
              </button>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-2"
              >
                <span>Continue to Document Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DOCUMENT UPLOAD */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Step 4 — Upload Initial Financial Records</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Upload any bank statements, salary slips, tax forms (26AS), or insurance receipts for AI discovery.
            </p>

            <div className="border-2 border-dashed border-[#1E3A5F] hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-[#061525]/70 transition-all">
              <input
                type="file"
                id="onboardFile"
                className="hidden"
                onChange={handleFileUpload}
              />
              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-white text-xs mb-1">Click to select files or drag & drop</p>
              <p className="text-[10px] text-slate-400 mb-3">PDF, JPG, PNG supported</p>
              <label
                htmlFor="onboardFile"
                className="cursor-pointer px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald inline-block"
              >
                Select Files
              </label>
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block">Uploaded for Analysis:</span>
                {uploadedDocs.map((d, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#061525] border border-emerald-500/30 flex items-center justify-between">
                    <span className="font-semibold text-white">{d.name}</span>
                    <span className="text-emerald-400 font-bold">{d.size}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-2"
              >
                <span>Continue to AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: AI ANALYSIS & DISCOVERY ENGINE */}
        {step === 5 && (
          <div className="space-y-5 text-xs text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-emerald">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Step 5 — AI Deductive Analysis</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                Our AI Financial Intelligence Engine will now synthesize your profile, cross-correlate career milestones, detect missing financial gaps, and calibrate your initial Financial Legacy Score.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] text-left space-y-2 text-[11px] max-w-md mx-auto">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Identity & Profile Information Registered</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Family & Nominee Succession Permissions Initialized</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Evidence Records Categorized in Encrypted Vault</span>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="space-y-2 pt-2">
                <div className="w-7 h-7 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-cyan-300 font-semibold animate-pulse">Running Financial Intelligence Engine...</p>
              </div>
            ) : analysisDone ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Setup Complete! Welcome to your Financial Legacy.</span>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all transform hover:scale-105"
                >
                  Launch AI Financial Intelligence
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
