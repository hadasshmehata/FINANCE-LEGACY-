import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  FileText,
  AlertCircle,
  Building,
  UserCheck,
  ArrowRight,
  Shield,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClaimNavigator: React.FC = () => {
  const { assets, setActiveTab, addClaim } = useApp();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[2]?.id || assets[0]?.id || '');
  const activeAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const [checklist, setChecklist] = useState({
    identityProof: true,
    employmentRecords: true,
    uanInfo: true,
    bankPassbookCopy: false,
    indemnityBond: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate readiness percentage
  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((completedItems / totalItems) * 100);

  const handleStartClaim = () => {
    if (!activeAsset) return;
    addClaim({
      assetId: activeAsset.id,
      assetName: activeAsset.name,
      institution: activeAsset.institution,
      assetType: activeAsset.category,
      amount: activeAsset.estimatedValue,
      currentStage: 'Claim Submitted',
      progressPercentage: readinessPercent,
      submissionDate: 'Today',
      followUpDate: 'In 14 Days',
      readinessScore: readinessPercent,
      notes: `Claim initiated via AI Claim Navigator for ${activeAsset.name}`,
      tasks: [
        { id: `t_${Date.now()}_1`, title: 'Identity Proof Verification', completed: checklist.identityProof },
        { id: `t_${Date.now()}_2`, title: 'Form and Cheque Submission', completed: checklist.bankPassbookCopy },
      ],
      history: [
        { stage: 'Asset Discovered', date: activeAsset.discoveryDate, description: 'Asset discovered', completed: true },
        { stage: 'Verification Complete', date: 'Today', description: 'Documentation checklist verified', completed: true },
        { stage: 'Claim Submitted', date: 'Today', description: 'Lodge with institution', completed: true },
        { stage: 'Under Verification', date: 'Pending', description: 'Awaiting institutional officer', completed: false },
        { stage: 'Recovery Pending', date: 'Pending', description: 'Fund transfer to account', completed: false },
      ],
    });
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              AI Claim Navigator
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Get Step-by-Step Recovery Guidance</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated checklist, institutional SOPs, and document readiness calculation for every discovered asset.
          </p>
        </div>

      {/* Asset Selector Dropdown or Empty Badge */}
      <div className="flex items-center gap-2">
        {assets.length > 0 ? (
          <>
            <label className="text-xs text-slate-400 font-medium hidden sm:inline">Active Asset:</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="bg-[#061525] border border-emerald-500/50 rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-300 outline-none"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (₹{a.estimatedValue.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('assets')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            + Add Asset First
          </button>
        )}
      </div>
    </div>

    {assets.length === 0 ? (
      <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-10 text-center shadow-card space-y-4">
        <Compass className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Discovered Assets to Navigate</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The AI Claim Navigator generates personalized statutory checklists and standard operating procedures once an asset is detected or added.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('assets')}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
          >
            Go to Asset Discovery
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-cyan-300 font-bold text-xs"
          >
            Upload Statement
          </button>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Readiness Gauge & Checklists (Exact match with prototype: 65% Ready) */}
        <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Target Recovery Entity
                </span>
                <h3 className="text-lg font-extrabold text-white">{activeAsset?.name}</h3>
                <p className="text-xs text-slate-400">
                  {activeAsset?.institution} • Potential asset identified with {activeAsset?.confidenceScore}% match
                </p>
              </div>

              {/* Circular Gauge matching prototype: 65% Ready */}
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0B1E32"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.8"
                    strokeDasharray={`${readinessPercent}, 100`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-white">{readinessPercent}%</span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase">Ready</span>
                </div>
              </div>
            </div>

            {/* Required Document Checklist (Matching prototype checklist) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Document Checklist & Proofs
              </h4>

              <div
                onClick={() => toggleCheck('identityProof')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  checklist.identityProof
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${checklist.identityProof ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold text-slate-200">Identity Proof (Aadhaar / PAN Card)</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{checklist.identityProof ? 'Verified' : 'Pending'}</span>
              </div>

              <div
                onClick={() => toggleCheck('employmentRecords')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  checklist.employmentRecords
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${checklist.employmentRecords ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold text-slate-200">Employment Records / Salary Slips</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{checklist.employmentRecords ? 'Verified' : 'Pending'}</span>
              </div>

              <div
                onClick={() => toggleCheck('uanInfo')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  checklist.uanInfo
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${checklist.uanInfo ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold text-slate-200">UAN / Account Number Information</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{checklist.uanInfo ? 'Verified' : 'Pending'}</span>
              </div>

              <div
                onClick={() => toggleCheck('bankPassbookCopy')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  checklist.bankPassbookCopy
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${checklist.bankPassbookCopy ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold text-slate-200">Active Bank Cancelled Cheque</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{checklist.bankPassbookCopy ? 'Verified' : 'Pending'}</span>
              </div>

              <div
                onClick={() => toggleCheck('indemnityBond')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  checklist.indemnityBond
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-4 h-4 ${checklist.indemnityBond ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold text-slate-200">Notarized Indemnity Bond (If receipts lost)</span>
                </div>
                <span className="text-[10px] font-bold uppercase">{checklist.indemnityBond ? 'Verified' : 'Optional'}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Generate Checklist & Start Claim (Exact match with prototype: Generate Checklist) */}
          <div className="pt-4 border-t border-[#1E3A5F] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleStartClaim}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Generate Checklist & Submit Claim</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('letters')}
              className="px-4 py-2.5 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Draft Claim Letter</span>
            </button>
          </div>
        </div>

        {/* Right Column: Institutional Recovery Step-by-Step SOP */}
        <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                Official Recovery Roadmap
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono">
                {activeAsset?.institution} SOP
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Identify & Lock Account Footprint</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    Match the masked reference ({activeAsset?.maskedAccountRef}) with your consolidated tax credit (Form 26AS) or historical salary records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Generate Formal Recovery Application</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    Use our AI Claim Letter Generator to draft an RBI / EPFO compliant claim petition with statutory reference numbers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Institutional KYC Verification</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    Submit self-attested Aadhaar, PAN, and active bank cancelled cheque to {activeAsset?.institution} online portal or designated home branch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Fund Disbursement & Closure</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    Direct electronic NEFT/RTGS credit to your verified active bank account within 15–21 working days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
            <span>Official Government Guidelines strictly adhered to.</span>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>View In Claim Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

